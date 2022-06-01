import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Nav, Button } from 'reactstrap';
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import { authLogout, getActivePayment } from '../redux/actions';
import logo from '../resources/images/logo.png'
import brand from '../resources/images/logo_hurt.png'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class Header extends Component {

	componentDidMount() {
		if (!this.props.is_admin) {
			this.props.getActivePayment();
		}
	}

	logOut = () => {
		this.props.authLogout();
	}

  render() {
    return (
      <React.Fragment>
        <AppSidebarToggler className='d-lg-none' display='md' mobile />
          <AppNavbarBrand href="/"
            full={{ src: this.props.logo || logo, alt: 'App Logo', width: 45, height: 45, }}
            minimized={{ src: brand, width: 50, height: 40, alt: 'Brand' }}
          />
        
        <AppSidebarToggler className='d-md-down-none' display='lg' />

        <Nav className='d-md-down-none' navbar />
        <div style={{width:"80%"}}>
          <Button className="btn btn-primary btn-logout" onClick={e => this.logOut()}><i className="fa fa-sign-out" aria-hidden="true"></i> Log out</Button>
        </div>
      </React.Fragment>
    );
  }
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

const mapStateToProps = (state) => {
  return {
		me: state.auth.me,
    is_admin: state.auth.is_admin,
    logo: state.media.logo
  }
}

export default connect(mapStateToProps, { authLogout, getActivePayment })(Header);
