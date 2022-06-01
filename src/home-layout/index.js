import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './header';
import Footer from './footer';
import Sidebar from './sidebar';
import './home-layout.scss';

class HomeLayout extends Component {
	state = {
	}

  render() {
    return (
      <div className="home-layout">
        <Header />
        <Sidebar />
        <div className="home-content">
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
	return {
	}
}

export default connect(mapStateToProps, {})(HomeLayout);
