import React from 'react';
import { Helmet } from 'react-helmet';
import { Col, Row } from 'reactstrap';
import avatar1 from '../../resources/images/11.jpg';
import avatar2 from '../../resources/images/12.jpg';

class AboutUS extends React.Component {
 
  render() {
    return (
      <div className="showdow-box">
        <Helmet 
          title="About | Club Afib"
          meta={[
            { name: 'description', content: 'Club Afib is dedicated to educating and empowering people with Atrial Fibrillation to improve their health by using the most up-to-date technology available. We integrate with the top consumer monitors so users can track and manage their Afib. We answer all the common questions that surround this complex disease and provide a forum for peer discussions as well as the opportunity to chat with Afib experts.' },
            { name: 'keywords', content: 'club, afib, about' }
          ]}
          link={[{rel: 'canonical', href: 'https://clubafib.com/about'}]}
        />
        <h2 style={{fontSize:"20px",fontWeight:"700",textAlign:"center"}}>
           OUR MISSION
        </h2>
        <p>
           Club Afib is dedicated to educating and empowering people with Atrial Fibrillation to improve their health by using the most up-to-date technology available. We integrate with the top consumer monitors so users can track and manage their Afib. We answer all the common questions that surround this complex disease and provide a forum for peer discussions as well as the opportunity to chat with Afib experts.
        </p>
        <h2 style={{fontSize:"20px",fontWeight:"700",textAlign:"center"}}>
          OUR CO-FOUNDERS
        </h2>
        <Row className="justify-content-center">
          <Col md="6">
            <div className="v-r">
              <img src={avatar1} style={{height:"400px",margin:"auto"}} alt="" />
              <h3 style={{fontSize:"1.2em",textAlign:"center",fontWeight:"700",marginTop:"10px"}}>MARIA RUMSEY, MD</h3>
              <p>
              Dr. Rumsey earned her Bachelor’s Degree in Biology at Brown University and her Medical Degree at Georgetown University.  After completing her Residency and Cardiology Fellowship at Georgetown & Washington Hospital Center in DC, she joined a private multispecialty group in Massachusetts. She has been treating AFib patients for over 15 years and wants to deliver widespread access to current technology and get the word out about the safety, efficacy and availability of new AFib treatments.  As a Board Certified Cardiologist and Echocardiographer, she counsels Afib patients in the office daily and performs Transesophageal Echocardiograms for cardioversions, pre-ablation, and in the OR during Watchman implantation.  
              </p>
            </div>
          </Col>
          <Col md="6">
            <div className="v-r">
              <img src={avatar2} style={{height:"400px",margin:"auto"}} alt=""/>
              <h3 style={{fontSize:"1.2em",textAlign:"center",fontWeight:"700",marginTop:"10px"}}>NITESH SOOD, MD</h3>
              <p>
              Dr. Sood graduated from Government Medical School in Nagpur, India, followed by a research fellowship at Georgetown University, Residency and Cardiology Fellowship at the University of 
              Connecticut Health Center, and Electrophysiology Fellowship at the Lahey Clinic, Tufts University Medical Center in Massachusetts. He is Board Certified in both Cardiovascular Disease and Electrophysiology.
              <br></br>Dr. Sood is the Director of the Atrial Fibrillation Wellness Program at Southcoast Health in Massachusetts and Rhode Island. He specializes in atrial fibrillation and complex cardiac ablations, implantation of cardiac devices including pacemakers, defibrillators,Watchman and other left atrial appendage occluders. He is an active investigator in ongoing atrial fibrillation research trials and has been published in New England Journal of Medicine, Journal of American College of Cardiology, Circulation, and the European Heart Journal.  
              </p>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
}

export default AboutUS;