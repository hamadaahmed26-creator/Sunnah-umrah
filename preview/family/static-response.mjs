// Serve byte ranges for Safari's media probes on the private preview.
export function staticResponse(request, mime, base64) {
  const headers = new Headers({'Content-Type':mime,'Cache-Control':'no-cache',
    'Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'});
  const bytes = Uint8Array.from(atob(base64), char=>char.charCodeAt(0));
  let status=200, body=bytes;
  if(mime.startsWith('audio/')){
    headers.set('Accept-Ranges','bytes');
    const range=/^bytes=(\d*)-(\d*)$/i.exec(request.headers.get('Range')||'');
    if(request.method==='GET' && range && (range[1]||range[2])){
      const start=range[1]?Number(range[1]):Math.max(0,bytes.length-Number(range[2]));
      const end=range[1]&&range[2]?Math.min(bytes.length-1,Number(range[2])):bytes.length-1;
      if(!Number.isSafeInteger(start)||start>end){
        headers.set('Content-Range','bytes */'+bytes.length);
        return new Response(null,{status:416,headers});
      }
      status=206;
      headers.set('Content-Range',`bytes ${start}-${end}/${bytes.length}`);
      body=bytes.subarray(start,end+1);
    }
  }
  headers.set('Content-Length',String(body.length));
  return new Response(request.method==='HEAD'?null:body,{status,headers});
}
