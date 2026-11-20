import http from 'node:http';
import worker from './dist/server/index.js';
import {localDB} from './local-db.mjs';
const DB=localDB();
const port=Number(process.env.PORT||process.argv[process.argv.indexOf('--port')+1])||5173;
http.createServer(async(req,res)=>{
 try {
  let body='';for await(const chunk of req)body+=chunk;
  const request=new Request('http://'+req.headers.host+req.url,{method:req.method,headers:req.headers,body:body||undefined});
  const response=await worker.fetch(request,{DB});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
 }catch{res.writeHead(500).end()}
}).listen(port,'0.0.0.0');
