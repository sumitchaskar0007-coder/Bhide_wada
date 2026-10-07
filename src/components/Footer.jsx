import {routes} from './Navbar'
import {Link} from './RouterLink'

const englishRoutes=['Home','About','Committee','Projects / Activities','News','Events','Gallery','Membership','Documents','Contact']
const footerCopy={
  en:{
    description:'Preserving heritage, supporting rehabilitation, and strengthening our community.',
    links:'Explore the website',
    contact:'Visit us',
    address:'257, Budhwar Peth, Tulshibaug, Pune, Maharashtra 411002',
    map:'View on Google Maps ↗',
    admin:'Admin login',
    rights:'All rights reserved.'
  },
  mr:{
    description:'वारसा जतन, पुनर्वसनाला पाठिंबा आणि समुदाय सक्षमीकरण.',
    links:'वेबसाइटवरील दुवे',
    contact:'आमच्या स्थळाला भेट द्या',
    address:'२५७, बुधवार पेठ, तुळशीबाग, पुणे, महाराष्ट्र ४११००२',
    map:'Google Maps वर पहा ↗',
    admin:'प्रशासक लॉगिन',
    rights:'सर्व हक्क राखीव.'
  }
}

const siteName={
  en:'Bhide Wada Fule Wada Rashtriy Smark Samiti',
  mr:'भिडे वाडा फुले वाडा राष्ट्रीय स्मारक समिती'
}

const mapEmbedUrl='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2774944450457!2d73.8538015738005!3d18.516358169305626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c06fa6a06b6f%3A0xce2f52914e0bb6a7!2zQkhJREUgV0FEQSDgpK3gpL_gpKHgpYfgpLXgpL7gpKHgpL4gKOCkreCkv-CkoeClh-CkteCkvuCkoeCkviDgpKzgpJrgpL7gpLUg4KSu4KWL4KS54KS_4KSuKeCkuOCkguCkuOCljeCkpeCkvuCkquCklSAt4KSq4KWN4KSw4KS24KS-4KSC4KSkIOCkq-ClgeCksuClhw!5e0!3m2!1sen!2sin!4v1791283093145!5m2!1sen!2sin'

export default function Footer({language='mr'}){
  const t=footerCopy[language]||footerCopy.mr
  const name=siteName[language]||siteName.mr
  const currentYear=new Date().getFullYear()

  return <footer className="site-footer">
    <div className="shell footer-main">
      <section className="footer-identity" aria-label={name}>
        <Link className="footer-brand" to="/">
          <b>{name}</b>
        </Link>
        <p>{t.description}</p>
      </section>

      <nav className="footer-links" aria-label={t.links}>
        <h2>{t.links}</h2>
        <div className="footer-link-list">
          {routes.map(([path,label],index)=><Link key={path} to={path}>
            <span aria-hidden="true">›</span>{language==='en'?englishRoutes[index]:label}
          </Link>)}
        </div>
        <Link className="footer-admin-link" to="/admin/login">{t.admin} <span aria-hidden="true">↗</span></Link>
      </nav>

      <address className="footer-contact">
        <h2>{t.contact}</h2>
        <div className="footer-contact-mark" aria-hidden="true">⌖</div>
        <p>{t.address}</p>
        <a href="https://www.google.com/maps/search/?api=1&query=Bhide+Wada+Budhwar+Peth+Pune" target="_blank" rel="noreferrer">{t.map}</a>
        <iframe className="footer-map-embed" src={mapEmbedUrl} title={language==='en'?'Map to Bhide Wada':'भिडे वाड्याचा नकाशा'} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/>
      </address>
    </div>
    <div className="footer-bottom">
      <div className="shell footer-bottom-inner">
        <span>© {currentYear} {name}</span>
        <span>{t.rights}</span>
      </div>
    </div>
  </footer>
}
