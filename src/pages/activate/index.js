import React from 'react';
import './activate.scss'; 
import queryString from 'query-string';
import jwtDecode from 'jwt-decode';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { requestActivation as requestActivationApi } from '../../api';
import { activate } from '../../redux/actions';
import { Button, Spinner } from 'reactstrap';
import { withSnackbar } from 'notistack';
import logo from '../../resources/images/logo.png'

class Activate extends React.Component {
	state = {
		loading: false,
		text: 'Please wait while we activate your account.',
		show_btn: false,
		email: ''
	}

  componentDidMount() {
		const { location } = this.props;
		if (location && location.search) {
			const query = queryString.parse(location.search);
			if (query.hval && query.code) {
				try {
					const decoded = jwtDecode(query.hval);
					const { email } = decoded;
					this.setState({
						email
					})
					this.props.activate({email, code: query.code})
				} catch (err) {
					this.setState({
						text: 'Invalid URL. Please check your email or request activation again',
						show_btn: true,
					})
				}
			} else {
				this.setState({
					text: 'Invalid URL. Please check your email or request activation again',
					show_btn: true,
				})
			}
		}
	}

	static getDerivedStateFromProps(props, state) {
		if (state.loading && !props.loading) {
			let errorMsg = (props.messages && props.messages[0]) || '';
			if (errorMsg.length > 0) {
				return {
					loading: props.loading,
					text: errorMsg,
					show_btn: errorMsg === 'Your account is already activated. Please try login.' ? false : true,
				}
			} else {
				return {
					text: 'Congratulations! Your email is verifed successfully',
					loading: props.loading
				}
			}
		}
		return {
			loading: props.loading
		}
	}

	requestActivation = async () => {
		const { email } = this.state;
		try {
			const result = await requestActivationApi({email});

			if (!result || result.errors) {
				if (result && result.errors.length > 0 && result.errors[0].message) {
					this.props.enqueueSnackbar(result.errors[0].message, { variant: 'error' })
				} else {
					this.props.enqueueSnackbar('There was a problem to send activation email, Please try again later.', { variant: 'error' })
				}
			} else {
				this.props.enqueueSnackbar('We sent an activation code to your email.', { variant: 'success' })
				this.setState({
					show_btn: false
				})
			}
		} catch (error) {
			this.props.enqueueSnackbar('There was a problem to send activation email, Please try again later.', { variant: 'error' })
		}
	}
	
  render() {
		const { loading, text, show_btn } = this.state;
    return (
      <div className="reset_body">
				<div className="reset_App">
					<div className="logo_login">
						<NavLink to="/" className="v-c"> <img src={logo} alt="logo" style={{maxWidth: '50%', margin: '0 auto'}} /> </NavLink>
					</div>
					{loading && <Spinner animation="grow" size="md" variant="danger" />}
					<p className="activate_lavel">{text}</p>
					{show_btn && <Button color="primary" className="login100-form-btn btn btn-primary" onClick={this.requestActivation} disabled={loading}>{loading? <Spinner color='light' style={{ width: '1.2rem', height: '1.2rem' }} /> : 'Request Activation'}</Button>}
				</div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
		messages: state.auth.messages,
	}
}

export default withRouter(connect(mapStateToProps, { activate })(withSnackbar(Activate)));
