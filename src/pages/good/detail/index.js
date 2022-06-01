import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row,Input, InputGroup, InputGroupAddon, InputGroupText,Button} from 'reactstrap';
import { getMyGoods } from '../../../redux/actions';
import { updateGood as updateGoodApi, uploadImage as uploadImageApi  } from '../../../api';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router-dom';
import './good_detail.scss';

class GoodDetail extends Component {
	state = {
		good: {
			id: 0,
			name: '',
			description: '',
			image: '',
			link: ''
		},
		loading_status:false
	}
	
	componentDidMount() {
		if (this.props.match.params.id && this.props.match.params.id !== 'create') {
			const id = parseInt(this.props.match.params.id, 10);
			let index = this.props.mygoods.findIndex(temp => temp.id === id);
			if (index !== -1) {
				this.setState({
					good: this.props.mygoods[index]
				})
			} else {
				this.props.getMyGoods();
			}
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.loading && !this.props.loading) {
			const id = parseInt(this.props.match.params.id, 10);
			let index = this.props.mygoods.findIndex(temp => temp.id === id);
			if (index !== -1) {
				this.setState({
					good: this.props.mygoods[index]
				})
			}
		}
	}

	pickFileForPhoto = async (e) => {
		e.preventDefault();
		if (!e.target.files[0]) return;
		this.setState({
			loading_status:true
		})
		const response = await uploadImageApi(e.target.files[0]);
		this.setState({
			good: {...this.state.good, image: response.data.url},
			loading_status:false
		})
	}
	
	update_good = async () => {
		const { id, name, description, link, price, image } = this.state.good;
		if (name.length === 0 || description.length === 0  || link.length === 0 || !price) {
			this.props.enqueueSnackbar("Please input all fields!", { variant: 'error' })
			return;
		}
		if (image.length === 0) {
			this.props.enqueueSnackbar("Please upload an image!", { variant: 'error' })
			return;
		}

		try {
			await updateGoodApi(id, { name, description, price, link, image });
			this.props.enqueueSnackbar("Success!", { variant: 'success' })
		} catch(err) {
			this.props.enqueueSnackbar("An error occured! Please try again later.", { variant: 'error' })
		}
	}

	inputChange = (e) =>{
		this.setState({
			good: {...this.state.good, [e.target.name]: e.target.value}
		})
	}

	render() {
		const { good ,loading_status } = this.state;
		const { name, description, price, image, link } = good;
		return (
			<div className="good_detail_app">
				<div className={`loading-gif ${loading_status ? "loading_show" : ""}`}></div>
				<Container>
					<Row className="justify-content-center">
						<Col md="8">
							<div className="avatar-upload">
								{image.length > 0 && <div className="avatar-preview">
									<img id="imagePreview" src={image} alt="" />
								</div>}
								<div className="avatar-edit">
									<input accept="image/*" style={{display: 'none'}} id="file_input" type="file" onChange={e => this.pickFileForPhoto(e)}/>
									<label htmlFor="file_input">Image Upload</label>
								</div>
							</div>
							<Row style={{marginTop:"20px"}} className="justify-content-center">
								<Col md="12">
									<InputGroup className="mb-3">
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> Name: </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" value={name} id="name" name="name" onChange={this.inputChange} />
									</InputGroup>
								</Col>
								<Col md="12">
									<InputGroup className="mb-3">
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> Price: </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" value={price} id="price" name="price" type="number" onChange={this.inputChange} />
									</InputGroup>
								</Col>
								<Col md="12">
									<InputGroup className="mb-3">
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> Link: </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" value={link} id="link" name="link" onChange={this.inputChange} />
									</InputGroup>
								</Col>
								<Col md="12">
									<InputGroup className="mb-3" style={{height: '200px'}}>
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> Description: </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" type="textarea" value={description} id="description" name="description" onChange={this.inputChange} />
									</InputGroup>
								</Col>
								<Button className="btn-success" onClick={e => this.update_good()}>Save</Button>
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
		mygoods:state.good.my_goods,
		loading: state.good.loading
	}
}

export default withRouter(connect(mapStateToProps, { getMyGoods })(withSnackbar(GoodDetail)));