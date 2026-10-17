import {useEffect,useState} from 'react'
import {adminRequest} from '../../api/content'
export default function EnquiriesAdmin(){
  const [items,setItems]=useState([])
  const [filter,setFilter]=useState('all')
  const [state,setState]=useState({loading:true,busy:'',error:''})
  const load=async()=>{setState(current=>({...current,loading:true,error:''}));try{const data=await adminRequest('enquiries');setItems(data.items);setState({loading:false,busy:'',error:''})}catch(error){setState({loading:false,busy:'',error:error.message})}}
  useEffect(()=>{let active=true;adminRequest('enquiries').then(data=>{if(active){setItems(data.items);setState({loading:false,busy:'',error:''})}}).catch(error=>{if(active)setState({loading:false,busy:'',error:error.message})});return()=>{active=false}},[])
  const update=async(item,status)=>{
    setState(current=>({...current,busy:item._id,error:''}))
    try{const result=await adminRequest(`enquiries/${item._id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});setItems(current=>current.map(record=>record._id===item._id?result.item:record));setState(current=>({...current,busy:''}))}catch(error){setState(current=>({...current,busy:'',error:error.message}))}
  }
  const remove=async item=>{
    if(!window.confirm(`Delete the enquiry from ${item.name}?`))return
    setState(current=>({...current,busy:item._id,error:''}))
    try{await adminRequest(`enquiries/${item._id}`,{method:'DELETE'});setItems(current=>current.filter(record=>record._id!==item._id));setState(current=>({...current,busy:''}))}catch(error){setState(current=>({...current,busy:'',error:error.message}))}
  }
  const visible=items.filter(item=>filter==='all'||item.status===filter)
  return <section className="admin-manager"><div className="admin-manager-heading"><div><p className="eyebrow">COMMUNITY INBOX</p><h2>Enquiries</h2></div><button className="outline" onClick={load} disabled={state.loading}>Refresh</button></div><label className="admin-filter">Filter by status <select value={filter} onChange={event=>setFilter(event.target.value)}>{['all','new','read','resolved'].map(status=><option key={status} value={status}>{status[0].toUpperCase()+status.slice(1)}</option>)}</select></label>{state.error&&<p className="admin-error" role="alert">{state.error}</p>}{state.loading&&<p role="status">Loading enquiries…</p>}{!state.loading&&!visible.length&&<p className="admin-empty">No enquiries in this view. Messages from the contact form appear here.</p>}<div className="admin-enquiry-list">{visible.map(item=><article className="admin-enquiry" key={item._id}><div className="admin-manager-heading"><h3>{item.name}</h3><span className={`admin-status status-${item.status}`}>{item.status}</span></div><time dateTime={item.createdAt}>{new Date(item.createdAt).toLocaleString()}</time><div className="admin-enquiry-contact"><a href={`tel:${item.phone.replace(/[^+\d]/g,'')}`}>{item.phone}</a>{item.email&&<a href={`mailto:${item.email}`}>{item.email}</a>}</div><p className="admin-enquiry-message">{item.message||'No message provided.'}</p><div className="admin-record-actions"><label>Status <select value={item.status} disabled={state.busy===item._id} onChange={event=>update(item,event.target.value)}>{['new','read','resolved'].map(status=><option key={status} value={status}>{status}</option>)}</select></label><button className="admin-delete" onClick={()=>remove(item)} disabled={state.busy===item._id}>Delete</button></div></article>)}</div></section>
}
