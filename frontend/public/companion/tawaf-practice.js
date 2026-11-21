// Orthographic projection of a teaching model, with east at +x and south at +z.
// The same world points anchor the stone, masonry and their labels at every angle.
const black=[1,.22,1], yemeni=[-1,.22,1];
const round=n=>Math.round(n*10)/10;
function scene(yaw,progress,selected) {
  const a=yaw*Math.PI/180, c=Math.cos(a),s=Math.sin(a);
  const project=([x,y,z])=>[round(190+54*(x*c-z*s)),round(161+27*(x*s+z*c)-52*y)];
  const point=v=>project(v).join(',');
  const poly=(v,fill,other='')=>`<polygon points="${v.map(point).join(' ')}" fill="${fill}" ${other}/>`;
  const path=(v,color,width)=>`<polyline points="${v.map(point).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}"/>`;
  const face=(side,u,y)=>side==='east'?[1,y,-u]:[u,y,1];
  function wall(side){
    const pt=(u,y)=>face(side,u,y);
    const strip=(l,r,b,t,fill)=>poly([pt(l,b),pt(r,b),pt(r,t),pt(l,t)],fill);
    let g=strip(-1,1,0,1.94,side==='east'?'url(#silk-east)':'url(#silk-south)');
    for(let i=0;i<37;i++){const u=-.99+i*.054;g+=path([pt(u,.03),pt(u+.012,.78),pt(u,1.89)],i%3?'#333936':'#66695b',.35)}
    g+=strip(-1,1,1.43,1.61,'url(#gold-thread)')+strip(-1,1,1.46,1.48,'#5e512e')+strip(-1,1,1.56,1.57,'#6e5528');
    for(let i=0;i<12;i++){const u=-.93+i*.165;g+=poly([pt(u,1.52),pt(u+.045,1.55),pt(u+.09,1.52),pt(u+.045,1.49)],'#e9d597')}
    for(const u of [-.68,0,.68])g+=strip(u-.095,u+.095,1.29,1.34,'#b09a62');
    if(side==='east'){
      g+=strip(-.66,-.19,.30,1.18,'#856126')+strip(-.63,-.22,.33,1.15,'url(#gold-thread)');
      for(const u of [-.60,-.42])for(const y of [.40,.73])g+=strip(u,u+.15,y,y+.26,'#795b2b')+strip(u+.018,u+.132,y+.018,y+.24,'url(#gold-thread)');
    }
    return g;
  }
  const ring=(radius,y=0)=>Array.from({length:97},(_,i)=>{const theta=i*Math.PI/48;return [radius*Math.cos(theta),y,radius*Math.sin(theta)]});
  const orbit=q=>{const angle=(45-q*360)*Math.PI/180;return [2.45*Math.cos(angle),0,2.45*Math.sin(angle)]};
  const [mx,my]=project(orbit(progress)),[sx,sy]=project(black),[yx,yy]=project(yemeni);
  const marker=`<g><ellipse cx="${mx}" cy="${my+1}" rx="8" ry="4" fill="#064e47" opacity=".22"/><circle cx="${mx}" cy="${my-3}" r="6.5" fill="#fff" stroke="#086a61" stroke-width="3"/></g>`;
  let floor='';
  for(const radius of [1.8,2.15,2.45,2.8,3.15,3.5,4.05])floor+=path(ring(radius),'#d6ccae',.75);
  for(let i=0;i<36;i++){const k=i*Math.PI/18;floor+=path([[1.5*Math.cos(k),0,1.5*Math.sin(k)],[4.1*Math.cos(k),0,4.1*Math.sin(k)]],'#e2dac5',.65)}
  let arrows='';
  for(const q of [.14,.40,.67,.91])arrows+=`<path d="M ${point(orbit(q-.035))} L ${point(orbit(q))}" stroke="#258379" stroke-width="2.8" marker-end="url(#route-arrow)"/>`;
  const rear=orbit(progress)[0]*s+orbit(progress)[2]*c<0;
  return `<svg viewBox="0 0 380 271" aria-hidden="true" focusable="false"><defs>
  <linearGradient id="silk-east"><stop stop-color="#101b1b"/><stop offset=".65" stop-color="#333c39"/><stop offset="1" stop-color="#172020"/></linearGradient>
  <linearGradient id="silk-south"><stop stop-color="#333c37"/><stop offset=".35" stop-color="#26322e"/><stop offset="1" stop-color="#101917"/></linearGradient>
  <linearGradient id="gold-thread" x2=".9" y2=".65"><stop stop-color="#a47a37"/><stop offset=".4" stop-color="#f5dda1"/><stop offset=".7" stop-color="#bf984a"/><stop offset="1" stop-color="#ead18f"/></linearGradient>
  <radialGradient id="courtyard"><stop stop-color="#fffcf1"/><stop offset="1" stop-color="#eae2ce"/></radialGradient>
  <marker id="route-arrow" viewBox="0 0 8 8" markerWidth="3" markerHeight="3" refX="6" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#258379"/></marker></defs>
  <rect width="380" height="271" fill="url(#courtyard)"/>${floor}${path(ring(2.45),'#65a59a',2)}${arrows}
  ${path([[1,0,1],orbit(0)],'#9a713d',2)}${rear?marker:''}
  ${poly([[-1,0,-1],[1,0,-1],[1.15,0,1.2],[-1.35,0,1.18]],'#c6bda5')}
  ${wall('south')}${wall('east')}
  ${poly([[-1,1.94,-1],[1,1.94,-1],[1,1.94,1],[-1,1.94,1]],'#4b5149','stroke="#333b35" stroke-width=".8"')}
  ${poly([[-.92,1.94,-.92],[.92,1.94,-.92],[.92,1.94,.92],[-.92,1.94,.92]],'#757366')}
  <g transform="translate(${sx} ${sy}) rotate(8)"><ellipse rx="4.2" ry="7" fill="#e7e7dd" stroke="#848e89"/><ellipse rx="2.4" ry="4.5" fill="#2e2422"/></g>
  ${poly([[-1,.04,1],[-.88,.04,1],[-.88,.3,1],[-1,.35,1]],'#b28d71')}
  ${!rear?marker:''}
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">${[[yx,yy,87,'#865323','yemeni'],[sx,sy,287,'#00655c','stone']].map(([x,y,end,color,id])=>`<path d="M${x} ${y+7} L${end} 237 V262" stroke="#fff9ea" stroke-width="5"/><path d="M${x} ${y+7} L${end} 237 V262" stroke="${color}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="${selected===id?12:8}" stroke="${color}" stroke-width="2.2"/>`).join('')}</g></svg>`;
}

export function practiceCircuit(t,practice=true) {
  return `<details class="practice-circuit tawaf-model" ${practice?'open':''}><summary>${t('Explore one Tawaf circuit','تدرّب على شوط واحد من الطواف')}</summary>
  <div class="model-stage"><div data-model-scene dir="ltr"></div><div class="model-corners" dir="ltr"><button type="button" data-corner="yemeni" aria-pressed="false" dir="auto">${t('Yemeni Corner','الركن اليماني')}</button><button type="button" data-corner="stone" aria-pressed="true" dir="auto">${t('Black Stone','الحجر الأسود')}</button></div></div>
  <p data-model-note></p>
  <label>${t('Move through the diagram','حرّك المؤشر في الرسم')}<input type="range" min="0" max="100" step="1" value="0" dir="ltr" data-circuit-position></label>
  <output aria-live="polite"></output><small>${t('Practice diagram only. Your counters stay the same.','رسم للتدريب فقط. تظل عداداتك كما هي.')}</small></details>`;
}
export function showPosition(input,t) {
  const diagram=input.closest('.practice-circuit');
  const q=Number(input.value)/100,selected=q===0||q===1?'stone':q===.75?'yemeni':'';
  const label=q===1?t('Back at the starting line · one circuit','عند خط البداية مجددًا · شوط واحد'):q===0?t('Starting line','خط البداية'):q===.75?t('Yemeni Corner','الركن اليماني'):Math.round(q*100)+'%';
  diagram.querySelector('[data-model-scene]').innerHTML=scene(Number(diagram.dataset.yaw||32),q,selected);
  diagram.querySelector('[data-model-note]').textContent=selected==='yemeni'?t('From the Yemeni Corner to the Black Stone','بين الركن اليماني والحجر الأسود'):t('Start level with the Black Stone. Keep the Ka‘bah on your left until you return to the same line.','ابدأ بمحاذاة الحجر الأسود واجعل الكعبة عن يسارك حتى تعود إلى المحاذاة نفسها.');
  for(const button of diagram.querySelectorAll('[data-corner]')){
    button.setAttribute('aria-pressed',String(button.dataset.corner===selected));
    button.onclick=()=>{const stone=button.dataset.corner==='stone';diagram.dataset.yaw=stone?'49':'17';input.value=stone?'0':'75';showPosition(input,t)};
  }
  input.setAttribute('aria-valuetext',label);diagram.querySelector('output').textContent=label;
}
