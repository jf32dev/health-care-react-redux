import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import { createComment as createCommentApi, deletePost as deletePostApi, deleteAdminPost as deleteAdminPostApi } from '../../../api';
import { doReaction, getPosts, leaveComment } from '../../../redux/actions';
import './post_detail_home.scss';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function innerFunc(item) {
	return {__html: item}
}


class PostDetail extends Component {
	state = {
		post:{
			id: 0,
      comments:[],
      likes:[],
      dislikes:[],
		},
		me:[],
    text: '',
	}

	componentDidMount() {
		let index = this.props.posts.findIndex(temp => temp.id === parseInt(this.props.match.params.id, 10));
		if (index === -1) {
			this.props.getPosts();
		}
	}

	static getDerivedStateFromProps(props, state) {
		let index = props.posts.findIndex(temp => temp.id === parseInt(props.match.params.id, 10));
		return {
			post: index === -1 ? state.post : props.posts[index]
		};
	}
	
	doReaction = (e, id, value, type = 0, postID = 0) => {
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
			type,
			user_id: this.props.me.id,
			relation_id: id,
			value,
			postID
		})
	}

	deletePost = async (e, id) => {
		e.stopPropagation();
		if (window.confirm('Do you really want to delete your post?')) {
			if (this.props.is_admin) {
				deleteAdminPostApi(id);
			} else {
				deletePostApi(id);
			}
			this.props.history.goBack();
		}
	}
	
	checkReaction = (item, value) => {
		if (!this.props.loggedin || this.props.is_admin) return false;
		let checkArray = value === 1 ? item.likes : item.dislikes;
		let index = checkArray.findIndex(temp => temp.user_id === this.props.me.id);
		return index === -1 ? false : true;
	}

	leaveComment = async (e) => {
		const {	post, text } = this.state;
		if (text.length === 0) {
			this.props.enqueueSnackbar("Please input text!", { variant: 'error' })
			return;
		}
		try {
			const response = await createCommentApi(this.props.match.params.id, text);
			if (response.data) {
				this.props.leaveComment({ id: post.id, response: { ...response.data.comment, likes: [], dislikes: [] }});
				this.setState({text: ''})
			} else {
				this.props.enqueueSnackbar("An error occured. Please try again later", { variant: 'error' })
			}
		} catch (err) {
			this.props.enqueueSnackbar("An error occured. Please try again later", { variant: 'error' })
		}
	}

	getContent = (content) => {
		const checkReg = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
		const text = content.replace(checkReg, '<a href="$1" target="_blank">$1</a>');
		return text;
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
		const { post, text } =  this.state;
    return (
      <div className="post_detail_home">
				<Helmet> <meta name="description" content="Post with other members" /> </Helmet>
        {post.id > 0 && <Container>
          <Row className="justify-content-center">
            <Col md="8">
							<div className="v-r post-home-container-box">
								{post.image.length > 0 && <div className="avatar-preview" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<img id="imagePreview" src={post.image} alt="" />
								</div>}
								<div className="v-r">
									<div className="v-c" style={{justifyContent: 'space-between'}}>
										<div className="v-c">
											<img src={post.creator.photo} style={{width:"40px", height: '40px', borderRadius: '50%', marginRight: '10px'}} alt=""/>
											<div style={{display: 'flex', flexDirection: 'column'}}>
												<label style={{margin: 0}}>{post.nickname}</label>
												<label style={{margin: 0, fontSize: '10px'}}> {moment(post.createdAt).format('lll')} </label>
											</div>
										</div>
										<div className="like_dislike_div v-c">
											<div className="like_div" onClick={e => this.doReaction(e, post.id, 1)}>
												<button id="green" className={`like-btn ${this.checkReaction(post, 1) ? 'activate' : ''}`} ><i className="fa fa-thumbs-up fa-lg" aria-hidden="true"></i></button>
												<label> {post.likes.length} </label>
											</div>
											<div className="dislike_div" onClick={e => this.doReaction(e, post.id, 2)}>
												<button id="red" className={`dislike-btn ${this.checkReaction(post, 2) ? 'activate' : ''}`} ><i className="fa fa-thumbs-down fa-lg" aria-hidden="true"></i></button>
												<label>{post.dislikes.length}</label>   
											</div>
											{(post.creator.id === this.props.me.id || this.props.is_admin) && <div className="dislike_div" onClick={e => this.deletePost(e, post.id)}>
												<button id="red" className={`dislike-btn`} ><i className="fa fa-trash" aria-hidden="true"></i></button>
											</div>}
										</div>
									</div>
									<h5 dangerouslySetInnerHTML={innerFunc(this.getContent(post.content))} style={{whiteSpace:'break-spaces', wordBreak: 'break-all', fontSize: '13px', marginTop: '15px'}} />
									{(this.props.loggedin && !this.props.is_admin) && <div style={{textAlign:"center",margin:"30px"}}>
										------------------------------------
									</div>}
									{(this.props.loggedin && !this.props.is_admin) && <div className={`comment-input`}>
										<input className={` message `} id="comment_text" placeholder="Write your feedback..." value={text} onChange={e => this.setState({text: e.target.value})}    />
										<button onClick={e => this.leaveComment()} id={post.id}><i className="zmdi zmdi-mail-send"></i></button>
									</div>}
									<div style={{marginTop: '20px', width:'100%'}}>
										{post.comments.map((item, index) => <div className="comment_div" style={{marginBottom:"10px"}} key={index}>
											<div className="show_comment" style={{display: 'flex'}}>
												<img src={item.user.photo} style={{width:"40px", height: '40px', borderRadius: '50%', marginRight: '10px'}} alt=""/>
												<div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
													<div style={{display: 'flex', alignItems: 'center'}}>
														<label style={{margin: 0}}>{item.user.username}</label>
														<label style={{margin: 0, fontSize: '10px', marginLeft: '5px'}}> {moment(item.createdAt).format('lll')} </label>
													</div>
													<div style={{textAlign:"left", fontSize: '13px'}} dangerouslySetInnerHTML={innerFunc(this.getContent(item.text))} />
													<div style={{marginTop:"10px"}}> 
														<div className="like_dislike_div v-c">
															<div className="like_div" onClick={e => this.doReaction(e, item.id, 1, 3, post.id)}>
																<button id="green" className={`like-btn ${this.checkReaction(item, 1) ? 'activate' : ''}`} ><i className="fa fa-thumbs-up fa-lg" aria-hidden="true"></i></button>
																<label> {item.likes.length} </label>
															</div>
															<div className="dislike_div" onClick={e => this.doReaction(e, item.id, 2, 3, post.id)}>
																<button id="red" className={`dislike-btn ${this.checkReaction(item, 2) ? 'activate' : ''}`} ><i className="fa fa-thumbs-down fa-lg" aria-hidden="true"></i></button>
																<label>{item.dislikes.length}</label>   
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>)}
									</div>
								</div>    
							</div>
            </Col>
          </Row>
        </Container>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
	return {
    posts : state.post.posts,
		me:state.auth.me,
		loggedin: state.auth.loggedin,
		is_admin: state.auth.is_admin
	}
}

export default connect(mapStateToProps, { getPosts, doReaction, leaveComment })(withSnackbar(PostDetail));

