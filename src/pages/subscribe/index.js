import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row, Button} from 'reactstrap';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router-dom';
import { getActivePayment } from '../../redux/actions';
import { unsubscribe as unsubscribeApi } from '../../api';
import './subscribe.scss';

class Subscribe extends Component {
	componentDidMount() {
		this.props.getActivePayment();
	}

	doPay = (param) => {
		this.props.history.push(`/admin/subscribe/${param}`);
	}

	checkPayment = (param) => {
		const info = this.props.payment_info || {};
		if (Object.keys(info).length > 0) {
			const { type } = info;
			if(param==="one-time")
				return true;
			else if(param==="monthly" && type===1)
				return true;
			else if(param==="annual" && type===2)
				return true;	
		}
		return false;
	}

	doMonthlyAction = async () => {
		if (!this.checkPayment('monthly')) {
			this.doPay('monthly');
		} else {
			await unsubscribeApi({subscription_id: this.props.payment_info.stripe_id});
			this.props.getActivePayment();
		}
	}
	doAnnualAction = async () => {
		if (!this.checkPayment('annual')) {
			this.doPay('annual');
		} else {
			await unsubscribeApi({subscription_id: this.props.payment_info.stripe_id, type:2});
			this.props.getActivePayment();
		}
	}

  render() {
    return (
      <div className="subscribe_body">
        <Container>
          <Row className="justify-content-center">
            <Col md="12">
							<h1 style={{textAlign: 'center', color: '#314d81', marginBottom: '20px'}}> Please choose your plan </h1>
							<p style={{fontWeight:"600",fontSize:"1.1em",width:"93%",margin:"auto",marginBottom:"40px"}}>By signing up for this added feature, users can chat with an Afib expert about any Afib related question. Our experts can explain the disease in greater detail or break it down into simpler and easier to understand nonscientific language. Besides educating our club members and clearing up misconceptions about Afib, experts can walk you through complex procedures like ablations or left atrial occlusion devices, and even discuss clinical research trials available in your area. No personal diagnosis or treatment advice will be given since only your physician knows your medical information and should offer you personal medical advice.</p>
							<Row className="justify-content-center">
								<Col md="4">
									<div className="plan-body">
										<h4 className="subscribe_title" >One-Time Payment</h4>
										<h5>$99</h5>
										<p className="subscribe_desk">Speak to our AFib expert for a 15 minute session. You can chat with the expert by texting or phone call.  Once you request a chat, we will arrange your discussion within the next 24 hours during regular business hours 9AM-5PM EST Monday-Friday. You may, if you wish, designate a 2 hour window that is most convenient for the expert to contact you.  This is a one time fee of $99.99.</p>
										<Button className="btn-success" disabled={this.checkPayment('one-time')} onClick={e => this.doPay('one-time')}>Proceed</Button>
									</div>
								</Col>
								<Col md="4">
									<div className="plan-body">
										<h4 className="subscribe_title">Monthly Payment</h4>
										<h5>$49 <span>/mo</span></h5> 
										<p className="subscribe_desk">Speak to an AFib expert with broader access hours, from 8am-8pm EST seven days a week, including Holidays. You will be charged $49 per month. There is a limit of one chat per month. You can opt for a one-time annual fee of $550 for a limit of 12 chats per year.</p>
										<Button className="btn-success" onClick={e => this.doMonthlyAction('monthly')}>
											{this.checkPayment('monthly') ? 'Unsubscribe' : 'Proceed'}
										</Button>
									</div>
								</Col>
								<Col md="4">
									<div className="plan-body">
										<h4 className="subscribe_title">Annual Payment</h4>
										<h5>$550 <span>/year</span></h5> 
										<p className="subscribe_desk">There is a limit of one chat per month. You can opt for a one-time annual fee of $550 for a limit of 12 chats per year.</p>
										<Button className="btn-success" onClick={e => this.doAnnualAction('annual')}>
											{this.checkPayment('annual') ? 'Unsubscribe' : 'Proceed'}
										</Button>
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
		payment_info: state.subscribe.payment_info
	}
}

export default withRouter(connect(mapStateToProps, { getActivePayment })(withSnackbar(Subscribe)));
