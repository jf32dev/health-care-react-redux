import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row,Input, InputGroup, InputGroupAddon, InputGroupText,Button} from 'reactstrap';
import { getMyPost } from '../../../redux/actions';
import { updatePost as updatePostApi, uploadImage as uploadImageApi  } from '../../../api';
import { withSnackbar } from 'notistack';
import { withRouter  } from 'react-router-dom';
import './post_detail.scss';

class PostDetail extends Component {
	state = {
		post: {
			id: 0,
			content: '',
			image: '',
			nickname: this.props.me.username
		},
		loading_status:false
	}
	
	componentDidMount() {
		if (this.props.match.params.id && this.props.match.params.id !== 'create') {
			const id = parseInt(this.props.match.params.id, 10);
			let index = this.props.myposts.findIndex(temp => temp.id === id);
			if (index !== -1) {
				this.setState({
					post: this.props.myposts[index]
				})
			} else {
				this.props.getMyPost();
			}
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.loading && !this.props.loading) {
			const id = parseInt(this.props.match.params.id, 10);
			let index = this.props.myposts.findIndex(temp => temp.id === id);
			if (index !== -1) {
				this.setState({
					post: this.props.myposts[index]
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
			post: {...this.state.post, image: response.data.url},
			loading_status:false
		})
	}
	
	update_post = async () => {
		const { id, nickname, content, image } = this.state.post;
		if(content.length !== 0){
			try {
				await updatePostApi(id, { nickname, content, image});
				this.props.enqueueSnackbar("Success!", { variant: 'success' })
				this.props.history.replace("/admin/post");
			} catch(err) {
				this.props.enqueueSnackbar("An error occured! Please try again later.", { variant: 'error' })
			}
		}
		else{
			this.props.enqueueSnackbar("Please input description!", { variant: 'error' })
		}
	}

	descChange = (e) =>{
		let content = e.target.value;
		this.setState({
			post: {...this.state.post, [e.target.name]: content}
		})
	}

	render() {
		const { post,loading_status } = this.state;
		const { nickname, content, image } = post;
		return (
			<div className="post_detail_app">
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
											<InputGroupText> Nickname: </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" placeholder="" value={nickname} id="nickname" name="nickname" onChange={this.descChange} />
									</InputGroup>
								</Col>
								<Col md="12">
									<InputGroup className="mb-3" style={{height: '200px'}}>
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> Content: </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" type="textarea" placeholder="" value={content} id="content" name="content" onChange={this.descChange} />
									</InputGroup>
								</Col>
								<Button className="btn-success" onClick={this.update_post}>Save</Button>
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
		myposts:state.post.my_posts,
		loading: state.post.loading
	}
}

export default withRouter(connect(mapStateToProps, { getMyPost })(withSnackbar(PostDetail)));