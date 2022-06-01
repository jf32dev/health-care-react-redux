import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import { doReaction, getArticles } from '../../../redux/actions';
import './article_detail.scss';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import Modal from '../../../components/Modal';
import { Helmet } from 'react-helmet';
function innerFunc(item) {
	return {__html: item}
}

class ArticleDetail extends Component {
	state = {
		modal_show:false,
		video_url:"",
		article:{
			id: 0,
      likes:[],
      dislikes:[],
		},
		me:[],
	}

	componentDidMount() {
		let params = this.props.match.params.id.split("-");
		let index = this.props.articles.findIndex(temp => temp.id === parseInt(params[params.length - 1], 10));
		if (index === -1) {
			this.props.getArticles();
		}
	}

	static getDerivedStateFromProps(props, state) {
		let params = props.match.params.id.split("-");
		let index = props.articles.findIndex(temp => temp.id === parseInt(params[params.length - 1], 10));
		return {
			article: index === -1 ? state.article : props.articles[index]
		};
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
			type: 1,
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
	closeModal = (e) => {
		this.setState({
			modal_show:false
		})	
	}   

	contentClick = (event) => {
		if(event.target.tagName.toLowerCase() === 'a' || event.target.parentElement.tagName.toLowerCase() === 'a') {
			let element = event.target.tagName.toLowerCase() === 'a' ? event.target : event.target.parentElement;
			let href = element.getAttribute('href');
			event.preventDefault();
			if (href.indexOf('/video?src=') > -1) {
				// if(href.length > 0 && href.split('=').length === 2){
				// 	let video_url = process.env.REACT_APP_S3_BUCKET_URL+"/"+href.split('=')[1];
				// 	this.setState({
				// 		video_url:video_url,
				// 		modal_show:true
				// 	})
				// }
				const win = window.open(href, "_blank", "width=900,height=500");
				win.focus();
			} else {
				const win = window.open(href, '_blank');
				win.focus();
			}
		}
	}
    
  render() {
	const { article,modal_show,video_url } =  this.state;
	const el = document.createElement("div");
	el.innerHTML = article.description
	const meta_desc = el.getElementsByTagName('p')[0].innerText.slice(0,100) + '...'

    return (
      <div className="article_detail_home">
		<Helmet 
			title={`${article.title} | Club Afib`}
			meta={[
				{ name: 'description', content:  meta_desc},
				{ name: 'keywords', content: 'club, afib' }
			]}
			link={[{rel: 'canonical', href: `https://clubafib.com/article/${this.props.match.params.id}`}]}
		/>
        {article.id > 0 && <Container>
          <Row className="justify-content-center">
            <Col md="8">
							<div className="avatar-preview v-r">
								<img id="imagePreview" src={article.banner} alt="" />
								<p style={{fontSize: '14px', marginTop: '10px'}}>{article.caption}</p>
							</div>
							<Row className="justify-content-center">
								<Col md="12" style={{marginBottom: '20px'}}>
									<div className="v-c" style={{justifyContent: 'space-between'}}>
										<div className="v-c">
											<label style={{margin: 0, fontSize: '12px'}}> {moment(article.createdAt).format('lll')} </label>
										</div>
										{/* <div className="like_dislike_div v-c">
											<div className="like_div" onClick={e => this.doReaction(e, article.id, 1)}>
												<button id="green" className={`like-btn ${this.checkReaction(article, 1) ? 'activate' : ''}`} ><i className="fa fa-thumbs-up fa-lg" aria-hidden="true"></i></button>
												<label> {article.likes.length} </label>
											</div>
											<div className="dislike_div" onClick={e => this.doReaction(e, article.id, 2)}>
												<button id="red" className={`dislike-btn ${this.checkReaction(article, 2) ? 'activate' : ''}`} ><i className="fa fa-thumbs-down fa-lg" aria-hidden="true"></i></button>
												<label>{article.dislikes.length}</label>   
											</div>
										</div> */}
									</div>
								</Col>
								<Col md="12">
									<h2 className="item-title">{article.title}</h2>
								</Col>
								<Col md="12">
									<div dangerouslySetInnerHTML={innerFunc(article.description)} onClick={e => this.contentClick(e)}/>
								</Col>
							</Row>    
            </Col>
          </Row>
		  <Modal
            id="video-modal"
            show={modal_show}
            handleClose={this.closeModal}
            video={video_url}
            videoTag="video" />
        </Container>}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
	return {
    articles:state.article.articles,
		me:state.auth.me,
		loggedin: state.auth.loggedin,
		is_admin: state.auth.is_admin
	}
}

export default connect(mapStateToProps, { getArticles, doReaction })(withSnackbar(ArticleDetail));

