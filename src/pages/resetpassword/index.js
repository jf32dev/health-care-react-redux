import React from 'react';
import './resetpassword.scss'; 
import queryString from 'query-string';
import jwtDecode from 'jwt-decode';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { resetPassword as resetPasswordApi } from '../../api';
import { withSnackbar } from 'notistack';
import logo from '../../resources/images/logo.png'
import { Button, FormFeedback, Input, InputGroup, InputGroupAddon, InputGroupText, Spinner } from 'reactstrap';

class ResetPassword extends React.Component {
	state = {
		loading: false,
		text: 'Please reset your password',
		show_btn: true,
		email: '',
		code: '',
		checkValidation:false,
		password:{
      isValid:false,
      errMsg:"This field is requird!",
      value:"",
		},
		confirm_password: {
			isValid:false,
      errMsg:"This field is requird!",
      value:"",
		}
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
						email, code: query.code
					})
				} catch (err) {
					this.setState({
						text: 'Invalid URL. Please check your email or request activation again',
						show_btn: false,
					})
				}
			} else {
				this.setState({
					text: 'Invalid URL. Please check your email or request activation again',
					show_btn: false,
				})
			}
		}
	}

	inputchange = (e) => {
    const FieldName = e.target.name;
    const value     = e.target.value;

		const field = this.state[FieldName];
		field.value = value;
    field.isValid = true;
    field.errorMsg = "";

    switch(FieldName){
      case 'password':
        if(!value || value.length===0){
          field.isValid=false;
          field.errMsg="This field is required!";
        }
				break;
			case 'confirm_password':
				if(!value || value.length===0){
					field.isValid=false;
					field.errMsg="This field is required!";
				} else if (value !== this.state.password.value) {
					field.isValid=false;
					field.errMsg="Invalid Password!";
				}
				break;
      default:
        break;
    }
    this.setState({[FieldName]:field});
  }

  validate = () => {
    this.setState({
			checkValidation: true,
		});

		const { password, confirm_password } = this.state
		const isVaildForm = password.isValid && confirm_password.isValid;
		
		return isVaildForm;
	}

	resetPassword = async () => {
		if (!this.validate()) {
			return;
		}

		const { email, code, password } = this.state;

		try {
			const result = await resetPasswordApi({email, code, password: password.value});

			if (!result || result.errors) {
				if (result && result.errors.length > 0 && result.errors[0].message) {
					this.props.enqueueSnackbar(result.errors[0].message, { variant: 'error' })
				} else {
					this.props.enqueueSnackbar('There was a problem to reset your password, Please try again later or request new link.', { variant: 'error' })
				}
			} else {
				this.props.enqueueSnackbar('Your password updated successfully.', { variant: 'success' })
			}
		} catch (error) {
			this.props.enqueueSnackbar('There was a problem to reset your password, Please try again later or request new link.', { variant: 'error' })
		}
	}

  render() {
		const { password, confirm_password, checkValidation, loading, text, show_btn } = this.state;
    return (
			<div className="login_limiter">
      	<div className="reset_body">
          <div className="resetpassword_App">
						<div className="logo_login">
            	<NavLink to="/"> <img src={logo} alt="logo" /> </NavLink>  
            </div>
						<p style={{fontSize: '15px', marginBottom: '10px'}}>{text}</p>
						<div className="wrap-input100 input-container validate-input">
							<InputGroup>
								<InputGroupAddon addonType="prepend">
									<InputGroupText className="input-group-text"><i className="zmdi zmdi-email"></i> </InputGroupText>
								</InputGroupAddon>
								<Input className="input100" id="password" type="password" onChange={this.inputchange} value={password.value} invalid={checkValidation && !password.isValid} name="password" placeholder="New Password" />
								<FormFeedback>{password.errMsg}</FormFeedback>
							</InputGroup>
						</div>
						<div className="wrap-input100 input-container validate-input">
							<InputGroup>
								<InputGroupAddon addonType="prepend">
									<InputGroupText className="input-group-text"><i className="zmdi zmdi-email"></i> </InputGroupText>
								</InputGroupAddon>
								<Input className="input100" id="confirm_password" type="password" onChange={this.inputchange} value={confirm_password.value} invalid={checkValidation && !confirm_password.isValid} name="confirm_password" placeholder="Confirm Password" />
								<FormFeedback>{confirm_password.errMsg}</FormFeedback>
							</InputGroup>
						</div>
            {show_btn && <div className="input-container">
							<Button type="submit" className="btn btn-success login100-form-btn" onClick={this.resetPassword}>
								{loading? <Spinner color='light' style={{ width: '1.2rem', height: '1.2rem' }} /> : 'Reset'}
							</Button>
						</div>}
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

export default withRouter(connect(mapStateToProps, {})(withSnackbar(ResetPassword)));
