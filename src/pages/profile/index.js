import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row,Input, InputGroup, InputGroupAddon, InputGroupText,Button} from 'reactstrap';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router-dom';
import { uploadImage as uploadImageApi, updateProfile as updateProfileApi } from '../../api';
import { updateProfile } from '../../redux/actions';
import './profile.scss';

class Profile extends Component {
	state = {
		me: this.props.me,
		loading_status: false
	}
    
	update_profile = async () => {
		const { email, username, first_name, last_name, phonenumber, subject, photo, about, address } = this.state.me;
		if (username.length === 0) {
			this.props.enqueueSnackbar("Nick name can't be empty.", { variant: 'error' })
			return;
		}
		if (first_name.length === 0) {
			this.props.enqueueSnackbar("First name can't be empty.", { variant: 'error' })
			return;
		}
		try {
			this.setState({ loading_status:true })
			await updateProfileApi({ email, username, first_name, last_name, phonenumber, subject, photo, about, address })
			this.props.updateProfile({ email, username, first_name, last_name, phonenumber, subject, photo, about, address })
			this.setState({ loading_status:false })
			this.props.enqueueSnackbar("Saved.", { variant: 'success' })
		} catch (err) {
			this.props.enqueueSnackbar("An error occured. Please try again later.", { variant: 'error' })
		}
	}

	pickFileForPhoto = async (e) => {
		e.preventDefault();
		if (!e.target.files[0]) return;
		this.setState({ loading_status:true })
		const response = await uploadImageApi(e.target.files[0]);
		this.setState({
			me: {...this.state.me, photo: response.data.url},
			loading_status: false
		})
	}

	updateMe = (e) => {
		this.setState({
			me: { ...this.state.me, [e.target.name] : e.target.value }
		})
	}

  render() {
		const {me, loading_status} =  this.state;
		const { username, first_name, last_name, phonenumber, subject, type, photo, about, address } = me;
    return (
      <div className="profile_app">
				<div className={`loading-gif ${loading_status ? "loading_show" : ""}`}></div>
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
							<div className="avatar-upload">
								<div className="avatar-edit">
									<input accept="image/*" id="imageUpload" type="file" onChange={e => this.pickFileForPhoto(e)}/>
									<label htmlFor="imageUpload" className="v-c h-c"><i className="fas fa-camera"></i></label>
								</div>
								<div className="avatar-preview">
									<img className="profile-user-img img-responsive img-circle" id="imagePreview" src={photo} alt="" />
								</div>
							</div>
							<Row className="justify-content-center">
								<Col md="12">
									<InputGroup className="mb-3">
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> Nickname </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" id="username" name="username" value={username || ''} onChange={e => this.updateMe(e)}/>
									</InputGroup>
								</Col>
								<Col md="6">
									<InputGroup className="mb-3">
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> First Name </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" id="first_name" name="first_name" value={first_name} onChange={e => this.updateMe(e)}/>
									</InputGroup>
								</Col>
								<Col md="6">
									<InputGroup className="mb-3">
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> Last Name </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" id="last_name" name="last_name" value={last_name} onChange={e => this.updateMe(e)}/>
									</InputGroup>
								</Col>
								<Col md="12">
									<InputGroup className="mb-3">
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> Phone Number </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" id="phonenumber" name="phonenumber" value={phonenumber || ''} onChange={e => this.updateMe(e)}/>
									</InputGroup>
								</Col>
								<Col md="12">
									<InputGroup className="mb-3">
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> Address </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" id="address" name="address" value={address || ''} onChange={e => this.updateMe(e)}/>
									</InputGroup>
								</Col>
								{type===1 && <Col md="12">
									<InputGroup className="mb-3">
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> Subject </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" id="subject" name="subject" value={subject || ''} onChange={e => this.updateMe(e)}/>
									</InputGroup>
								</Col>}
								<Col md="12">
									<InputGroup className="mb-3" style={{height: '100px'}}>
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> About </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" type="textarea" id="about" name="about" value={about || ''} onChange={e => this.updateMe(e)}/>
									</InputGroup>
								</Col>
								<Button className="btn-success" onClick={e => this.update_profile()}>Save</Button>
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
		me : state.auth.me,
	}
}

export default withRouter(connect(mapStateToProps, { updateProfile })(withSnackbar(Profile)));
