import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import apple from '../../resources/images/appstore.png'
import './home.scss';
import { NavLink } from 'react-router-dom';
import image2 from '../../resources/images/2.png';
import image3 from '../../resources/images/3.png';
import image4 from '../../resources/images/4.png';
import start from '../../resources/images/home-start.png';
import VideoPlayer from '../../components/videoplayer';
import ItemsCarousel from 'react-items-carousel';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import { Videos } from '../../constant';
import logowhite from '../../resources/images/logo_white.png';
import { getArticles, getCategories } from '../../redux/actions';
import {Helmet} from "react-helmet";

class Home extends Component {
	state = {
    activeVideoIndex:0,
  }

  componentDidMount() {
    this.props.getArticles();
    this.props.getCategories();
  }
  
  filterArticles = (category) => {
    return this.props.articles.filter(item => item.category === category);
  }

  generateURL = (item) => {
		let titleSplit = item.title.replace(/[^a-zA-Z0-9 ]/g, '');
    titleSplit = titleSplit.replace(/\s+$/, '');
    titleSplit = encodeURI(titleSplit);
    titleSplit = titleSplit.toLowerCase().replace(/%20/g, '-');
		let param = titleSplit + "-" + item.id;
		return `/article/${param}`;
	}

  render() {
    const { activeVideoIndex } = this.state;
    return (
      <div className="home-page">
        <Helmet 
          title="Club Afib"
          meta={[
            { name: 'description', content: 'Learn all about Atrial Fibrillation, Finally Manage it, and Get the Support you Need by Joining our Community of Club Members and Afib Experts' },
            { name: 'keywords', content: 'club, afib' }
          ]}
          link={[{rel: 'canonical', href: 'https://clubafib.com'}]}
        />
        
        <div className="home-start">
          <Container>
            <div className="writing-area">
              <div className="start-writing v-r">
                <h1>Welcome to <span>Club</span><span>Afib</span></h1>
                <p>Learn all about Atrial Fibrillation, Finally<br />Manage it, and Get the Support you Need<br />by Joining our Community of Club<br />Members and Afib Experts</p>
                <NavLink to={this.props.loggedin ? '/admin' : '/register'} className="v-c h-c">{this.props.loggedin ? 'Dashboard' : 'Sign Up'}</NavLink>
              </div>
            </div>
            <img src={start} alt="start" />
          </Container>
        </div>
        
        <Container className="v-r home-container">
          <div className="tile-parts home-section v-r">
            <div className="split-row">
              <div className="semi-part" >
                <img src={image2} alt="2" style={{width:"100%",  margin:"auto", borderRadius:"20px"}}></img>
              </div>
              <div className="semi-part writing v-r">
                <a href="https://apps.apple.com/us/app/club-afib/id1531969874"  target="_blank" rel="noopener noreferrer">
                  <h3 className="mt-0 mb-12" > Track your AFib </h3>
                </a>
                <p className="m-0">Manage your AFib using ECG and heart rate data from your Smartwatch</p>
                <div className="v-c h-c img-area">
                  <a href="https://apps.apple.com/us/app/club-afib/id1531969874"  target="_blank" rel="noopener noreferrer"><img src={apple} alt="apple" /></a>
                </div>
              </div>
            </div>
            <div className="split-row reverse">
              <div className="semi-part writing v-r">
                <NavLink to="/post">
                  <h3 className="mt-0 mb-12" > Post with other Club Members </h3>
                </NavLink>
                <p className="m-0">Share what works for you, and hear what others have tried</p>
              </div>
              <div className="semi-part" >
                <img src={image3} alt="2" style={{width:"100%",  margin:"auto", borderRadius:"20px"}}></img>
              </div>
            </div>
            <div className="split-row">
              <div className="semi-part" >
                <img src={image4} alt="2" style={{width:"100%",  margin:"auto", borderRadius:"20px"}}></img>
              </div>
              <div className="semi-part writing v-r">
                <NavLink to="/subscribe">
                  <h3 className="mt-0 mb-12">Talk to the Experts</h3>
                </NavLink>
                <p className="m-0">Ask all your questions and finally get satisfactory answers from our AFib experts</p>
              </div>
            </div>
          </div>
        </Container>
        
        <Container className="home-container">
          <div className="home-section videos-area">
            <ItemsCarousel
              classes={{itemsWrapper: 'items-wrapper', itemsInnerWrapper: 'inner-wrapper'}}
              infiniteLoop={true}
              numberOfCards={1}
              slidesToScroll={1}
              alwaysShowChevrons={true}
              showSlither={false}
              firstAndLastGutter={false}
              activePosition={'center'}
              leftChevron={<div className="carousel-btn left-btn v-c h-c"><KeyboardArrowLeft fontSize="large"/></div>}
              rightChevron={<div className="carousel-btn right-btn v-c h-c"><KeyboardArrowRight fontSize="large" /></div>}
              activeItemIndex={activeVideoIndex}
              requestToChangeActive={value => this.setState({ activeVideoIndex: value })}
            >
              {Videos.map((item, index) => <VideoPlayer info={item} key={index} originIndex={index} activeIndex={activeVideoIndex}/>)}
            </ItemsCarousel>
          </div>
        </Container>
        
        <Container className="v-r">
          <div className="article-parts home-section v-r">
            <h2>Understand your AFib</h2>
            <p>Learn about AFib, how to reduce your<br />symptoms, and avoid its dangers</p>
            <div className="show-web-flex v-r">
              {this.props.categories.map((item, index) => <div className="articles-row" key={index}>
                <NavLink to={`/articles?category=${item.id}`} className="article-item header">
                  <div className={`article-content v-c`} style={{background: item.color}}>
                    <img src={logowhite} className="white-logo" alt="whitelogo" />
                    <p className="header-title">{item.title}</p>
                  </div>
                </NavLink>
                {this.filterArticles(item.id).map((article, articleIndex) => <NavLink to={this.generateURL(article)} className="article-item" key={articleIndex}>
                  <div className="article-content v-r">
                    <img src={article.banner} alt="banner" className="banner" />
                    <div className={`article-title`} style={{background: item.color}}>{article.title}</div>
                  </div>
                </NavLink>)}
              </div>)}
            </div>
            <div className="show-mobile-flex articles-row">
              {this.props.categories.map((item, index) => <NavLink to={`/articles?category=${item.id}`} className="article-item header" key={index}>
                <div className={`article-content v-c`} style={{background: item.color}}>
                  <img src={logowhite} className="white-logo" alt="whitelogo" />
                  <p className="header-title">{item.title}</p>
                </div>
              </NavLink>)}
            </div>
          </div>
        </Container>
        
        <Container className="v-r home-container">
          <div className="download-part v-r">
            <h3>Interested in becoming a <br />Club Member?</h3>
            <p>Download our free app here</p>
            <div className="v-c img-area">
              <a href="https://apps.apple.com/us/app/club-afib/id1531969874"  target="_blank" rel="noopener noreferrer">
                <img src={apple} alt="apple" />
              </a>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
	return {
    loggedin: state.auth.loggedin,
    articles:state.article.articles,
    categories:state.category.categories
	}
}

export default connect(mapStateToProps, { getArticles, getCategories })(Home);
