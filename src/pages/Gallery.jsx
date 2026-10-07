import {useEffect,useState} from 'react'
import PageLayout from './PageLayout'
import {getContent} from '../api/content'

const copy={
  en:{title:'Gallery',intro:'Photographs and videos from Bhide Wada and community activities.',label:'Photo & video gallery',empty:'No photos or videos have been published yet.',loading:'Loading gallery…',error:'Unable to load the gallery.'},
  mr:{title:'गॅलरी',intro:'भिडे वाडा आणि समुदाय उपक्रमांची छायाचित्रे व व्हिडिओ.',label:'छायाचित्र व व्हिडिओ संग्रह',empty:'छायाचित्रे किंवा व्हिडिओ अद्याप प्रसिद्ध केलेले नाहीत.',loading:'गॅलरी लोड होत आहे…',error:'गॅलरी लोड करता आली नाही.'}
}

export default function GalleryPage({language='mr'}){
  const t=copy[language]||copy.mr
  const [state,setState]=useState({items:[],loading:true,error:''})

  useEffect(()=>{
    let active=true
    getContent('gallery')
      .then(({items})=>{if(active)setState({items,loading:false,error:''})})
      .catch(error=>{if(active)setState({items:[],loading:false,error:error.message||t.error})})
    return ()=>{active=false}
  },[t.error])

  return <PageLayout title={t.title} intro={t.intro}>
    <section className="community-gallery">
      <div className="community-page-heading"><p className="eyebrow">{t.label}</p><span aria-hidden="true">✦</span></div>
      {state.loading&&<p role="status">{t.loading}</p>}
      {state.error&&<p className="content-error" role="alert">{state.error}</p>}
      {!state.loading&&!state.error&&state.items.length===0&&<p className="gallery-empty-state">{t.empty}</p>}
      <div className="managed-gallery-grid">{state.items.map(item=><figure key={item._id}>
        <div className="gallery-media-frame">
          {item.mediaProvider==='youtube'
            ?<iframe src={item.mediaUrl} title={item.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
            :item.mediaResourceType==='video'
            ?<video src={item.mediaUrl} controls preload="metadata" aria-label={item.title}/>
            :<img src={item.mediaUrl} alt={item.description||item.title} loading="lazy"/>}
        </div>
        <figcaption><h3>{item.title}</h3>{item.description&&<p>{item.description}</p>}</figcaption>
      </figure>)}</div>
    </section>
  </PageLayout>
}
