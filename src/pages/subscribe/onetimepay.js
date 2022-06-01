import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row, Button} from 'reactstrap';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router-dom';
import { getPaymentSecret as getPaymentSecretApi, createOnetimePay as createOnetimePayApi } from '../../api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import {CardElement} from '@stripe/react-stripe-js';
import { getActivePayment } from '../../redux/actions';
import './stripestyle.scss';

const cardStyle = {
	style: {
		base: {
			color: "#32325d",
			fontFamily: 'Arial, sans-serif',
			fontSmoothing: "antialiased",
			fontSize: "16px",
			"::placeholder": {
				color: "#32325d"
			}
		},
		invalid: {
			color: "#fa755a",
			iconColor: "#fa755a"
		}
	}
};

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY);
class OneTimePay extends Component {
	state = {
		me: this.props.me,
		loading_status: false,

		stripe: null,
		elements: null,

		error: '',
		btn_disabled: false,
		processing: false,
		succeeded: false
	}

	componentDidMount() {
		this.props.getActivePayment();
	}

	checkPayment = () => {
		const info = this.props.payment_info || {};
		return (Object.keys(info).length > 0) ? true : false;
	}

	handleChange = (event) => {
		this.setState({
			btn_disabled: event.empty,
			error: event.error ? event.error.message : ""
		})
	}

	handleSubmit = async (e, stripe, elements) => {
		e.preventDefault();
		this.setState({processing: true});
		const response = await getPaymentSecretApi({ type: 0 });
		if (!response.data) {
			this.setState({
				processing: false,
				error: `Payment failed due to some reasons. Please try again later.`
			})
			return;
		}
		const clientSecret = response.data;
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      }
		});
    if (payload.error) {
			this.setState({
				processing: false,
				error: `Payment failed ${payload.error.message}`
			})
    } else {
			await createOnetimePayApi({ stripe_id: payload.paymentIntent.id })
			this.props.getActivePayment();
			this.props.enqueueSnackbar("Success! Thanks for your payment.", { variant: 'success' })
			this.setState({
				error: '',
				processing: false,
				succeeded: true
			});
    }
	}

	renderForm = (stripe, elements) => {
		const { error, btn_disabled, processing, succeeded } = this.state;
		return (
			<form className="check-form" onSubmit={e => this.handleSubmit(e, stripe, elements)}>
				<CardElement id="card-element" options={cardStyle} onChange={this.handleChange} />
				{error && <div className="card-error" role="alert"> {error} </div>}
				<Button 
					className="btn-success save-btn" 
					disabled={btn_disabled || processing || succeeded || this.checkPayment()}
					type="submit">
						{this.checkPayment() ? 'Already Paid' : processing ? <div className="spinner" id="spinner" /> :  "Proceed"}
				</Button>
			</form>
		)
	}

  render() {
    return (
      <div className="subscribe_body">
        <Container>
          <Row className="justify-content-center">
            <Col md="10" className="justify-content-center">
							<h1 style={{textAlign: 'center', color: '#314d81', marginBottom: '80px'}}> Please enter your information and proceed. </h1>
							<div style={{maxWidth: '500px', width: '100%', margin: '0 auto'}}>
								{stripePromise && <Elements stripe={stripePromise}>
									<ElementsConsumer>
										{({stripe, elements}) => this.renderForm(stripe, elements)}
									</ElementsConsumer>
								</Elements>}
							</div>
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

export default withRouter(connect(mapStateToProps, {  getActivePayment })(withSnackbar(OneTimePay)));
