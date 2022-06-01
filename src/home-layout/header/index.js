import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Container } from 'reactstrap';
import Logo from '../../components/logo';
import './header.scss';
import { authLogout, toggleSidebar } from '../../redux/actions';

class Header extends Component {
	state = {
    show_menu: false
  }
  
  signout = () => {
    this.props.authLogout()
  }

  toggleBar = () => {
    this.props.toggleSidebar(true)
  }

  render() {
    const { show_menu } = this.state;
    return (
      <div className="home-header">
        <Container className="v-c">
          <div className="logo-part v-c show-web-flex">
            <Logo />
            {!show_menu ? <div className="v-c menu-btn" onClick={e => this.setState({show_menu: true})}>
              <i className="fa fa-bars" aria-hidden="true" />
              <span>Menu</span>
            </div> : <div className="v-c header-menus">
              <i className="fa fa-times" aria-hidden="true" onClick={e => this.setState({show_menu: false})} />
              <NavLink to="/articles">Learn about Afib</NavLink>
              <NavLink to="/admin/health">Track Afib</NavLink>
              <NavLink to="/post">Post with other club Members</NavLink>
              <NavLink to="/admin/chat">Chat with Afib Experts</NavLink>
            </div>}
          </div>
          <div className="btn-area v-c show-web-flex">
            {this.props.loggedin &&<NavLink to="/admin" className="auth-btn v-c h-c login">Dashboard</NavLink>}
            {this.props.loggedin && <div className="auth-btn v-c h-c signup" onClick={e => this.signout()}>Sign out</div>}
            {!this.props.loggedin && <NavLink to="/login" className="auth-btn v-c h-c login">Login</NavLink>}
            {!this.props.loggedin && <NavLink to="/register" className="auth-btn v-c h-c signup">Sign Up</NavLink>}
          </div>
          <i className="fa fa-bars show-mobile mobile-menu-btn" aria-hidden="true" onClick={e => this.toggleBar()}/>
          <Logo className="show-mobile-flex"/>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
	return {
    loggedin: state.auth.loggedin,
	}
}

export default connect(mapStateToProps, { authLogout, toggleSidebar })(Header);
