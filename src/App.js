import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch, Redirect } from 'react-router-dom';

import AuthChecker from './components/authChecker';
import HomeLayout from './home-layout';
import Layout from './layout';
import Login from './pages/login';
import AdminLogin from './pages/adminlogin';
import Register from './pages/register';
import Forgetpassword from './pages/forgetpassword';
import Resetpassword from './pages/resetpassword';
import Activate from './pages/activate';
import Video from './pages/video';

import AboutUS from './pages/about';
import Terms from './pages/terms';
import Privacy from './pages/privacy';

import Home from './pages/home';
import About from './pages/about';
import Faqs from './pages/faqs';
import Contact from './pages/contact';
import Articles from './pages/homearticle';
import HomeArticleDetail from './pages/homearticle/detail';
import HomePost from './pages/homepost';
import HomePostDetail from './pages/homepost/detail';
import HomeSubscribe from './pages/subscribe/home-subscribe';

import { history } from './utils/history';
// import { HomeRoutes } from './routes';
import ScrollRestoration from 'react-scroll-restoration'
import './App.scss';
import { getLogo } from './redux/actions';
import {Helmet} from "react-helmet";

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

class App extends React.Component {
  componentDidMount =  () =>{
    this.props.getLogo();
    let pathname = window.location.pathname;
    if(pathname==="/aboutus" || pathname==="/terms" || pathname==="/privacy"){
      document.getElementsByClassName("showdow-box")[0].style.marginTop = "10px";
      document.getElementsByClassName("showdow-box")[0].style.marginBottom = "10px";
    
    }
  }
  render() {
    return (
      <Router history={history}>
          <Helmet> 
            <title>ClubAfib</title>
            <meta name="description" content="ClubAfib" /> 
          </Helmet>
          {/* <ScrollToTop /> */}
          <ScrollRestoration />
          <React.Suspense fallback={loading()}>
            <AuthChecker />
            <Switch>
              
              <Route exact path="/" name="Home" render={props => <HomeLayout> <Home {...props}/> </HomeLayout>} />
              <Route path="/about" name="About" render={props => <HomeLayout> <About {...props}/> </HomeLayout>} />
              <Route path="/contact" name="Contact" render={props => <HomeLayout> <Contact {...props}/> </HomeLayout>} />
              <Route path="/faqs" name="FAQ's" render={props => <HomeLayout> <Faqs {...props}/> </HomeLayout>} />
              <Route path="/privacy-policy" name="Privacy" render={props => <HomeLayout> <Privacy {...props}/> </HomeLayout>} />
              <Route path="/terms-and-conditions" name="Terms" render={props => <HomeLayout> <Terms {...props}/> </HomeLayout>} />
              <Route path="/articles" name="Articles" render={props => <HomeLayout> <Articles {...props}/> </HomeLayout>} />
              <Route path="/article/:id" name="Article Detail" render={props => <HomeLayout> <HomeArticleDetail {...props}/> </HomeLayout>} />
              <Route path="/posts" name="Posts" render={props => <HomeLayout> <HomePost {...props}/> </HomeLayout>} />
              <Route path="/post/:id" name="Post Detail" render={props => <HomeLayout> <HomePostDetail {...props}/> </HomeLayout>} />
              <Route path="/subscribe" name="Subscribe" render={props => <HomeLayout> <HomeSubscribe {...props}/> </HomeLayout>} />


              <Route path="/login" name="Login Page" render={props => <Login {...props}/>} />
							<Route path="/admin-login" name="Admin Login Page" render={props => <AdminLogin {...props}/>} />
              <Route path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route path="/forgotpassword" name="Forget Password" render={props => <Forgetpassword {...props}/>} />
              <Route path="/resetpassword" name="Reset Password" render={props => <Resetpassword {...props}/>} />
              <Route path="/activate" name="Active Password" render={props => <Activate {...props}/>} />
              <Route path="/admin" name="Home" render={props => <Layout {...props}/>} />
              <Route path="/video" name="Video" render={props => <Video {...props}/>} />
              
              <Route path="/aboutus" name="About" render={props => <AboutUS {...props}/>} />
              <Route path="/terms" name="Terms" render={props => <Terms {...props}/>} />
              <Route path="/privacy" name="Privacy" render={props => <Privacy {...props}/>} />

              <Redirect to="/" />
            </Switch>
          </React.Suspense>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedin: state.auth.loggedin,
    me: state.auth.me,
  }
}

export default connect(mapStateToProps, { getLogo })(App);