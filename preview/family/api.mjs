// Owner-private preview only. The server receives encrypted fixes.
// Every read and mutation derives group and member identity from a device secret.
const token=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');
const hash=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),v=>v.toString(16).padStart(2,'0')).join('');
const tokenPattern=/^[0-9a-f]{64}$/;
const ttl=4*3600000;
export const fixLifetime=5*60000;
const result=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','Referrer-Policy':'no-referrer'}});
export async function familyAPI(req,db,now=Date.now()){
  const url=new URL(req.url);
  const action=url.pathname.split('/').pop();
  if(req.headers.get('origin') && req.headers.get('origin')!==url.origin)return result({},403);
  if(req.method!==(action==='members'?'GET':'POST'))return result({},405);
  let body={};
  if(req.method==='POST'){
    if(!req.headers.get('content-type')?.startsWith('application/json'))return result({},415);
    const text=await req.text();
    if(text.length>2048)return result({},413);
    try{body=JSON.parse(text)}catch{return result({},400)}
    if(!body||typeof body!=='object'||Array.isArray(body))return result({},400);
  }
  const sql=(query,...args)=>db.prepare(query).bind(...args);
  const removeExpired=()=>db.batch([
    sql('DELETE FROM family_members WHERE expires<=?',now),
    sql('UPDATE family_members SET packet=NULL WHERE packet IS NOT NULL AND captured<=?',now-fixLifetime)
  ]);
  if(action==='create'||action==='join'){
    const name=body.name?.trim?.();
    if(!name||name.length>40)return result({},400);
    const secret=token(), id=crypto.randomUUID(), digest=await hash(secret);
    await removeExpired();
    if(action==='create'){
      const group=crypto.randomUUID(), invite=token();
      await sql('INSERT INTO family_members(secret_hash,public_id,group_id,nickname,expires,invite_hash,invite_until) VALUES(?,?,?,?,?,?,?)',
        digest,id,group,name,now+ttl,await hash(invite),now+10*60000).run();
      return result({secret,id,invite,expires:now+ttl},201);
    }
    if(!tokenPattern.test(body.invite))return result({},403);
    const invite=await hash(body.invite);
    const [joined]=await db.batch([
      sql('INSERT INTO family_members(secret_hash,public_id,group_id,nickname,expires) SELECT ?,?,group_id,?,expires FROM family_members owner WHERE invite_hash=? AND invite_until>? AND expires>? AND (SELECT count(*) FROM family_members WHERE group_id=owner.group_id)<12',digest,id,name,invite,now,now),
      sql('UPDATE family_members SET invite_hash=NULL,invite_until=NULL WHERE invite_hash=?',invite)
    ]);
    return joined.meta.changes?result({secret,id},201):result({},403);
  }
  const secret=(req.headers.get('authorization')||'').replace(/^Bearer /,'');
  if(!tokenPattern.test(secret))return result({},401);
  const digest=await hash(secret);
  const member=await sql('SELECT public_id,group_id,expires,epoch FROM family_members WHERE secret_hash=? AND expires>?',digest,now).first();
  if(!member)return result({},401);
  if(action==='members'){
    await removeExpired();
    const rows=await sql('SELECT public_id AS id,nickname AS name,captured,packet FROM family_members WHERE group_id=? AND expires>? AND EXISTS (SELECT 1 FROM family_members WHERE secret_hash=?)',member.group_id,now,digest).all();
    return result({members:rows.results,epoch:member.epoch});
  }
  if(action==='leave'){
    await sql('DELETE FROM family_members WHERE secret_hash=?',digest).run();
    return result({left:true});
  }
  if(action==='invite'){
    const invite=token();
    await sql('UPDATE family_members SET invite_hash=?,invite_until=? WHERE secret_hash=?',await hash(invite),now+600000,digest).run();
    return result({invite});
  }
  if(action==='start'||action==='stop'){
    // A delayed "start" cannot reactivate an epoch which the owner revoked.
    if(!Number.isSafeInteger(body.epoch))return result({},400);
    const clause=action==='start'?' AND epoch=?':'';
    const args=[action==='start'?1:0,digest];
    if(action==='start')args.push(body.epoch);
    const row=await sql('UPDATE family_members SET epoch=epoch+1,active=?,packet=NULL,captured=0 WHERE secret_hash=?'+clause+' RETURNING epoch',...args).first();
    return row?result(row):result({},409);
  }
  if(action==='fix'){
    const {epoch,packet,captured}=body;
    if(!Number.isSafeInteger(epoch)||!Number.isSafeInteger(captured)||captured>now+5000||captured<now-60000||
       typeof packet!=='string'||packet.length>800||!/^[-_A-Za-z0-9]{40,}$/.test(packet))return result({},400);
    const saved=await sql('UPDATE family_members SET captured=?,packet=? WHERE secret_hash=? AND active=1 AND epoch=? AND captured<? AND expires>?',captured,packet,digest,epoch,captured,now).run();
    return saved.meta.changes?result({saved:true}):result({},409);
  }
  return result({},404);
}
