import React from 'react';
import { Helmet } from 'react-helmet';

class Contact extends React.Component {
  render() {
    return (
      <div className="showdow-box">
        <Helmet 
          title="Contact Us | Club Afib"
          meta={[
            { name: 'description', content: "Don't hesitate to contact us." },
            { name: 'keywords', content: 'club, afib, contact' }
          ]}
          link={[{rel: 'canonical', href: 'https://clubafib.com/contact'}]}
        />
        <h1 style={{fontSize:"30px",fontWeight:"700", textAlign:"center"}}>
           Contact Us
        </h1>
        <h2 style={{fontSize: "14px", fontWeight:"700"}}>
            Location: Boston, MA
        </h2>
        <h2 style={{fontSize: "14px", fontWeight:"700"}}>
          Email: info@clubafib.com  
        </h2>
      </div>
    )
  }
}

export default Contact;

