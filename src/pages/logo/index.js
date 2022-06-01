import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row, Button} from 'reactstrap';
import { uploadImage as uploadImageApi, uploadLogo as uploadLogoApi } from '../../api';
import { getLogo } from '../../redux/actions';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router-dom';

class LogoManage extends Component {
	state = {
		logo: this.props.logo,
		loading_status:false
	}

	pickFileForPhoto = async (e) => {
		e.preventDefault();
		if (!e.target.files[0]) return;
		this.setState({
			loading_status:true
		})
		const response = await uploadImageApi(e.target.files[0]);
		this.setState({
			logo: response.data.url,
			loading_status:false
		})
	}
	
	updateLogo = async () => {
		const { logo } = this.state;

		if (logo.length === 0) {
			this.props.enqueueSnackbar("Please upload an image!", { variant: 'error' })
			return;
    }
    
		await uploadLogoApi({ logo: this.state.logo});
		this.props.getLogo();
    this.props.enqueueSnackbar("Success!", { variant: 'success' })
	}

	render() {
		const { logo, loading_status } = this.state;
		return (
			<div className="article_detail_app">
				<div className={`loading-gif ${loading_status ? "loading_show" : ""}`}></div>
				<Container>
					<Row className="justify-content-center">
						<Col md="8">
							<div className="avatar-upload">
								{logo.length > 0 && <div className="avatar-preview">
									<img id="imagePreview" src={logo} alt="" style={{maxWidth: '80px', maxHeight: '80px'}} />
								</div>}
								<div className="avatar-edit">
									<input accept="image/*" style={{display: 'none'}} id="file_input" type="file" onChange={e => this.pickFileForPhoto(e)}/>
									<label htmlFor="file_input">Image Upload</label>
								</div>
							</div>
							<Row style={{marginTop:"20px"}} className="justify-content-center">
								<Button className="btn-success" onClick={this.updateLogo} style={{marginTop: '30px'}}>Save</Button>
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
		loading: state.article.loading,
		logo: state.media.logo
	}
}

export default withRouter(connect(mapStateToProps, { getLogo })(withSnackbar(LogoManage)));