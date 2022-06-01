import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row,Input, InputGroup, InputGroupAddon, InputGroupText,Button} from 'reactstrap';
import { getMyArticles, updateArticle, getCategories } from '../../../redux/actions';
import { uploadImage as uploadImageApi  } from '../../../api';
import { withSnackbar } from 'notistack';
import { withRouter } from 'react-router-dom';
import RichTextEditor from 'react-rte';
import './article_detail.scss';

class ArticleDetail extends Component {
	state = {
		article: {
			id: 0,
			banner: '',
			caption: '',
			category: 1,
			title: '',
			show_order: 0,
			description: RichTextEditor.createEmptyValue()
		},
		video_url: '',
		loading_status:false
	}
	
	componentDidMount() {
		this.props.getCategories();
		if (this.props.match.params.id && this.props.match.params.id !== 'create') {
			const id = parseInt(this.props.match.params.id, 10);
			let index = this.props.myarticles.findIndex(temp => temp.id === id);
			if (index !== -1) {
				let data = this.props.myarticles[index];
				this.setState({
					article: {
						...data,
						description: RichTextEditor.createEmptyValue().setContentFromString(data.description, 'html')
					}
				})
			} else {
				this.props.getMyArticles();
			}
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.loading && !this.props.loading) {
			const id = parseInt(this.props.match.params.id, 10);
			let index = this.props.myarticles.findIndex(temp => temp.id === id);
			if (index !== -1) {
				let data = this.props.myarticles[index];
				this.setState({
					article: {
						...data,
						description: RichTextEditor.createEmptyValue().setContentFromString(data.description, 'html')
					}
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
			article: {...this.state.article, banner: response.data.url},
			loading_status:false
		})
	}

	pickFileForVideo = async (e) => {
		e.preventDefault();
		if (!e.target.files[0]) return;
		this.setState({
			loading_status:true
		})
		const response = await uploadImageApi(e.target.files[0]);
		if (response && response.data) {
			let aws_url = response.data.url.split("/");
			const videoLink = aws_url[aws_url.length - 1];
			this.setState({
				video_url: `https://clubafib.com/video?src=${videoLink}`
			})
		}
		this.setState({
			loading_status:false
		})
	}
	
	update_article = async () => {
		const { id, banner, caption, title, description, category, show_order } = this.state.article;
		if (title.length === 0 || description.toString('markdown').length === 0 || !show_order) {
			this.props.enqueueSnackbar("Please input all fields!", { variant: 'error' })
			return;
		}
		if (banner.length === 0) {
			this.props.enqueueSnackbar("Please upload an image!", { variant: 'error' })
			return;
		}

		this.props.updateArticle(id, { banner, title, caption, category, description: description.toString('html'), show_order })
		this.props.enqueueSnackbar("Success!", { variant: 'success' })
		this.props.history.replace("/admin/article");
	}

	inputChange = (e) =>{
		this.setState({
			article: {...this.state.article, [e.target.name]: e.target.value}
		})
	}

	onChangeEditor = (e) => {
		this.setState({
			article: {
				...this.state.article,
				description: e
			}
		})
	}

	selectChange = (e) => {
		this.setState({
			article: {
				...this.state.article,
				category: e.target.value
			}
		})
	}

	copyLink = () => {
		var textField = document.createElement('textarea')
    textField.innerText = this.state.video_url
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
	}

	render() {
		const { article ,loading_status, video_url } = this.state;
		const { banner, caption, title, description, category, show_order } = article;
		return (
			<div className="article_detail_app">
				
				<div className={`loading-gif ${loading_status ? "loading_show" : ""}`}></div>
				<Container>
					<Row className="justify-content-center">
						<Col md="8">
							<div className="avatar-upload">
								{banner.length > 0 && <div className="avatar-preview">
									<img id="imagePreview" src={banner} alt="" />
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
											<InputGroupText> Caption: </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" value={caption} id="caption" name="caption" onChange={this.inputChange} />
									</InputGroup>
								</Col>
								<Col md="12">
									<InputGroup className="mb-3">
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> Category: </InputGroupText>
										</InputGroupAddon>
										<Input type="select" name="select" value={category} id="exampleSelect" onChange={e => this.selectChange(e)}>
											{this.props.categories.map((item, index) => <option key={index} value={item.id}> {item.title} </option>)}
										</Input>
									</InputGroup>
								</Col>
								<Col md="12">
									<InputGroup className="mb-3">
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> Title: </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" value={title} id="title" name="title" onChange={this.inputChange} />
									</InputGroup>
								</Col>
								<Col md="12">
									<InputGroup className="mb-3">
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> Order: </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" value={show_order} type="number" id="show_order" name="show_order" onChange={this.inputChange} />
									</InputGroup>
								</Col>
								<Col md="12" style={{margin: '-13px 0 10px 0', color: '#d4391d'}}>
									Please leave 0 if you want to place this article at last.
								</Col>
								<Col md="12" className="v-c mb-3">
									<InputGroup>
										<InputGroupAddon addonType='prepend'>
											<InputGroupText> Video: </InputGroupText>
										</InputGroupAddon>
										<Input className="input100" value={video_url} id="video_url" name="video_url" onChange={() => {}} ref={c => this.videoRef = c}/>
										<InputGroupAddon addonType='append'>
										<InputGroupText><label htmlFor="video_input" style={{marginBottom: 0, width: '100%', textAlign: 'center'}}>Upload</label></InputGroupText>
										</InputGroupAddon>
									</InputGroup>
									<input accept="video/*" style={{display: 'none'}} id="video_input" type="file" onChange={e => this.pickFileForVideo(e)}/>
									{video_url.length > 0 && <Button color="primary" style={{marginLeft: '10px'}} onClick={this.copyLink}>Copy</Button>}
								</Col>
								<Col md="12" style={{margin: '-13px 0 10px 0', color: '#d4391d'}}>
									You can upload a video and copy url to put in article.
								</Col>
								<Col md="12">
									<RichTextEditor
										value={description || RichTextEditor.createEmptyValue()}
										onChange={this.onChangeEditor}
									/>
								</Col>
								<Button className="btn-success" onClick={this.update_article} style={{marginTop: '30px'}}>Save</Button>
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
		myarticles:state.article.my_articles,
		loading: state.article.loading,
		categories:state.category.categories
	}
}

export default withRouter(connect(mapStateToProps, { getMyArticles, updateArticle, getCategories })(withSnackbar(ArticleDetail)));