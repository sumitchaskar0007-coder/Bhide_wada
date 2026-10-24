import {resolveMediaUrl} from '../api/content'

export default function PublishedMedia({item}){
  if(!item.mediaUrl)return null
  const src=resolveMediaUrl(item.mediaUrl)
  if(item.mediaProvider==='youtube')return <iframe src={src} title={item.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
  if(item.mediaResourceType==='video')return <video src={src} controls preload="metadata" aria-label={item.title}/>
  return <img src={src} alt={item.description||item.title} loading="lazy"/>
}
