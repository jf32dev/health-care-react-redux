import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import { getPosts, doReaction } from '../../redux/actions';
import './post_home.scss';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import { Redirect } from 'react-router-dom';
import { deletePost as deletePostApi, deleteAdminPost as deleteAdminPostApi, updatePost as updatePostApi, uploadImage as uploadImageApi } from '../../api';
import {  Modal } from 'reactstrap';
import { Helmet } from 'react-helmet';

function innerFunc(item) {
	return {__html: item}
}

class Post extends Component {
	state = {
		posts: this.props.posts,
		search_string: '',
		showModal: false,

		nickname: this.props.me ? this.props.me.username || '' : '',
		content: '',
		image: '',
		loading_status:false
	}
	
	componentDidMount() {
		this.props.getPosts();
	}

	static getDerivedStateFromProps(props, state) {
		return {
			posts: props.posts
		}
	}

	navigate = (id) => {
		this.props.history.push(`/post/${id}`);
	}

	doReaction = (e, id, value) => {
		e.stopPropagation();
		if (!this.props.loggedin) {
			this.props.history.push('/login');
			return;
		}
		if (this.props.is_admin) {
			this.props.enqueueSnackbar("Admin is not allowed", { variant: 'error' });
			return;
		}
		this.props.doReaction({
			type: 0,
			user_id: this.props.me.id,
			relation_id: id,
			value
		})
	}

	checkReaction = (item, value) => {
		if (!this.props.loggedin || this.props.is_admin) return false;
		let checkArray = value === 1 ? item.likes : item.dislikes;
		let index = checkArray.findIndex(temp => temp.user_id === this.props.me.id);
		return index === -1 ? false : true;
	}

	getContent = (content) => {
		const checkReg = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
		const text = content.replace(checkReg, '<a href="$1" target="_blank">$1</a>');
		return text;
	}

	deletePost = async (e, id) => {
		e.stopPropagation();
		if (window.confirm('Do you really want to delete your post?')) {
			if (this.props.is_admin) {
				await deleteAdminPostApi(id);
			} else {
				await deletePostApi(id);
			}
			this.props.getPosts();
		}
	}

	toggleModal = () => {
		this.setState({ showModal: !this.state.showModal});
	}

	pickFileForPhoto = async (e) => {
		e.preventDefault();
		if (!e.target.files[0]) return;
		this.setState({
			loading_status:true
		})
		const response = await uploadImageApi(e.target.files[0]);
		this.setState({
			image: response.data.url,
			loading_status:false
		})
	}

	savePost = async () => {
		const { nickname, content, image } = this.state;
		if(content.length !== 0 || nickname.length !== 0){
			try {
				await updatePostApi(0, { nickname, content, image});
				this.props.enqueueSnackbar("Success!", { variant: 'success' })
				this.setState({
					nickname: this.props.me.username,
					image: '',
					content: ''
				});
				this.toggleModal();
				this.props.getPosts();
			} catch(err) {
				this.props.enqueueSnackbar("An error occured! Please try again later.", { variant: 'error' })
			}
		}
		else{
			this.props.enqueueSnackbar("Please input all fields!", { variant: 'error' })
		}
	}

  render() {
		const { loggedin, me } = this.props;
		if (!loggedin || !me) {
      return (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: this.props.location }
          }} />
      )
    }
		const {posts, search_string, showModal, content, nickname, loading_status, image } =  this.state;
		const data = posts.filter(item => item.content.toLowerCase().indexOf(search_string.toLowerCase()) > -1);
    return (
      <div className="post_home">
				<Helmet  title="Post | Club Afib" />
        <Container>
          <div className="justify-content-center post-container">
						<div className="v-c search-container">
							<div className="search-box v-c shadow-box">
								<i className="zmdi zmdi-search"></i>
								<input className="search-input" placeholder="Search..." value={search_string} onChange={e => this.setState({ search_string: e.target.value })} />
							</div>
							{!this.props.is_admin && <div className="add-btn v-c h-c shadow-box" onClick={e => this.toggleModal()}>Create Post</div>}
						</div>
						
            {(data.length > 0) && data.map((item, index) => 
							<div className="post_view" key={index} onClick={e => this.navigate(item.id)}>
								<div className="v-c">
									<img src={item.creator.photo} style={{width:"40px", height: '40px', borderRadius: '50%', marginRight: '10px'}} alt=""/>
									<div style={{display: 'flex', flexDirection: 'column'}}>
										<label style={{margin: 0}}>{item.nickname}</label>
										<label style={{margin: 0, fontSize: '10px'}}> {moment(item.createdAt).format('lll')} </label>
									</div>
								</div>
								{(item.image && item.image.length > 0) && <div className="thumbnail v-c h-c">
									<img id="imagePreview" src={item.image} alt="User profile" />
								</div>}
								<h6 className="item-content" onClick={e => e.stopPropagation()} dangerouslySetInnerHTML={innerFunc(this.getContent(item.content))} />
								<div className="like_dislike_div v-c">
									<div className="like_div" onClick={e => this.doReaction(e, item.id, 1)}>
										<button id="green" className={`like-btn ${this.checkReaction(item, 1) ? 'activate' : ''}`} ><i className="fa fa-thumbs-up fa-lg" aria-hidden="true"></i></button>
										<label> {item.likes.length} </label>
									</div>
									<div className="dislike_div" onClick={e => this.doReaction(e, item.id, 2)}>
										<button id="red" className={`dislike-btn ${this.checkReaction(item, 2) ? 'activate' : ''}`} ><i className="fa fa-thumbs-down fa-lg" aria-hidden="true"></i></button>
										<label>{item.dislikes.length}</label>   
									</div>
									<div className="dislike_div">
										<button id="red" className={`dislike-btn`} ><i className="fas fa-comment-alt" aria-hidden="true"></i></button>
										<label>{item.comments.length}</label>
									</div>
									{(item.creator.id === this.props.me.id || this.props.is_admin) && <div className="dislike_div" onClick={e => this.deletePost(e, item.id)}>
										<button id="red" className={`dislike-btn`} ><i className="fa fa-trash" aria-hidden="true"></i></button>
									</div>}
								</div>
							</div>
            )}

						<Modal isOpen={showModal} toggle={this.toggleModal} className="add-modal" backdrop="static">
							<div className="title-part v-c">
								<p>Write your memory to post</p>
								<p className={`close-btn ${loading_status ? 'disabled' : ''}`} onClick={e => this.toggleModal()}>&times;</p>
							</div>
							<div className="add-content v-r">
								{image.length > 0 && <img src={image} alt="post_pic" />}
								<input value={nickname} onChange={e => this.setState({nickname: e.target.value})} placeholder="Nickname..."/>
								<textarea value={content} onChange={e => this.setState({ content: e.target.value})} placeholder="Content..."/>
								<div className="v-c btn-area">
									<input accept="image/*" style={{display: 'none'}} id="file_input" type="file" onChange={e => this.pickFileForPhoto(e)}/>
									<label htmlFor="file_input" className="v-c h-c"><i className="fas fa-image" /></label>
									<div className={`v-c h-c post-btn ${loading_status ? 'disabled' : ''}`} onClick={e => this.savePost()}>{ loading_status ? 'Processing...' : 'Save'}</div>
								</div>
							</div>
						</Modal>
          </div>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
	return {
		posts:state.post.posts,
		me: state.auth.me,
		loggedin: state.auth.loggedin,
		is_admin: state.auth.is_admin
	}
}

export default connect(mapStateToProps, { getPosts, doReaction })(withSnackbar(Post));
