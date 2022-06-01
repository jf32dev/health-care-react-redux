import React from 'react';

import { connect } from 'react-redux';
import { Button, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Spinner, Row, Col } from 'reactstrap';
import { authSignup, authFacebookLogin, authGoogleLogin } from '../../redux/actions';
import logo from '../../resources/images/logo.png'
import { NavLink, withRouter } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { signup as signupApi } from '../../api';
import { Helmet } from 'react-helmet';

class Register extends React.Component {
  defaultState = {
		email:{
      isValid:false,
      errMsg:"This field is requird!",
      value:"",
    },
    username:{
      isValid:false,
      errMsg:"This field is requird!",
      value:"",
		},
    first_name:{
      isValid:false,
      errMsg:"This field is requird!",
      value:"",
		},
		last_name:{
      isValid:false,
      errMsg:"This field is requird!",
      value:"",
		},
		subject:{
      isValid:false,
      errMsg:"This field is requird!",
      value:"",
    },
    phonenumber:{
      isValid:false,
      errMsg:"This field is requird!",
      value:"",
    },
    password:{
      isValid:false,
      errMsg:"This field is requird!",
      value:"",
    },
    confirm_password:{
      isValid:false,
      errMsg:"This field is requird!",
      value:"",
		},
    type: 0,
    check: false,
    checkValidation:false,
    loading:false,
		social_login: false
  }
  state ={
    ...this.defaultState,
	}
	
	static getDerivedStateFromProps(props, state) {
    if (props.isLoggedin) {
			props.history.replace('/admin');
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
		}
	}

  responseFacebook = (response) => {
		if (response && response.accessToken) {
			this.setState({ social_login: true })
			this.props.authFacebookLogin({ access_token: response.accessToken })
		} else {
			this.props.enqueueSnackbar('An error occured. Please try again later.', { variant: 'error' })
		}
	}

	responseGoogle = (response) => {
		if (response && response.accessToken) {
			this.setState({ social_login: true })
			this.props.authGoogleLogin({ access_token: response.accessToken })
		} 
	}

  inputchange = (e) => {
    const FieldName = e.target.name;
    const value     = e.target.value;

		const field = this.state[FieldName];
		field.value = value;
		field.isValid = true;
		field.errorMsg = '';

    switch(FieldName){
      case 'first_name':
			case 'last_name':
			case 'phonenumber':
			case 'subject':
        if(!value || value.length===0){
          field.isValid=false;
          field.errMsg="This field is required!";
        }
        break;
      case 'username':
        if(!value || value.length===0){
          field.isValid=false;
          field.errMsg="This field is required!";
        } else if (value.length < 4 || value.length > 20) {
          field.isValid = false;
          field.errMsg = "Username should be 4 to 20 characters.";
        } else {
          field.isValid = value.match(/^[a-zA-Z0-9&._-]+$/);
          field.errMsg = field.isValid ? '' : "Username should not contain spaces or special characters.";
        }
        break;
      case 'email':
        if(!value || value.length===0){
          field.isValid=false;
          field.errMsg="Email is required!";
        } else {
          field.isValid = value.toLowerCase().match(/^(([^<>()\[\]\.,;:\s@\']+(\.[^<>()\[\]\.,;:\s@\']+)*)|(\'.+\'))@(([^<>()[\]\.,;:\s@\']+\.)+[^<>()[\]\.,;:\s@\']{2,})$/); // eslint-disable-line
          field.errMsg = field.isValid ? '' : "Incorrect email format!";
        }
      	break;
      case 'password':
        if(!value || value.length===0){
          field.isValid=false;
          field.errMsg="This field is required!";
        } else if (value.length < 6) {
					field.isValid=false;
          field.errorMsg="Password must be at least 6 letters!";
				}
      	break;

      case 'confirm_password':
        if(!value || value.length===0){
          field.isValid=false;
          field.errMsg="This field is required!";
        } else if (value.length < 6) {
					field.isValid=false;
          field.errorMsg="Password must be at least 6 letters!";
				} else if (value !== this.state.password.value) {
					field.isValid=false;
          field.errMsg="Invalid password!";
				}
        break;
      default:
        break;
    }
    this.setState({[FieldName]:field});
  }

  validate = () => {
    this.setState ({
      checkValidation: true
		})
		
		const { email, username, first_name, last_name, subject, phonenumber, password, confirm_password, type } = this.state;
   
		let isValidform = email.isValid && username.isValid && first_name.isValid && last_name.isValid && phonenumber.isValid && password.isValid && confirm_password.isValid;
		if (type === 1) {
			isValidform = isValidform && subject.isValid;
		}
    return isValidform;
	}
	
	register = async () => {
    if(this.state.loading || !this.validate()){
			return;
    }
    if (!this.state.check) {
      this.props.enqueueSnackbar('Please accept our privacy policy and terms & conditions.', { variant: 'error' })
      return;
    }
    this.setState({ social_login: false, loading: true })
    try {
			const { email, username, first_name, last_name, phonenumber, password, type, subject } = this.state
			const result = await signupApi({
        email: email.value,
        username: username.value,
        first_name: first_name.value,
        last_name: last_name.value,
        phonenumber: phonenumber.value,
        password: password.value,
        type: type,
        subject: type === 1 ? subject.value : ''
      });
			if (!result || result.errors) {
				if (result && result.errors.length > 0 && result.errors[0].message) {
					this.props.enqueueSnackbar(result.errors[0].message, { variant: 'error' })
				} else {
					this.props.enqueueSnackbar('There was a problem to signing up, Please try again later.', { variant: 'error' })
				}
			} else {
				this.props.enqueueSnackbar('We have sent verification email. Please check your email inbox.', { variant: 'success' })
			}
			this.setState({ loading: false })
		} catch(e) {
			this.props.enqueueSnackbar('There was a problem signing up, Please try again later.', { variant: 'error' })
			this.setState({ loading: false })
		}
  };

  render() {
    const { email, username, first_name, last_name, subject, phonenumber, password, confirm_password, type, checkValidation, loading, check } = this.state;
    return (
      <div className="login_limiter">
        <Helmet> <meta name="description" content="Become ClubAfib Member" /> </Helmet>
        <div className="container-login100">
          <div className="wrap-login100 p-l-50 p-r-50 p-t-17 p-b-30">
            <div className="logo_login">
              <NavLink to="/">
                <img src={logo} alt="logo" />
              </NavLink>  
            </div>
              <span className="login100-form-title p-b-25"> SIGN UP! </span>
							{/* <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginBottom: '20px'}}>
								<h3 className="txt1" style={{marginBottom: '6px'}}> I am </h3>
								<ButtonGroup>
									<Button className="btn primary" onClick={() => this.setState({type: 0})} active={type === 0}>Patient</Button>
									<Button className="btn primary" onClick={() => this.setState({type: 1})} active={type === 1}>Doctor</Button>
								</ButtonGroup>
							</div> */}
              <div className="wrap-input100 validate-input m-b-16">
                <InputGroup className="mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="input-group-text"><i className="zmdi zmdi-email"></i></InputGroupText>
                  </InputGroupAddon>
                  <Input className="input100" id="email" type="text" onChange={this.inputchange} invalid={checkValidation && !email.isValid} value={email.value} name="email" placeholder="Email" />
                  <FormFeedback>{email.errMsg}</FormFeedback>
                </InputGroup>
              </div>
              <div className="wrap-input100 validate-input m-b-16">
								<InputGroup className=" mb-3">
									<InputGroupAddon addonType="prepend">
										<InputGroupText ><i className="zmdi zmdi-account zmdi-hc-lg"></i></InputGroupText>
									</InputGroupAddon>
									<Input className="input100" id="username" type="text" onChange={this.inputchange} value={username.value} invalid={checkValidation && !username.isValid} name="username" placeholder="Username" />
									<FormFeedback>{username.errMsg}</FormFeedback>
								</InputGroup>
							</div>
							<Row>
								<Col md="6">
									<div className="wrap-input100 validate-input m-b-16">
										<InputGroup className=" mb-3">
											<InputGroupAddon addonType="prepend">
												<InputGroupText ><i className="zmdi zmdi-account zmdi-hc-lg"></i></InputGroupText>
											</InputGroupAddon>
											<Input className="input100" id="first_name" type="text" onChange={this.inputchange} value={email.first_name} invalid={checkValidation && !first_name.isValid} name="first_name" placeholder="First name" />
											<FormFeedback>{first_name.errMsg}</FormFeedback>
										</InputGroup>
									</div>
								</Col>
								<Col md="6">
									<div className="wrap-input100 validate-input m-b-16">
										<InputGroup className=" mb-3">
											<InputGroupAddon addonType="prepend">
												<InputGroupText ><i className="zmdi zmdi-account zmdi-hc-lg"></i></InputGroupText>
											</InputGroupAddon>
											<Input className="input100" id="last_name" type="text" onChange={this.inputchange} value={last_name.value} invalid={checkValidation && !last_name.isValid} name="last_name" placeholder="Last name" />
											<FormFeedback>{last_name.errMsg}</FormFeedback>
										</InputGroup>
									</div>
								</Col>
							</Row>
							{type === 1 && <div className="wrap-input100 validate-input m-b-16">
								<InputGroup className=" mb-3">
									<InputGroupAddon addonType="prepend">
										<InputGroupText ><i className="zmdi zmdi-account zmdi-hc-lg"></i></InputGroupText>
									</InputGroupAddon>
									<Input className="input100" id="subject" type="text" onChange={this.inputchange} value={subject.value} invalid={checkValidation && !subject.isValid} name="subject" placeholder="Subject (ex: Dental Surgeon)" />
									<FormFeedback>{subject.errMsg}</FormFeedback>
								</InputGroup>
							</div>}
							<div className="wrap-input100 validate-input m-b-16">
								<InputGroup className=" mb-3">
									<InputGroupAddon addonType="prepend">
										<InputGroupText ><i className="zmdi zmdi-phone zmdi-hc-lg"></i></InputGroupText>
									</InputGroupAddon>
									<Input className="input100" id="phonenumber" type="text" onChange={this.inputchange} value={phonenumber.value} invalid={checkValidation && !phonenumber.isValid} name="phonenumber" placeholder="Phone Number" />
									<FormFeedback>{phonenumber.errMsg}</FormFeedback>
								</InputGroup>
							</div>
              <div className="wrap-input100 validate-input m-b-16">
                <InputGroup className="mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="input-group-text"><i className="zmdi zmdi-lock"></i></InputGroupText>
                  </InputGroupAddon>
                  <Input className="input100" id="password" type="password" onChange={this.inputchange} value={password.value} invalid={checkValidation && !password.isValid} name="password" placeholder="Password" />
                  <FormFeedback>{password.errMsg}</FormFeedback>
              	</InputGroup>
              </div>
              <div className="wrap-input100 validate-input m-b-16">
                <InputGroup className="mb-3">
									<InputGroupAddon addonType="prepend">
										<InputGroupText className="input-group-text"><i className="zmdi zmdi-lock"></i></InputGroupText>
									</InputGroupAddon>
									<Input className="input100" id="confirm_password" type="password" onChange={this.inputchange} value={confirm_password.value} invalid={checkValidation && !confirm_password.isValid} name="confirm_password" placeholder="Confirm Password" />
									<FormFeedback>{confirm_password.errMsg}</FormFeedback>
                </InputGroup>
              </div>
              <div className="wrap-input100 validate-input m-b-16 v-c">
                <Input type="checkbox" style={{margin: '0 10px 0 0', position: 'relative', width: '15px', height: '15px'}} value={check} onClick={e=>this.setState({check: !check})}/>
                <p style={{flex: 1, fontSize: '13px'}}>I accept the <NavLink to="/privacy-policy" style={{color: '#002363'}}>Privacy Policy</NavLink> (including the use of cookies) and the <NavLink to="/terms-and-conditions" style={{color: '#002363'}}>Terms & Conditions.</NavLink></p>
              </div>
              <div className="container-login100-form-btn p-t-25">
              	<Button type="submit" className="btn btn-success login100-form-btn" onClick={this.register} disabled={loading}>{loading? <Spinner color='light' style={{ width: '1.2rem', height: '1.2rem' }} /> : 'Create Account'}</Button>
              </div>
              <div className="text-center w-full p-t-22 p-b-22">
                <span className="txt1">
                  Or signup with
                </span>
              </div>
              <div>
                <p className="btn-face m-b-10" style={{marginBottom: '10px'}}>
                  <FacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_APPID}
                    fields="name,email,picture"
                    callback={this.responseFacebook}
                    icon="fa-facebook"
                    textButton="Register With Facebook"/>   
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
                <span className="txt1"> Back to </span>
                <NavLink className="txt1 bo1 hov1" to="/login" style={{color:"#002363", paddingLeft:"5px"}}>
                   Sign in now							
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
  }
}

export default withRouter(connect(mapStateToProps, { authSignup, authFacebookLogin, authGoogleLogin })(withSnackbar(Register)));

