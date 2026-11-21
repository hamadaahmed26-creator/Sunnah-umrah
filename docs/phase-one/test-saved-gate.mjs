import test from 'node:test';
import assert from 'node:assert/strict';
import {captureGate,readSavedGate,writeSavedGate} from '../../frontend/public/companion/saved-gate.js';

const now=1730000000000;
const position={coords:{latitude:21.42155,longitude:39.8249,accuracy:8},timestamp:now};

test('a saved gate needs a current, valid and sufficiently accurate device fix',()=>{
  assert.deepEqual(captureGate(position,now),{lat:21.42155,lng:39.8249,accuracy:8,captured:now});
  for(const timestamp of [0,now+1,now-30001,NaN])assert.equal(captureGate({...position,timestamp},now),null);
  for(const patch of [{accuracy:NaN},{accuracy:0},{accuracy:51},{latitude:91},{longitude:181}]){
    assert.equal(captureGate({...position,coords:{...position.coords,...patch}},now),null);
  }
});

test('a single stationary saved gate survives reopening offline and can be replaced or forgotten',()=>{
  const values=new Map(),key='saved-gate',storage={
    getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)
  };
  const point=captureGate(position,now);
  writeSavedGate(storage,key,{...point,member:'private'});
  assert.deepEqual(readSavedGate(storage,key),point);
  const other={...point,lat:21.43,captured:now+5000};
  writeSavedGate(storage,key,other);
  assert.equal(values.size,1);assert.deepEqual(readSavedGate(storage,key),other);
  assert.throws(()=>writeSavedGate(storage,key,{...other,lat:999}));
  assert.deepEqual(readSavedGate(storage,key),other);
  writeSavedGate(storage,key,null);assert.equal(readSavedGate(storage,key),null);
  for(const bad of ['{}','null','bad JSON','{"lat":6}']){
    storage.setItem(key,bad);assert.equal(readSavedGate(storage,key),null);
  }
});
