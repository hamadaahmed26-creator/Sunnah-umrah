// A schematic seen from above. The track and the stone share a starting ray.
// Use physical x/y coordinates so RTL text never mirrors the circuit.
export function practiceCircuit(t) {
  return `<details class="practice-circuit"><summary>${t('Explore one Tawaf circuit','تدرّب على شوط واحد من الطواف')}</summary>
  <p>${t('Start level with the Black Stone. Keep the Ka‘bah on your left until you return to the same line.','ابدأ بمحاذاة الحجر الأسود واجعل الكعبة عن يسارك حتى تعود إلى المحاذاة نفسها.')}</p>
  <div class="circuit-map" aria-hidden="true" dir="ltr"><div class="circuit-track"></div><div class="circuit-kaaba"></div><div class="circuit-start"></div><div class="circuit-marker"></div></div>
  <label>${t('Move through the diagram','حرّك المؤشر في الرسم')}<input type="range" min="0" max="4" step="1" value="0" dir="ltr" data-circuit-position></label>
  <output aria-live="polite"></output><small>${t('Practice diagram only. Your counters stay the same.','رسم للتدريب فقط. تظل عداداتك كما هي.')}</small></details>`;
}
export function showPosition(input,t) {
  const steps=[t('Starting line','خط البداية'),t('Quarter of a circuit','ربع شوط'),t('Half a circuit','نصف شوط'),t('Three quarters of a circuit','ثلاثة أرباع شوط'),t('Back at the starting line · one circuit','عند خط البداية مجددًا · شوط واحد')];
  const n=Number(input.value);
  const diagram=input.closest('.practice-circuit');
  diagram.style.setProperty('--marker-angle',(45-90*n)+'deg');
  input.setAttribute('aria-valuetext',steps[n]);
  diagram.querySelector('output').textContent=steps[n];
}
