import React from 'react';
import './adminlogin.scss'; 
import { connect } from 'react-redux';
import { Button, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Spinner } from 'reactstrap';
import { authAdminLogin } from '../../redux/actions';
import logo from '../../resources/images/logo.png'
import { NavLink, withRouter } from 'react-router-dom';
import { withSnackbar } from 'notistack';

class AdminLogin extends React.Component {
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
  }

  state = {
    ...this.defaultState,
    isLoggedin: false
	}

	static getDerivedStateFromProps(props, state) {
    if (props.isLoggedin) {
			props.history.replace({ pathname: '/admin' });
		} else {
			if (state.loading && !props.loading) {
				let errorMsg = (props.messages && props.messages[0]) || '';
				if (errorMsg.length > 0) {
					props.enqueueSnackbar(errorMsg, { variant: 'error' })
				}
			}
		}

		return {
			isLoggedin: props.isLoggedin,
			loading: props.loading,
		}
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
        }
        break;
      default:
        break;
    }
    this.setState({[fieldName]:field});
  }
  login = ()=>{
    if(this.state.loading || !this.validate()){
      return;
    }
		const { email, password } = this.state;
    this.props.authAdminLogin({ email: email.value, password: password.value });
	}
  
  render() {
    const { email, password, checkValidation, loading} = this.state;
    return (
			<div className="login_limiter">
				<div className="container-login100">
					<div className="wrap-login100 p-l-50 p-r-50 p-t-17 p-b-30">
						<div className="logo_login">
							<NavLink to="/home"> <img src={logo} alt="logo" /> </NavLink>
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
						<div className="container-login100-form-btn p-t-25">
							<Button color="primary" type="submit" className=" login100-form-btn btn btn-primary btn-login" onClick={this.login} disabled={loading}>{loading? <Spinner color='light' style={{ width: '1.2rem', height: '1.2rem' }} /> : 'Login'}</Button>
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

export default withRouter(connect(mapStateToProps, { authAdminLogin })(withSnackbar(AdminLogin)));