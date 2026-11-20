export const prayerNames=['Fajr','Dhuhr','Asr','Maghrib','Isha'];
export function zonedClock(instant, zone) {
  const parts=new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(instant);
  const at=Object.fromEntries(parts.map(p=>[p.type,p.value]));
  return {day:[at.day,at.month,at.year].join('-'),minute:at.hour+':'+at.minute};
}
export async function fetchTimetable({city,country,coordinates,zone},signal){
  const now=new Date();
  let day=zonedClock(now,zone).day;
  const params=new URLSearchParams({method:'4'});
  if(coordinates){
    params.set('latitude',String(coordinates.lat));params.set('longitude',String(coordinates.lng));
  } else {params.set('city',city);params.set('country',country)}
  for(let attempt=0;attempt<2;attempt++){
    const endpoint=coordinates?'timings':'timingsByCity';
    const response=await fetch('https://api.aladhan.com/v1/'+endpoint+'/'+day+'?'+params,{signal});
    if(!response.ok)throw Error('Timetable service unavailable');
    const {data}=await response.json();
    const timezone=data?.meta?.timezone;
    if(!timezone)throw Error('Timetable has no time zone');
    const there=zonedClock(new Date(),timezone).day;
    if(there!==day){day=there;continue}
    if(data.date?.gregorian?.date!==day)throw Error('Timetable date mismatch');
    const times={};
    for(const prayer of prayerNames){
      const value=data.timings?.[prayer];
      if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(value))throw Error('Invalid prayer time');
      times[prayer]=value;
    }
    return {times,timezone,day};
  }
  throw Error('Date changed during lookup');
}
export function bearingToKaaba(lat,lon){
  const rad=Math.PI/180;
  const delta=(39.8262-lon)*rad;
  const angle=Math.atan2(Math.sin(delta),Math.cos(lat*rad)*Math.tan(21.4225*rad)-Math.sin(lat*rad)*Math.cos(delta));
  return (angle/rad+360)%360;
}
