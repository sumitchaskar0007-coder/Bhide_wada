import {instagramUrl} from '../site'

export default function InstagramLink({language='mr',className=''}){
  const label=language==='en'?'Official Instagram':'अधिकृत इन्स्टाग्राम'
  return <a className={`official-instagram-link ${className}`} href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label={`${label}: @bhidewada_phulewada_samiti`}>
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
    <span>{label}<small>@bhidewada_phulewada_samiti</small></span><span aria-hidden="true">↗</span>
  </a>
}
