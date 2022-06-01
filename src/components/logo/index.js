import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import logoimg from '../../resources/images/logo.png';
import './logo.scss';

class Logo extends Component {
	state = {
	}

  render() {
    return (
      <NavLink to="/" className={`logo-link ${this.props.className || ''}`}>
        <img src={this.props.logo || logoimg} alt="logo" />
        <div>
          <span>Club</span>
          <span>Afib</span>
        </div>
      </NavLink>
    );
  }
}

const mapStateToProps = (state) => {
	return {
    logo: state.media.logo
	}
}

export default connect(mapStateToProps, {})(Logo);
