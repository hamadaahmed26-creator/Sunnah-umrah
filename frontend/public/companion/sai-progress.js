// Seven ONE-WAY Sa'i trips, never seven return journeys.
// Pure helpers shared by Practice and Live, so the displayed destination
// always derives from the same persisted counter as the arrival button.
export const SAI_TRIPS = Object.freeze(Array.from({length:7},(_,index)=>Object.freeze({
  number:index+1,from:index%2===0?'safa':'marwah',to:index%2===0?'marwah':'safa'
})));

export function saiProgress(count){
  const done=Number.isInteger(count)?Math.max(0,Math.min(7,count)):0;
  return Object.freeze({
    completed:done,finished:done===7,
    location:done%2===0?'safa':'marwah',
    next:done===7?null:SAI_TRIPS[done],
    last:done===0?null:SAI_TRIPS[done-1]
  });
}

export function saiProgressHtml(count,say){
  const state=saiProgress(count);
  const place=value=>value==='safa'?say('Safa','الصفا'):say('Marwah','المروة');
  const tripTitle=state.finished
    ?say('All seven one-way trips completed at Marwah.','اكتملت الأشواط السبعة عند المروة.')
    :say('Trip','الشوط')+' '+state.next.number+' '+say('of','من')+' 7';
  const direction=state.finished
    ?say('Next: complete the hair-cutting step. There is no eighth trip.','التالي: الحلق أو التقصير. لا يوجد شوط ثامن.')
    :place(state.next.from)+' → '+place(state.next.to);
  const prompt=state.finished
    ?say('You have finished Sa’i at Marwah.','أتممت السعي عند المروة.')
    :say('You are at','أنت الآن عند')+' '+place(state.location)+'. '+say('Walk to','توجّه إلى')+' '+place(state.next.to)+'. '+say('Record the trip only after you arrive.','سجّل الشوط بعد الوصول فقط.');
  const rows=SAI_TRIPS.map(trip=>{
    const status=trip.number<=state.completed?'done':trip.number===state.next?.number?'current':'upcoming';
    return '<li class="'+status+'"'+(status==='current'?' aria-current="step"':'')+'><span class="sai-number">'+trip.number+'</span><span>'+place(trip.from)+' → '+place(trip.to)+'</span></li>';
  }).join('');
  return '<section class="sai-route" aria-label="'+say('Seven Sa’i journeys','أشواط السعي السبعة')+'">'
    +'<div class="sai-route-heading"><h2>'+tripTitle+'</h2><strong>'+direction+'</strong></div>'
    +'<p role="status">'+prompt+'</p>'
    +'<div role="progressbar" aria-label="'+say('One-way trips completed','الأشواط المكتملة')+'" aria-valuemin="0" aria-valuemax="7" aria-valuenow="'+state.completed+'" style="--percent:'+((state.completed/7)*100).toFixed(2)+'%"></div>'
    +'<details><summary>'+say('See all seven trips','عرض الأشواط السبعة')+'</summary><ol class="sai-trip-list">'+rows+'</ol></details>'
    +'</section>';
}
