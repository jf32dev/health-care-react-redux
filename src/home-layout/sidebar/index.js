import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import logoimg from '../../resources/images/logo.png';
import './sidebar.scss';
import { authLogout, toggleSidebar } from '../../redux/actions';

class Sidebar extends Component {
	state = {
    isOpen: false,
    isPrevOpen: false
  }

  static getDerivedStateFromProps(props, state) {
    return {
      isOpen: props.isOpen,
      isPrevOpen: state.isOpen,
    }
  }

  closeSidebar = () => {
    this.props.toggleSidebar(false);
  }
  
  signout = () => {
    this.props.authLogout();
    this.closeSidebar()
  }

  render() {
    const { isOpen, isPrevOpen } = this.state;
    return (
      <div className={`home-sidebar show-mobile-flex v-r ${isOpen ? 'active' : isPrevOpen ? 'inactive' : ''}`}>
        <div className="sidebar-wrapper">
          <div className="sidebar-content v-r">
            <div className="v-c">
              <div className="avatar-area v-c h-c">
                {this.props.loggedin ? <img src={this.props.me.photo} alt=""/> : <img src={logoimg} alt="logo" className="logo-inside"/>}
              </div>
              <p className="name-area">{this.props.loggedin ? `${this.props.me.first_name} ${this.props.me.last_name}` :'Guest'}</p>
            </div>
            <div className="menu-area v-r">
              {this.props.loggedin && <NavLink to="/admin" className="auth-btn v-c h-c signup" onClick={e => this.closeSidebar()}>Dashboard</NavLink>}
              {!this.props.loggedin && <NavLink to="/login" className="auth-btn v-c h-c login" onClick={e => this.closeSidebar()}>Login</NavLink>}
              {!this.props.loggedin && <NavLink to="/register" className="auth-btn v-c h-c signup" onClick={e => this.closeSidebar()}>Sign Up</NavLink>}
              <NavLink to="/articles" className="menu-item" onClick={e => this.closeSidebar()}>Learn about Afib</NavLink>
              <NavLink to="/admin/health" className="menu-item" onClick={e => this.closeSidebar()}>Track Afib</NavLink>
              <NavLink to="/post" className="menu-item" onClick={e => this.closeSidebar()}>Post with other club Members</NavLink>
              <NavLink to="/admin/chat" className="menu-item" onClick={e => this.closeSidebar()}>Chat with Afib Experts</NavLink>
              {this.props.loggedin && <p className="menu-item log-out" onClick={e => this.signout()}>Log Out</p>}
            </div>
          </div>
          <div className="sidebar-block" onClick={e => this.closeSidebar()}></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
	return {
    loggedin: state.auth.loggedin,
    isOpen: state.sidebar.isOpen,
    me: state.auth.me
	}
}

export default connect(mapStateToProps, { authLogout, toggleSidebar })(Sidebar);
