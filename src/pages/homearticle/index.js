import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import { getArticles, doReaction } from '../../redux/actions';
import './homearticle.scss';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import { Helmet } from 'react-helmet';

function innerFunc(item) {
	return {__html: item}
}

class Articles extends Component {
	state = {
		articles: this.props.articles,
		search_string: ''
	}
	
	componentDidMount() {
		this.props.getArticles();
	}

	static getDerivedStateFromProps(props, state) {
		return {
			articles: props.articles
		}
	}

	navigate = (item) => {
		let titleSplit = item.title.replace(/[^a-zA-Z0-9 ]/g, '');
		titleSplit = titleSplit.replace(/\s+$/, '');		
		titleSplit = encodeURI(titleSplit);
		titleSplit = titleSplit.toLowerCase().replace(/%20/g, '-');
		let param = titleSplit + "-" + item.id;
		this.props.history.push(`/article/${param}`);
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

  render() {
    const { articles, search_string } =  this.state;
    let data = articles.filter(item => item.title.toLowerCase().indexOf(search_string.toLowerCase()) > -1 || item.description.toLowerCase().indexOf(search_string.toLowerCase()) > -1);
    if (this.props.location.search.length > 0) {
      let category = this.props.location.search.split("=")[1];
      data = data.filter(item => item.category === parseInt(category, 10));
    }
    return (
      <div className="article_home">
		<Helmet 
			title="Article | Club Afib"
			meta={[
				{ name: 'description', content: 'Learn all about Atrial Fibrillation, Finally Manage it, and Get the Support you Need by Joining our Community of Club Members and Afib Experts' },
				{ name: 'keywords', content: 'club, afib, article' }
			]}
			link={[{rel: 'canonical', href: 'https://clubafib.com/articles'}]}
        />
        <Container>
          <div className="justify-content-center article-container">
						<div className="search-box v-c shadow-box">
							<i className="zmdi zmdi-search"></i>
							<input className="search-input" placeholder="Search..." value={search_string} onChange={e => this.setState({ search_string: e.target.value })} />
						</div>
            {(data.length > 0) && data.map((item, index) => 
							<div className="post_view shadow-box" key={index}>
								<div className="thumbnail v-c h-c">
									<img id="imagePreview" src={item.banner} alt="User profile" onClick={e => this.navigate(item)}/>
								</div>
								<Row className="justify-content-center" >
									<Col md="12" style={{marginBottom: '20px'}}>
										<div className="v-c" style={{justifyContent: 'space-between'}}>
											<div className="v-c">
												<label style={{margin: 0, fontSize: '10px'}}> {moment(item.createdAt).format('lll')} </label>
											</div>
											{/* <div className="like_dislike_div v-c">
												<div className="like_div" onClick={e => this.doReaction(e, item.id, 1)}>
													<button id="green" className={`like-btn ${this.checkReaction(item, 1) ? 'activate' : ''}`} ><i className="fa fa-thumbs-up fa-lg" aria-hidden="true"></i></button>
													<label> {item.likes.length} </label>
												</div>
												<div className="dislike_div" onClick={e => this.doReaction(e, item.id, 2)}>
													<button id="red" className={`dislike-btn ${this.checkReaction(item, 2) ? 'activate' : ''}`} ><i className="fa fa-thumbs-down fa-lg" aria-hidden="true"></i></button>
													<label>{item.dislikes.length}</label>   
												</div>
											</div> */}
										</div>
									</Col>
									<Col md="12">
										<h2 className="item-title" onClick={e => this.navigate(item)}>{item.title}</h2>
									</Col>
									<Col md="12">
										<div className="item-content" dangerouslySetInnerHTML={innerFunc(item.description)}/>
									</Col>
								</Row>    
							</div>
            )}
          </div>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
	return {
		articles:state.article.articles,
		me: state.auth.me,
		loggedin: state.auth.loggedin,
		is_admin: state.auth.is_admin
	}
}

export default connect(mapStateToProps, { getArticles, doReaction })(withSnackbar(Articles));
