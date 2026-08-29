import { useEffect, useState } from 'react'
export function Link({to, children, onClick, ...props}) { return <a href={to} {...props} onClick={e => { onClick?.(e); if (!e.defaultPrevented && to.startsWith('/')) { e.preventDefault(); history.pushState({}, '', to); dispatchEvent(new Event('popstate')); scrollTo(0,0) } }}>{children}</a> }
export function usePath() { const [path,setPath] = useState(location.pathname); useEffect(() => { const f=()=>setPath(location.pathname); addEventListener('popstate',f); return()=>removeEventListener('popstate',f) },[]); return path }
