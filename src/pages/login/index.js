import React from 'react';
import './login.scss'; 
import { connect } from 'react-redux';
import { Button, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Spinner } from 'reactstrap';
import { authLogin, authFacebookLogin, authGoogleLogin } from '../../redux/actions';
import logo from '../../resources/images/logo.png'
import { NavLink, withRouter } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { login as loginApi } from '../../api';
import { Helmet } from 'react-helmet';

class Login extends React.Component {
  defaultState = {
    email: {
      isValid: false,
      value: '',
      errorMsg: 'Email is required',
    },
    password: {
      isValid: false,
      value: '',
      errorMsg: 'Password is required',
    },
    checkValidation: false,
		loading: false,
		
		remember_me: false
  }

  state = {
    ...this.defaultState,
	}
	
	componentDidMount() {
		if (this.props.remember_me) {
			const { remember_me, email, password } = this.props;
			this.setState({ remember_me });
			this.inputchange({ target: { name: 'email', value: email }})
			this.inputchange({ target: { name: 'password', value: password }})
		}
		
	}

	responseFacebook = (response) => {
		if (response && response.accessToken) {
			this.props.authFacebookLogin({ access_token: response.accessToken })
		} else {
			this.props.enqueueSnackbar('An error occured. Please try again later.', { variant: 'error' })
		}
	}

	responseGoogle = (response) => {
		if (response && response.accessToken) {
			this.props.authGoogleLogin({ access_token: response.accessToken })
		}
	}

	static getDerivedStateFromProps(props, state) {
    let { from } = props.location.state || { from: { pathname: '/admin' } };
    if (props.isLoggedin) {
			props.history.replace(from);
		} else {
			if (state.loading && !props.loading) {
				let errorMsg = (props.messages && props.messages[0]) || '';
				if (errorMsg.length > 0) {
					props.enqueueSnackbar(errorMsg, { variant: 'error' })
				}
			}
		}

		return {
			loading: props.loading,
		};
  }
	
  validate(){
    this.setState ({
      checkValidation: true
    })
    const {email, password} = this.state;
    const isValidForm = email.isValid && password.isValid;

    return isValidForm;
  }

  inputchange = (e) => {
    const fieldName = e.target.name;
    const value     = e.target.value;
    
    let field = this.state[fieldName];
    field.value = value;
    field.isValid = true;
    field.errorMsg = "";

    switch(fieldName){
      case 'email':
        if(!value || value.length===0){
          field.isValid=false;
          field.errorMsg="Email is required!";
        } else{
					field.isValid = value.toLowerCase().match(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
					field.errorMsg = field.isValid? '' : 'Invalid Email Format';
        }
        break;
      case 'password':
        if(!value || value.length===0){
          field.isValid=false;
          field.errorMsg="Password is required!";
        } else if (value.length < 6) {
					field.isValid=false;
          field.errorMsg="Password must be at least 6 letters!";
				}
        break;
      default:
        break;
    }
    this.setState({[fieldName]:field});
  }
  login = async ()=>{
    if(this.state.loading || !this.validate()){
      return;
		}
		
		try {
			this.setState({ loading: true });
			const { email, password, remember_me } = this.state;
			const result = await loginApi(email.value, password.value);
			if (!result || result.errors) {
				if (result && result.errors.length > 0 && result.errors[0].message) {
					this.props.enqueueSnackbar(result.errors[0].message, { variant: 'error' })
				} else {
					this.props.enqueueSnackbar('There was a problem to logging in, Please try again later.', { variant: 'error' })
				}
			} else {
				this.props.authLogin({
					login_info: { email: email.value, password: password.value, remember_me },
					data: result.data
				})
			}
			this.setState({ loading: false })
		} catch(e) {
			this.props.enqueueSnackbar('There was a problem logging in, Please try again later.', { variant: 'error' })
			this.setState({ loading: false })
		}
	}
	
	checkBoxchange = (e) => {
		this.setState({remember_me: !this.state.remember_me});
	}
  
  render() {
    const { email, password, checkValidation, remember_me, loading} = this.state;
    return (
			<div className="login_limiter">
				<Helmet> <meta name="description" content="Login to Afib" /> </Helmet>
				<div className="container-login100">
					<div className="wrap-login100 p-l-50 p-r-50 p-t-17 p-b-30">
						<div className="logo_login">
							<NavLink to="/"> <img src={logo} alt="logo" /> </NavLink>
						</div>
						<span className="login100-form-title p-b-25"> WELCOME BACK! </span>
						<div className="wrap-input100 validate-input m-b-16" data-validate = "Valid email is required: ex@abc.xyz">
							<InputGroup className="mb-3">
								<InputGroupAddon addonType='prepend'>
									<InputGroupText>
											<i className="zmdi zmdi-account zmdi-hc-lg"></i> 
									</InputGroupText>
								</InputGroupAddon>
									<Input className="input100" type="text" invalid={checkValidation && !email.isValid} onChange={this.inputchange} value={email.value} placeholder="Email" id="Email" name="email" />
									<FormFeedback>{email.errorMsg}</FormFeedback>
							</InputGroup>
						</div>
						<div className="wrap-input100 validate-input m-b-16" data-validate = "Password is required">
							<InputGroup className="mb-3">
								<InputGroupAddon addonType='prepend'>
									<InputGroupText>
										<i className="zmdi zmdi-lock"></i> 
									</InputGroupText>
								</InputGroupAddon>
								<Input type="password" className="input100" invalid={checkValidation && !password.isValid} onChange={this.inputchange} value={password.value} placeholder="Password" id="password" name="password" />
								<FormFeedback>{password.errorMsg}</FormFeedback>
							</InputGroup>
						</div>
						<div className="contact100-form-checkbox m-l-4">
							<input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me" onChange={this.checkBoxchange} checked={remember_me}/>
							<label className="label-checkbox100" htmlFor="ckb1" style={{float:'left'}}>
								Remember me
							</label>
							<NavLink to="/forgotpassword" className="txt1 bo1 hov1 forget_password_label"  style={{float:'right' , color:"#002363", fontSize:"1em"}}>
								Forgot Password?							
							</NavLink>
						</div>
						<div className="container-login100-form-btn p-t-25">
							<Button color="primary" type="submit" className=" login100-form-btn btn btn-primary btn-login" onClick={this.login} disabled={loading}>{loading? <Spinner color='light' style={{ width: '1.2rem', height: '1.2rem' }} /> : 'Login'}</Button>
						</div>
						<div className="text-center w-full p-t-22 p-b-22">
							<span className="txt1"> Or login with </span>
						</div>
						<div>
							<p className="btn-face m-b-10" style={{marginBottom: '10px'}}>
								<FacebookLogin
									appId={process.env.REACT_APP_FACEBOOK_APPID}
									fields="name,email,picture"
									callback={this.responseFacebook}
									icon="fa-facebook"
									textButton="Login With Facebook" />   
							</p>
							<p className="btn-google m-b-10">
								<GoogleLogin
									clientId={process.env.REACT_APP_GOOGLE_CLIENTID}
									render={renderProps => (
										<button onClick={renderProps.onClick} disabled={renderProps.disabled} style={{color:"white"}}><i className="fa fa-google" aria-hidden="true"></i> LOGIN WITH GOOGLE</button>
									)}
									buttonText="Login"
									onSuccess={this.responseGoogle}
									onFailure={this.responseGoogle}
									cookiePolicy={'single_host_origin'}
								/>
							</p>
						</div>
						<div className="text-center w-full p-t-15">
							<span className="txt1">
								Not a member?
							</span>
							<NavLink className="txt1 bo1 hov1" to="/register" style={{color:"#002363"}}>
								Sign up now							
							</NavLink>
						</div>
					</div>
				</div>
			</div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedin: state.auth.loggedin,
		loading: state.auth.loading,
		me: state.auth.me,
		messages: state.auth.messages,

		email: state.auth.email,
		password: state.auth.password,
		remember_me: state.auth.remember_me,
  }
}

export default withRouter(connect(mapStateToProps, { authLogin, authFacebookLogin, authGoogleLogin })(withSnackbar(Login)));