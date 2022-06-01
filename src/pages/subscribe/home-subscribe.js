import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row, Button} from 'reactstrap';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router-dom';
import {Helmet} from "react-helmet";

import './subscribe.scss';

class HomeSubscribe extends Component {
	doPay = (param) => {
		this.props.history.push(`/admin/subscribe/${param}`);
	}

	doMonthlyAction = async () => {
		this.doPay('monthly');
	}
	doAnnualAction = async () => {
		this.doPay('annual');
	}

  render() {
    return (
      <div className="subscribe_body" style={{padding: '20px'}}>
		<Helmet 
			title="Subscribe | Club Afib"
			meta={[
				{ name: 'description', content: 'By signing up for this added feature, users can chat with an Afib expert about any Afib related question. Our experts can explain the disease in greater detail or break it down into simpler and easier to understand nonscientific language.' },
				{ name: 'keywords', content: 'club, afib, subscribe' }
			]}
			link={[{rel: 'canonical', href: 'https://clubafib.com/subscribe'}]}
		/>
        <Container>
          <Row className="justify-content-center">
            <Col md="12">
							<h1 style={{textAlign: 'center', color: '#314d81', marginBottom: '20px'}}> Please choose your plan </h1>
							<h3 style={{fontWeight:"600",fontSize:"1.1em",width:"93%",margin:"auto",marginBottom:"40px"}}>By signing up for this added feature, users can chat with an Afib expert about any Afib related question. Our experts can explain the disease in greater detail or break it down into simpler and easier to understand nonscientific language. Besides educating our club members and clearing up misconceptions about Afib, experts can walk you through complex procedures like ablations or left atrial occlusion devices, and even discuss clinical research trials available in your area. No personal diagnosis or treatment advice will be given since only your physician knows your medical information and should offer you personal medical advice.</h3>
							<Row className="justify-content-center">
								<Col md="4">
									<div className="plan-body" style={{marginBottom: '20px'}}>
										<h2 style={{fontSize: "23px"}} className="subscribe_title" >One-Time Payment</h2>
										<h5>$99</h5>
										<p className="subscribe_desk">Speak to our AFib expert for a 15 minute session. You can chat with the expert by texting or phone call.  Once you request a chat, we will arrange your discussion within the next 24 hours during regular business hours 9AM-5PM EST Monday-Friday. You may, if you wish, designate a 2 hour window that is most convenient for the expert to contact you.  This is a one time fee of $99.99.</p>
										<Button className="btn-success" onClick={e => this.doPay('one-time')}> Proceed </Button>
									</div>
								</Col>

								<Col md="4">
									<div className="plan-body" style={{marginBottom: '20px'}}>
										<h2 style={{fontSize: "23px"}} className="subscribe_title">Monthly Payment</h2>
										<h5>$49 <span>/mo</span></h5> 
										<p className="subscribe_desk">Speak to an AFib expert with broader access hours, from 8am-8pm EST seven days a week, including Holidays. You will be charged $49 per month. There is a limit of one chat per month. You can opt for a one-time annual fee of $550 for a limit of 12 chats per year.</p>
                    					<Button className="btn-success" onClick={e => this.doPay('monthly')}> Proceed </Button>
									</div>
								</Col>
								
								<Col md="4">
									<div className="plan-body" style={{marginBottom: '20px'}}>
										<h2 style={{fontSize: "23px"}} className="subscribe_title">Annual Payment</h2>
										<h5>$550 <span>/year</span></h5> 
										<p className="subscribe_desk">There is a limit of one chat per month. You can opt for a one-time annual fee of $550 for a limit of 12 chats per year.</p>
                    					<Button className="btn-success" onClick={e => this.doPay('annual')}> Proceed </Button>
									</div>
								</Col>
							</Row>    
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
	return {
	}
}

export default withRouter(connect(mapStateToProps, {})(withSnackbar(HomeSubscribe)));
