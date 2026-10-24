import {Link} from '../components/RouterLink'
import PageLayout from './PageLayout'
import HeritageAboutMedia from '../components/HeritageAboutMedia'

const sections={
  home:{path:'/phule-wada',en:'Home',mr:'घर'},
  rashtrashala:{path:'/phule-wada/rashtrashala',en:'Rashtrashala',mr:'राष्ट्रशाळा'},
  vihir:{path:'/phule-wada/vihir',en:'Vihir (Well)',mr:'विहीर'},
  hostel:{path:'/phule-wada/hostel',en:'Hostel',mr:'वसतिगृह'}
}
const copy={
  en:{
    title:'About Phule Wada',
    intro:'Explore Phule Wada through its home, Rashtrashala, well, and hostel sections.',
    home:['The home of the Phule family','Phule Wada in Ganj Peth, Pune, was the residence of Mahatma Jyotirao Phule and Savitribai Phule. The memorial recalls their work for education and social equality.'],
    rashtrashala:['Rashtrashala','This section is dedicated to education and the legacy of Jyotirao and Savitribai Phule. For information about Rashtrashala activities and participation, contact the committee.'],
    vihir:['The historic well','The well at Phule Wada is a symbol of equal access to water. Jyotirao Phule opened it to communities who were denied access to public wells because of caste discrimination.'],
    hostel:['Hostel information','For hostel availability, eligibility, admissions, and facilities, please send an enquiry to the committee.'],
    contact:'Contact the committee →',source:'Historical background: The Indian Express'
  },
  mr:{
    title:'फुले वाड्याविषयी',
    intro:'फुले वाड्यातील घर, राष्ट्रशाळा, विहीर आणि वसतिगृह या विभागांची माहिती जाणून घ्या.',
    home:['फुले कुटुंबाचे घर','पुण्यातील गंज पेठ येथील फुले वाडा हे महात्मा ज्योतिराव फुले आणि सावित्रीबाई फुले यांचे निवासस्थान होते. हे स्मारक त्यांच्या शिक्षण आणि सामाजिक समतेच्या कार्याची आठवण जपते.'],
    rashtrashala:['राष्ट्रशाळा','हा विभाग ज्योतिराव आणि सावित्रीबाई फुले यांच्या शैक्षणिक वारशाला समर्पित आहे. राष्ट्रशाळेतील उपक्रम आणि सहभागाविषयी माहितीसाठी समितीशी संपर्क साधा.'],
    vihir:['ऐतिहासिक विहीर','फुले वाड्यातील विहीर पाण्यावरील समान हक्काचे प्रतीक आहे. जातीय भेदभावामुळे सार्वजनिक विहिरींचा वापर नाकारलेल्या समाजासाठी ज्योतिराव फुले यांनी ही विहीर खुली केली.'],
    hostel:['वसतिगृह माहिती','वसतिगृहाची उपलब्धता, पात्रता, प्रवेश आणि सुविधांविषयी माहितीसाठी समितीकडे चौकशी पाठवा.'],
    contact:'समितीशी संपर्क साधा →',source:'ऐतिहासिक माहितीसाठी स्रोत: द इंडियन एक्सप्रेस'
  }
}

export default function PhuleWadaPage({language='mr',section='home'}){
  const lang=language==='en'?'en':'mr'
  const t=copy[lang]
  const [heading,description]=t[section]
  return <PageLayout title={t.title} intro={t.intro}>
    <nav className="phule-section-nav" aria-label={t.title}>
      {Object.entries(sections).map(([key,item])=><Link key={key} to={item.path} aria-current={key===section?'page':undefined}>{item[lang]}</Link>)}
    </nav>
    {(section==='home'||section==='vihir')&&<HeritageAboutMedia site="phule" language={language}/>}
    <section className="content-detail">
      <h2>{heading}</h2>
      <p className="lead-copy">{description}</p>
      {(section==='rashtrashala'||section==='hostel')&&<Link className="primary" to="/contact">{t.contact}</Link>}
    </section>
    {section==='home'&&<section className="content-detail">
      <h2>{lang==='en'?'A heritage of social equality':'सामाजिक समतेचा वारसा'}</h2>
      <p className="lead-copy">{lang==='en'?'The courtyard and historic well recall the Phules’ commitment to dignity and equality. Opening the well to people excluded from public water sources challenged caste discrimination.':'अंगण आणि ऐतिहासिक विहीर फुले दाम्पत्याच्या मानवी प्रतिष्ठा आणि समतेच्या कार्याची आठवण जपतात. सार्वजनिक पाणवठ्यांपासून वंचित ठेवलेल्या समाजासाठी विहीर खुली करून त्यांनी जातीय भेदभावाला आव्हान दिले.'}</p>
      <p className="lead-copy">{lang==='en'?'Explore the sections above to learn about the home and well, or enquire about Rashtrashala and hostel information.':'घर आणि विहिरीविषयी जाणून घेण्यासाठी वरील विभाग निवडा. राष्ट्रशाळा आणि वसतिगृहाविषयी माहितीसाठी संबंधित विभागातून चौकशी करता येईल.'}</p>
    </section>}
    {(section==='home'||section==='vihir')&&<p className="source-note"><a href="https://indianexpress.com/article/cities/pune/pune-infra-watch-pmc-phule-monument-ganj-peth-7834034/" target="_blank" rel="noreferrer">{t.source}</a></p>}
  </PageLayout>
}
