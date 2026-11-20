// Local browser acceptance only. Exercise the same SQL and transaction boundaries as D1.
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
export function localDB(){
 const db=new DatabaseSync(':memory:');
 db.exec(readFileSync(new URL('./drizzle/0000_family.sql',import.meta.url),'utf8'));
 return {
  prepare(query){return {bind(...args){
   const stmt=db.prepare(query);
   return {first:()=>stmt.get(...args),all:()=>({results:stmt.all(...args)}),run:()=>({meta:stmt.run(...args)})};
  }}},
  batch(items){db.exec('BEGIN');try{const out=items.map(i=>i.run());db.exec('COMMIT');return out}catch(e){db.exec('ROLLBACK');throw e}}
 };
}
