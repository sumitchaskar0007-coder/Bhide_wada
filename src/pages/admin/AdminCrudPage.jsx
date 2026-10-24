import {useCallback,useEffect,useState} from 'react'
import {adminRequest,resolveMediaUrl} from '../../api/content'
import {Link} from '../../components/RouterLink'
import PublishedMedia from '../../components/PublishedMedia'

const configurations={
  announcements:{
    title:'Notices & Announcements',type:'announcements',
    fields:[['title','Title','text'],['summary','Short summary','textarea'],['content','Announcement details','textarea'],['link','Link (optional website path or HTTPS URL)','text'],['expiresAt','Expiry date (optional)','datetime-local']],
    checkboxes:[['pinned','Pin to the top']]
  },
  news:{
    title:'News',type:'news',
    fields:[['title','Title','text'],['summary','Summary','textarea'],['content','Full content','textarea'],['sourceUrl','Verified source URL (optional HTTPS link)','url']]
  },
  events:{
    title:'Events',type:'events',
    fields:[['title','Title','text'],['summary','Summary','textarea'],['content','Full details','textarea'],['date','Date and time','datetime-local'],['location','Location','text']]
  },
  gallery:{
    title:'Gallery',type:'gallery',
    fields:[['title','Title','text'],['description','Description / alt text','textarea'],['capturedAt','Photograph / video taken on (optional)','date'],['sourceUrl','Source / photographer link (optional HTTPS URL)','url']]
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
    published:true,
    ...Object.fromEntries((config.checkboxes||[]).map(([name])=>[name,name==='active']))
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
  const publicPath=section==='hero'?'/':`/${config.type}`
  const [items,setItems]=useState([])
  const [query,setQuery]=useState('')
  const [statusFilter,setStatusFilter]=useState('all')
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
    setForm({
      ...Object.fromEntries(config.fields.map(([name])=>{
        let value=item[name]??''
        if(['date','expiresAt'].includes(name)&&value){
          const date=new Date(value)
          value=new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16)
        }
        return [name,value]
      })),
      published:item.published!==false,
      ...Object.fromEntries((config.checkboxes||[]).map(([name])=>[name,Boolean(item[name])]))
    })
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
    Object.entries(form).forEach(([name,value])=>body.append(name,['date','expiresAt'].includes(name)&&value?new Date(value).toISOString():value))
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
      setState(current=>({...current,saving:false,notice:result.mediaCleanupWarning||(form.published?(section==='announcements'&&form.expiresAt&&new Date(form.expiresAt)<=new Date()?'Saved. This notice is expired and is hidden from the public page.':section==='hero'&&!form.active?'Saved. Enable “Show in home hero” to display this slide.':'Published successfully. Open “View public page” to see your changes.'):'Draft saved. Check “Publish on website” and save to display it publicly.')}))
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

  const visibleItems=items.filter(item=>(statusFilter==='all'||(statusFilter==='published'?item.published:!item.published))&&`${item.title} ${item.summary||item.description||''}`.toLowerCase().includes(query.toLowerCase()))
  return <section className="admin-manager">
    <div className="admin-manager-heading"><div><p className="eyebrow">Manage published content</p><h2>{config.title}</h2></div><div className="admin-page-actions"><Link className="outline" to={publicPath} target="_blank" rel="noreferrer">View public page ↗</Link><button className="outline" type="button" onClick={load} disabled={state.loading}>Refresh</button></div></div>
    <p className="admin-intro">Save with “Publish on website” checked to display this item on the <Link to={publicPath} target="_blank" rel="noreferrer">public {section==='hero'?'home':section} page ↗</Link>.{section==='announcements'?' Pinned notices appear first. Notices are hidden after their expiry date.':''}</p>
    {state.error&&<p className="admin-error" role="alert">{state.error}</p>}
    {state.notice&&<p className="admin-notice" role="status">{state.notice}</p>}
    <form className="admin-content-form" onSubmit={submit}>
      {['gallery','news','hero'].includes(section)&&<p className="admin-intro">Publish verified material with the site name, date and source. Label archival photographs and illustrations clearly. Unpublish material that no longer represents current progress; uploading an older image does not make it a current site photograph.</p>}
      <div className="admin-form-heading"><h3>{editing?'Edit item':`Add ${config.title.toLowerCase()}`}</h3><button className="outline" type="button" onClick={clearDraft}>Clear draft</button></div>
      {config.fields.map(([name,label,type])=><label key={name}>{label}
        {type==='textarea'
          ?<textarea required={name==='content'&&['announcements','news'].includes(section)} maxLength={name==='content'?10000:name==='summary'?500:1000} rows={name==='content'?6:3} value={form[name]} onChange={event=>setForm(current=>({...current,[name]:event.target.value}))}/>
          :<input required={['title','altText','date','location'].includes(name)} maxLength={name==='title'?200:1000} type={type} value={form[name]} onChange={event=>setForm(current=>({...current,[name]:event.target.value}))}/>}
      </label>)}
      <label className="admin-checkbox-field"><input type="checkbox" checked={Boolean(form.published)} onChange={event=>setForm(current=>({...current,published:event.target.checked}))}/>Publish on website (uncheck to save as draft)</label>
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
              <input id="content-media" type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm" required={!editing} onChange={event=>setMedia(event.target.files?.[0]||null)}/>
              <small>Maximum 50 MB per file. PNG, JPEG, WebP, GIF, MP4 and WebM are supported.</small>
            </label>
            :<label>Public HTTPS image or video URL
              <select value={mediaSourceType} onChange={event=>setMediaSourceType(event.target.value)}>
                <option value="video">Video</option>
                <option value="image">Image</option>
              </select>
              <input type="url" inputMode="url" placeholder={mediaSourceType==='video'?'https://example.com/video.mp4':'https://example.com/image.jpg'} required value={mediaSourceUrl} onChange={event=>setMediaSourceUrl(event.target.value)}/>
              <small>{mediaSourceType==='video'
                ?'YouTube links use its privacy-enhanced player. Other links must point directly to a public HTTPS video. Remote media stays hosted at its source.'
                :'Use a direct, public HTTPS image URL. Remote images stay hosted at their source.'}</small>
            </label>}
        </fieldset>
        :<label>{section==='hero'?'Hero image (required)':'Cover image / video (optional)'}
          <input id="content-media" type="file" accept={section==='hero'?'image/jpeg,image/png,image/webp,image/gif':'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm'} required={section==='hero'&&!editing} onChange={event=>setMedia(event.target.files?.[0]||null)}/>
        </label>}
      {editing?.mediaUrl&&<p className="admin-current-media">Current media: <a href={resolveMediaUrl(editing.mediaUrl)} target="_blank" rel="noreferrer">open file ↗</a></p>}
      <div className="admin-form-actions">
        <button className="primary" type="submit" disabled={state.saving}>{state.saving?'Saving…':editing?'Save changes':'Create item'}</button>
        {editing&&<button className="outline" type="button" onClick={clearDraft}>Cancel editing</button>}
      </div>
    </form>
    <div className="admin-record-list">
      <h3>Existing records <span>{items.length}</span></h3>
      <div className="admin-record-filters"><label>Search records<input type="search" placeholder="Search by title or summary…" value={query} onChange={event=>setQuery(event.target.value)}/></label><label>Publication status<select value={statusFilter} onChange={event=>setStatusFilter(event.target.value)}><option value="all">All records</option><option value="published">Published</option><option value="draft">Drafts</option></select></label></div>
      {state.loading&&<p role="status">Loading records…</p>}
      {!state.loading&&items.length>0&&visibleItems.length===0&&<p>No records match your search.</p>}
      {!state.loading&&items.length===0&&<p>No records yet. Use the form above to add one.</p>}
      {visibleItems.map(item=><article className="admin-record" key={item._id}>
        <PublishedMedia item={item}/>
        <div className="admin-record-copy"><h4>{item.title} <span className={`admin-status ${item.published?'status-read':'status-new'}`}>{item.published?(item.expiresAt&&new Date(item.expiresAt)<=new Date()?'Expired':'Published'):'Draft'}</span></h4><p>{item.summary||item.description||item.location||item.altText}</p>{item.date&&<small>{new Date(item.date).toLocaleString()}</small>}{section==='hero'&&<small className={item.active?'hero-active-status':'hero-inactive-status'}>{item.active?'Visible in home hero':'Hidden from home hero'}</small>}</div>
        <div className="admin-record-actions"><button className="outline" type="button" onClick={()=>{editItem(item);document.querySelector('.admin-content-form')?.scrollIntoView({behavior:'smooth',block:'start'})}}>Edit</button><button className="admin-delete" type="button" onClick={()=>remove(item)}>Delete</button></div>
      </article>)}
    </div>
  </section>
}
