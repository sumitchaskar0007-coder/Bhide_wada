import {Link} from './RouterLink'

const sites={
  bhide:{
    image:'/assets/images/bhide-wada-historical.jpg',
    source:'https://commons.wikimedia.org/wiki/File:Bhide_Wada.jpg',
    author:'Rohanpawar1812',license:'4.0',
    en:{caption:'Bhide Wada, Budhwar Peth — archival photograph, 2021',alt:'Historic Bhide Wada building in Budhwar Peth, Pune, photographed in 2021',link:'Explore Phule Wada →'},
    mr:{caption:'भिडे वाडा, बुधवार पेठ — ऐतिहासिक छायाचित्र, २०२१',alt:'२०२१ मध्ये छायाचित्रित केलेली पुण्यातील बुधवार पेठ येथील ऐतिहासिक भिडे वाड्याची इमारत',link:'फुले वाड्याविषयी जाणून घ्या →'},
    to:'/phule-wada'
  },
  phule:{
    image:'/assets/images/phule-wada.jpg',
    source:'https://commons.wikimedia.org/wiki/File:MAHATMA_fule_vada_(22).JPG',
    author:'Samreenshaikh',license:'3.0',
    en:{caption:'Mahatma Phule Wada, Ganj Peth — archival photograph, 2012',alt:'Entrance and tiled roof of Mahatma Phule Wada in Ganj Peth, Pune',link:'Explore Bhide Wada →'},
    mr:{caption:'महात्मा फुले वाडा, गंज पेठ — ऐतिहासिक छायाचित्र, २०१२',alt:'पुण्यातील गंज पेठ येथील महात्मा फुले वाड्याचे प्रवेशद्वार आणि कौलारू छप्पर',link:'भिडे वाड्याविषयी जाणून घ्या →'},
    to:'/about'
  }
}

export default function HeritageAboutMedia({site,language='mr'}){
  const item=sites[site]
  const t=item[language==='en'?'en':'mr']
  return <div className="heritage-about-media">
    <figure className="heritage-image">
      <img src={item.image} alt={t.alt} width="1280" height="960" decoding="async"/>
      <figcaption>
        <strong>{t.caption}</strong>
        <span><a href={item.source} target="_blank" rel="noreferrer">{item.author} / Wikimedia Commons</a> · <a href={`https://creativecommons.org/licenses/by-sa/${item.license}/`} target="_blank" rel="noreferrer">CC BY-SA {item.license}</a> · {language==='en'?'Resized for display':'प्रदर्शनासाठी आकार बदललेला'}</span>
      </figcaption>
    </figure>
    <Link className="content-source" to={item.to}>{t.link}</Link>
  </div>
}
