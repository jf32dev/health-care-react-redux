import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Container } from 'reactstrap';
import logoimg from '../../resources/images/logo.png';
import './footer.scss';

class Footer extends Component {
  render() {
    return (
      <div className="home-footer v-r">
        <Container className="v-r">
          <NavLink to="/" ><img src={this.props.logo || logoimg} alt="logo" /></NavLink>
          <div className="bottom-texts">
            <p>ClubAfib &copy; {new Date().getFullYear()}. All rights reserved.</p>
            <div className="link-area">
              <NavLink to="/contact">Contact</NavLink>
              <NavLink to="/about">About us</NavLink>
              <NavLink to="/faqs">FAQ's</NavLink>
              <NavLink to="/privacy-policy">Privacy Policy</NavLink>
              <NavLink to="/terms-and-conditions">Terms and Conditions</NavLink>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
	return {
    logo: state.media.logo
	}
}

export default connect(mapStateToProps, {})(Footer);
