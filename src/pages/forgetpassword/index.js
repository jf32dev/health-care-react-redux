import React from 'react';

import { connect } from 'react-redux';
import { Button, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Spinner } from 'reactstrap';
import logo from '../../resources/images/logo.png'
import { NavLink, withRouter } from 'react-router-dom';
import { requestResetPassword as requestResetPasswordApi  } from '../../api';
import { withSnackbar } from 'notistack';

class ForgotPassword extends React.Component {
  defaultState = {
    email:{
      isValid:false,
      errMsg:"This field is requird!",
      value:"",
    },
    checkValidation:false,
    loading:false,
    errResponse:"",
  }
  state ={
    ...this.defaultState,
  }

  inputchange = (e) => {
    const FieldName = e.target.name;
    const value     = e.target.value;

		const field = this.state[FieldName];
		field.value = value;
    field.isValid = true;
    field.errorMsg = "";

    switch(FieldName){
      case 'email':
        if(!value || value.length===0){
          field.isValid=false;
          field.errMsg="This field is required!";
        } else {
          field.isValid = value.toLowerCase().match(/^(([^<>()\[\]\.,;:\s@\']+(\.[^<>()\[\]\.,;:\s@\']+)*)|(\'.+\'))@(([^<>()[\]\.,;:\s@\']+\.)+[^<>()[\]\.,;:\s@\']{2,})$/); // eslint-disable-line
          field.errMsg = field.isValid ? '' : "Invalid email format!";
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
   
    const isValidform = this.state.email.isValid;
    return isValidform;
	}
	
	sendEmail = async () => {
    if(this.state.loading || !this.validate()){
			return;
		}
		
		const { email } = this.state;
		try {
			const result = await requestResetPasswordApi(email.value);

			if (!result || result.errors) {
				if (result && result.errors.length > 0 && result.errors[0].message) {
					this.props.enqueueSnackbar(result.errors[0].message, { variant: 'error' })
				} else {
					this.props.enqueueSnackbar('There was a problem to send email, Please try again later.', { variant: 'error' })
				}
			} else {
				this.props.enqueueSnackbar('We sent reset password link to your email.', { variant: 'success' })
			}
		} catch (error) {
			this.props.enqueueSnackbar('There was a problem to send email, Please try again later.', { variant: 'error' })
		}
  };

  render() {
    const { email, checkValidation, loading } = this.state;
    
    return (
      <div className="login_limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-l-50 p-r-50 p-t-17 p-b-30">
            <div className="logo_login">
            	<NavLink to="/"> <img src={logo} alt="logo" /> </NavLink>  
            </div>
						<span className="login100-form-title p-b-20">
							Forgot your password?
						</span>
						<p style={{marginBottom: 10, textAlign: 'center'}}>Enter your registered email and we will send recovery link to you.</p>
						<div className="wrap-input100 validate-input m-b-16">
							<InputGroup className="mb-3">
								<InputGroupAddon addonType="prepend">
									<InputGroupText className="input-group-text"><i className="zmdi zmdi-email"></i> </InputGroupText>
								</InputGroupAddon>
								<Input className="input100" id="email" type="email" onChange={this.inputchange} value={email.value} invalid={checkValidation && !email.isValid} name="email" placeholder="Email" />
								<FormFeedback>{email.errMsg}</FormFeedback>
							</InputGroup>
						</div>
						<div className="container-login100-form-btn p-t-25">
							<Button type="submit" className="btn btn-success login100-form-btn" onClick={this.sendEmail}>{loading? <Spinner color='light' style={{ width: '1.2rem', height: '1.2rem' }} /> : 'Send Email'}</Button>
						</div>
						<div className="text-center w-full p-t-15">
							<span className="txt1">
								Back to 
							</span>
							<NavLink className="txt1 bo1 hov1" to="/login" style={{color:"#002363", paddingLeft:"5px"}}>
									Sign in
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
  }
}

export default withRouter(connect(mapStateToProps, {})(withSnackbar(ForgotPassword)));
