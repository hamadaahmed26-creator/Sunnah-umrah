export const encode=bytes=>btoa(String.fromCharCode(...bytes)).replaceAll('+','-').replaceAll('/','_').replaceAll('=','');
const decode=text=>Uint8Array.from(atob(text.replaceAll('-','+').replaceAll('_','/')),c=>c.charCodeAt(0));
export const newKey=()=>encode(crypto.getRandomValues(new Uint8Array(32)));
const keyFor=key=>crypto.subtle.importKey('raw',decode(key),'AES-GCM',false,['encrypt','decrypt']);
const params=(iv,id,captured)=>({name:'AES-GCM',iv,additionalData:new TextEncoder().encode(id+':'+captured)});
export async function seal(key,id,fix){
 const iv=crypto.getRandomValues(new Uint8Array(12));
 const bytes=await crypto.subtle.encrypt(params(iv,id,fix.captured),await keyFor(key),new TextEncoder().encode(JSON.stringify(fix)));
 return encode([...iv,...new Uint8Array(bytes)]);
}
export async function open(key,row){
 const bytes=decode(row.packet);
 const raw=await crypto.subtle.decrypt(params(bytes.slice(0,12),row.id,row.captured),await keyFor(key),bytes.slice(12));
 const fix=JSON.parse(new TextDecoder().decode(raw));
 if(fix.captured!==row.captured||!Number.isFinite(fix.lat)||Math.abs(fix.lat)>90||!Number.isFinite(fix.lng)||Math.abs(fix.lng)>180||!Number.isFinite(fix.accuracy)||fix.accuracy<0)throw Error('Invalid GPS fix');
 return fix;
}
