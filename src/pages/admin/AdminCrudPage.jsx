import {useCallback,useEffect,useState} from 'react'
import {adminRequest} from '../../api/content'

const configurations={
  news:{
    title:'News',type:'news',
    fields:[['title','Title','text'],['summary','Summary','textarea'],['content','Full content','textarea']]
  },
  events:{
    title:'Events',type:'events',
    fields:[['title','Title','text'],['summary','Summary','textarea'],['content','Full details','textarea'],['date','Date and time','datetime-local'],['location','Location','text']]
  },
  gallery:{
    title:'Gallery',type:'gallery',
    fields:[['title','Title','text'],['description','Description / alt text','textarea']]
  },
  hero:{
    title:'Home hero images',type:'hero',
    fields:[['title','Hero text (shown over the image)','text'],['altText','Alternative text for the image','text']],
    checkboxes:[['active','Show in home hero']]
  }
}

function initialForm(config){
  return {
    ...Object.fromEntries(config.fields.map(([name])=>[name,''])),
    ...Object.fromEntries((config.checkboxes||[]).map(([name])=>[name,true]))
  }
}

function readDraft(section,config){
  try{
    const raw=localStorage.getItem(`admin-content-draft:${section}`)
    if(!raw)return {form:initialForm(config),editingId:'',mediaMode:'upload',mediaSourceUrl:'',mediaSourceType:'video',error:''}
    const draft=JSON.parse(raw)
    return {
      form:{...initialForm(config),...(draft.form||{})},
      editingId:typeof draft.editingId==='string'?draft.editingId:'',
      mediaMode:draft.mediaMode==='url'?'url':'upload',
      mediaSourceUrl:typeof draft.mediaSourceUrl==='string'?draft.mediaSourceUrl:'',
      mediaSourceType:draft.mediaSourceType==='image'?'image':'video',
      error:''
    }
  }catch{
    return {form:initialForm(config),editingId:'',mediaMode:'upload',mediaSourceUrl:'',mediaSourceType:'video',error:'Unable to restore the saved form draft from this browser.'}
  }
}

export default function AdminCrudPage({section}){
  const config=configurations[section]
  const [items,setItems]=useState([])
  const [editing,setEditing]=useState(null)
  const [draft]=useState(()=>readDraft(section,config))
  const [editingDraftId,setEditingDraftId]=useState(draft.editingId)
  const [form,setForm]=useState(draft.form)
  const [media,setMedia]=useState(null)
  const [mediaMode,setMediaMode]=useState(draft.mediaMode)
  const [mediaSourceUrl,setMediaSourceUrl]=useState(draft.mediaSourceUrl)
  const [mediaSourceType,setMediaSourceType]=useState(draft.mediaSourceType)
  const [state,setState]=useState({loading:true,recordsLoaded:false,saving:false,error:draft.error,notice:''})

  const load=useCallback(async()=>{
    setState(current=>({...current,loading:true,error:''}))
    try{
      const result=await adminRequest(config.type)
      setItems(result.items)
      setState(current=>({...current,loading:false,recordsLoaded:true}))
    }catch(error){
      setState(current=>({...current,loading:false,recordsLoaded:false,error:error.message}))
    }
  },[config.type])

  useEffect(()=>{load()},[load])

  useEffect(()=>{
    if(state.loading||!state.recordsLoaded)return
    const draftItem=items.find(item=>item._id===editingDraftId)
    if(draftItem)setEditing(draftItem)
    else if(editingDraftId){
      try{localStorage.removeItem(`admin-content-draft:${section}`)}
      catch{setState(current=>({...current,error:'Unable to clear the draft for a record that no longer exists.'}))}
      setForm(initialForm(config))
      setMediaSourceUrl('')
      setEditing(null)
      setEditingDraftId('')
    }
  },[config,editingDraftId,items,section,state.loading,state.recordsLoaded])

  useEffect(()=>{
    try{
      localStorage.setItem(`admin-content-draft:${section}`,JSON.stringify({
        form,
        editingId:editing?._id||editingDraftId||'',
        mediaMode,
        mediaSourceUrl,
        mediaSourceType
      }))
    }catch{
      setState(current=>({...current,error:'Unable to save the form draft in this browser.'}))
    }
  },[editingDraftId,editing,form,mediaMode,mediaSourceType,mediaSourceUrl,section])

  const resetForm=()=>{
    setEditing(null)
    setEditingDraftId('')
    setForm(initialForm(config))
    setMedia(null)
    setMediaSourceUrl('')
    setMediaSourceType('video')
    setMediaMode('upload')
    try{localStorage.removeItem(`admin-content-draft:${section}`)}
    catch{setState(current=>({...current,error:'Unable to clear the saved form draft.'}))}
    const fileInput=document.getElementById('content-media')
    if(fileInput)fileInput.value=''
  }

  const editItem=item=>{
    setEditing(item)
    setEditingDraftId(item._id)
    setForm(Object.fromEntries(config.fields.map(([name])=>{
      const value=item[name]??''
      return [name,name==='date'&&value?new Date(value).toISOString().slice(0,16):value]
    })))
    setMedia(null)
    setMediaSourceUrl('')
    setMediaSourceType('video')
    setMediaMode('upload')
    const fileInput=document.getElementById('content-media')
    if(fileInput)fileInput.value=''
    setState(current=>({...current,error:'',notice:''}))
  }

  const clearDraft=()=>{
    resetForm()
    setState(current=>({...current,error:'',notice:'Form draft cleared.'}))
  }

  const submit=async event=>{
    event.preventDefault()
    setState(current=>({...current,saving:true,error:'',notice:''}))
    const body=new FormData()
    Object.entries(form).forEach(([name,value])=>body.append(name,value))
    if(section==='gallery'){
      if(mediaMode==='url'&&mediaSourceUrl.trim()){
        body.append('mediaSourceUrl',mediaSourceUrl.trim())
        body.append('mediaSourceType',mediaSourceType)
      }
      if(mediaMode==='upload'&&media)body.append('media',media)
    }else if(media)body.append('media',media)
    try{
      const result=await adminRequest(`${config.type}${editing?`/${editing._id}`:''}`,{
        method:editing?'PUT':'POST',
        body
      })
      setState(current=>({...current,saving:false,notice:result.mediaCleanupWarning||`${config.title} saved successfully.`}))
      resetForm()
      await load()
    }catch(error){
      setState(current=>({...current,saving:false,error:error.message}))
    }
  }

  const remove=async item=>{
    if(!window.confirm(`Delete "${item.title}"? This cannot be undone.`))return
    setState(current=>({...current,error:'',notice:''}))
    try{
      const result=await adminRequest(`${config.type}/${item._id}`,{method:'DELETE'})
      setState(current=>({...current,notice:result.mediaCleanupWarning||'Item deleted.'}))
      if(editing?._id===item._id)resetForm()
      await load()
    }catch(error){
      setState(current=>({...current,error:error.message}))
    }
  }

  return <section className="admin-manager">
    <div className="admin-manager-heading"><div><p className="eyebrow">Manage published content</p><h2>{config.title}</h2></div><button className="outline" type="button" onClick={load} disabled={state.loading}>Refresh</button></div>
    {state.error&&<p className="admin-error" role="alert">{state.error}</p>}
    {state.notice&&<p className="admin-notice" role="status">{state.notice}</p>}
    <form className="admin-content-form" onSubmit={submit}>
      <div className="admin-form-heading"><h3>{editing?'Edit item':`Add ${config.title.toLowerCase()}`}</h3><button className="outline" type="button" onClick={clearDraft}>Clear draft</button></div>
      {config.fields.map(([name,label,type])=><label key={name}>{label}
        {type==='textarea'
          ?<textarea required={name!=='description'} maxLength={name==='content'?10000:name==='summary'?500:1000} rows={name==='content'?6:3} value={form[name]} onChange={event=>setForm(current=>({...current,[name]:event.target.value}))}/>
          :<input required type={type} value={form[name]} onChange={event=>setForm(current=>({...current,[name]:event.target.value}))}/>}
      </label>)}
      {(config.checkboxes||[]).map(([name,label])=><label className="admin-checkbox-field" key={name}>
        <input type="checkbox" checked={Boolean(form[name])} onChange={event=>setForm(current=>({...current,[name]:event.target.checked}))}/>
        {label}
      </label>)}
      {section==='gallery'
        ?<fieldset className="gallery-media-source"><legend>Gallery media</legend>
          <div className="gallery-media-modes">
            <label><input type="radio" name="gallery-media-mode" checked={mediaMode==='upload'} onChange={()=>{setMediaMode('upload');setMediaSourceUrl('')}}/> Upload image or video</label>
            <label><input type="radio" name="gallery-media-mode" checked={mediaMode==='url'} onChange={()=>{setMediaMode('url');setMedia(null);const input=document.getElementById('content-media');if(input)input.value=''}}/> Import from URL</label>
          </div>
          {mediaMode==='upload'
            ?<label>Select image or video
              <input id="content-media" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/*" required={!editing} onChange={event=>setMedia(event.target.files?.[0]||null)}/>
              <small>No application file-size limit; Cloudinary account limits still apply.</small>
            </label>
            :<label>Public HTTPS image or video URL
              <select value={mediaSourceType} onChange={event=>setMediaSourceType(event.target.value)}>
                <option value="video">Video</option>
                <option value="image">Image</option>
              </select>
              <input type="url" inputMode="url" placeholder={mediaSourceType==='video'?'https://example.com/video.mp4':'https://example.com/image.jpg'} required value={mediaSourceUrl} onChange={event=>setMediaSourceUrl(event.target.value)}/>
              <small>{mediaSourceType==='video'
                ?'YouTube video links are embedded with YouTube’s privacy-enhanced player. Other URLs must point directly to a publicly accessible HTTPS video file and are imported into Cloudinary.'
                :'Use a direct, publicly accessible HTTPS image URL. Images are imported into Cloudinary.'}</small>
            </label>}
        </fieldset>
        :<label>{section==='hero'?'Hero image (required)':'Cover image / video (optional)'}
          <input id="content-media" type="file" accept={section==='hero'?'image/jpeg,image/png,image/webp,image/gif':'image/jpeg,image/png,image/webp,image/gif,video/*'} required={section==='hero'&&!editing} onChange={event=>setMedia(event.target.files?.[0]||null)}/>
        </label>}
      {editing?.mediaUrl&&<p className="admin-current-media">Current media: <a href={editing.mediaUrl} target="_blank" rel="noreferrer">open file ↗</a></p>}
      <div className="admin-form-actions">
        <button className="primary" type="submit" disabled={state.saving}>{state.saving?'Saving…':editing?'Save changes':'Create item'}</button>
        {editing&&<button className="outline" type="button" onClick={clearDraft}>Cancel editing</button>}
      </div>
    </form>
    <div className="admin-record-list">
      <h3>Existing records <span>{items.length}</span></h3>
      {state.loading&&<p role="status">Loading records…</p>}
      {!state.loading&&items.length===0&&<p>No records yet. Use the form above to add one.</p>}
      {items.map(item=><article className="admin-record" key={item._id}>
        {item.mediaUrl&&(item.mediaProvider==='youtube'
          ?<iframe src={item.mediaUrl} title={item.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
          :item.mediaResourceType==='video'
          ?<video src={item.mediaUrl} controls preload="metadata"/>
          :<img src={item.mediaUrl} alt={item.title}/>)}
        <div className="admin-record-copy"><h4>{item.title}</h4><p>{item.summary||item.description||item.location||item.altText}</p>{item.date&&<small>{new Date(item.date).toLocaleString()}</small>}{section==='hero'&&<small className={item.active?'hero-active-status':'hero-inactive-status'}>{item.active?'Visible in home hero':'Hidden from home hero'}</small>}</div>
        <div className="admin-record-actions"><button className="outline" type="button" onClick={()=>editItem(item)}>Edit</button><button className="admin-delete" type="button" onClick={()=>remove(item)}>Delete</button></div>
      </article>)}
    </div>
  </section>
}
