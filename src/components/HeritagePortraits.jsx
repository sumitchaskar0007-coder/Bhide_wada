export default function HeritagePortraits({language='mr'}){
  const en=language==='en'
  const name=en?'Chhatrapati Shivaji Maharaj':'छत्रपती शिवाजी महाराज'
  return <div className="reference-heritage" role="group" aria-label={en?'Our heritage and inspiration':'आपला वारसा व प्रेरणास्थाने'}>
    <figure className="reference-shivaji">
      <span className="reference-shivaji-frame"><img src="/assets/images/dignitaries/shivaji-maharaj-valentyn.jpg" width="522" height="725" alt={name} decoding="async"/></span>
      <figcaption>{name}</figcaption>
    </figure>
    <img className="reference-portraits" src="/assets/images/header.png" width="2170" height="725" alt={en?'Dr. Babasaheb Ambedkar, Mahatma Jyotirao Phule, Krantijyoti Savitribai Phule, Rajarshi Shahu Maharaj and Annabhau Sathe':'डॉ. बाबासाहेब आंबेडकर, महात्मा ज्योतिराव फुले, क्रांतिज्योती सावित्रीबाई फुले, राजर्षी शाहू महाराज आणि अण्णाभाऊ साठे'} decoding="async"/>
  </div>
}
