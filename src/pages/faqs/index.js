import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import "./faqs.scss";
class Faqs extends React.Component {
 
  render() {
    return (
      <div className="showdow-box">
        <Helmet 
          title="Frequently Asked Questions | Club Afib"
          meta={[
            { name: 'description', content: 'How do I chat with an expert?' },
            { name: 'keywords', content: 'club, afib, faq' }
          ]}
          link={[{rel: 'canonical', href: 'https://clubafib.com/faqs'}]}
        />
        <h1 style={{fontSize:"30px",fontWeight:"700"}}>
           FAQ's
        </h1>
        <h2 className="question">How do I chat with an expert?  </h2>
          <Link to="/admin/chat"><p className="answer">Click Here.</p></Link>
        <h2 className="question">How do I cancel my subscription?  </h2>
          <Link to="/admin/subscribe"><p className="answer">Click Here.</p></Link>
        
      </div>
    )
  }
}

export default Faqs;