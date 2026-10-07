import {useCallback, useEffect, useState} from 'react'

export default function BonafidePage(){
  const [requests,setRequests]=useState([])
  const [state,setState]=useState({loading:true,error:'',busy:null})

  const load=useCallback(async()=>{
    setState({loading:true,error:'',busy:null})
    try{
      const response=await fetch('/api/bonafide?role=principal')
      const data=await response.json()
      if(!response.ok) throw Error(data.message||'Unable to load requests.')
      setRequests(data.requests)
      setState({loading:false,error:'',busy:null})
    }catch(error){
      setState({loading:false,error:error.message,busy:null})
    }
  },[])

  useEffect(()=>{load()},[load])

  const approve=async id=>{
    setState(current=>({...current,busy:id,error:''}))
    try{
      const response=await fetch(`/api/bonafide/${id}/approve`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({approvedBy:'Principal'})
      })
      const data=await response.json()
      if(!response.ok) throw Error(data.message||'Approval failed.')
      setRequests(current=>current.filter(request=>request.id!==id))
    }catch(error){
      setState(current=>({...current,error:error.message}))
    }finally{
      setState(current=>({...current,busy:null}))
    }
  }

  return <section className="bonafide-page">
    <div className="bonafide-top">
      <div>
        <p className="eyebrow gold">Principal workspace</p>
        <h1>Bonafide requests</h1>
        <p>Review requests verified by the Fee Section and approve them for completion.</p>
      </div>
      <button className="outline" onClick={load} disabled={state.loading}>↻ Refresh list</button>
    </div>
    {state.error&&<div className="bonafide-error" role="alert">⚠ {state.error}</div>}
    <div className="bonafide-card">
      <div className="bonafide-card-head">
        <div><b>Pending principal approval</b><span>{requests.length} request(s) in your college</span></div>
        <strong>{requests.length?'Principal pending':'All clear'}</strong>
      </div>
      {state.loading?<p className="bonafide-empty">Loading requests…</p>
        :requests.length===0?<p className="bonafide-empty">No pending bonafide requests.</p>
          :requests.map(request=><article className="bonafide-row" key={request.id}>
            <div className="student-icon">♙</div>
            <div className="student-details">
              <h3>{request.studentName} <span>PRINCIPAL PENDING</span></h3>
              <p>Admission no: <b>{request.admissionNo}</b> · Department: <b>{request.department}</b></p>
              <p>Submitted {request.submittedAt} · Request ID: <b>#{request.id}</b></p>
              <div><b>Reason:</b> {request.reason}</div>
            </div>
            <div className="bonafide-actions">
              <button className="outline" onClick={()=>window.alert(`${request.studentName}\n${request.admissionNo}\n${request.department}`)}>◉ View student</button>
              <button className="primary" onClick={()=>approve(request.id)} disabled={state.busy===request.id}>
                {state.busy===request.id?'Approving…':'✓ Approve request'}
              </button>
            </div>
          </article>)}
    </div>
  </section>
}
