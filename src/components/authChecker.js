import jwtDecode from 'jwt-decode';
import React from 'react';
import { connect } from 'react-redux';


import { updateToken as updateTokenAPI, adminUpdateToken as adminUpdateTokenApi } from '../api';
import { updateToken, tokenExpired } from '../redux/actions';


let staticProps = {}; // for using on static functions

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

const scheduleRefreshToken = async () => {
  try {
    let auth = staticProps && staticProps.auth;
    // calculate token life time
    if (auth && auth.token) {
      const decoded = jwtDecode(auth.token);
      const tokenLifeTime = decoded.exp * 1000 - Date.now();

      await sleep(tokenLifeTime - 10 * 1000);

      auth = staticProps && staticProps.auth;
      if (auth.token) {
        refreshToken();
        return;
      }
    }
    if (staticProps) staticProps.tokenExpired();
  } catch (err) {
    if (staticProps) staticProps.tokenExpired();
    console.log('error on scheduleRefreshToken', err);
  }
}

const refreshToken = async () => {
  try {
    const auth = staticProps && staticProps.auth;
    if (auth && auth.refresh_token) {
			let result = {};
			if (auth.is_admin) {
				result = await adminUpdateTokenApi(auth.refresh_token)
			} else {
				result = await updateTokenAPI(auth.refresh_token)
			}
      if (result && result.data) {
        staticProps.updateToken(result.data);
        scheduleRefreshToken();

        return;
      }
    }

    if (staticProps) staticProps.tokenExpired();
  } catch (err) {
    if (staticProps) staticProps.tokenExpired();
    console.log('error on update token:', err)
  }
}

class AuthChecker extends React.Component {
  state = {
    isLoggedin: false,
  }

  static getDerivedStateFromProps(props, state) {
    staticProps = props
    if (!state.isLoggedin && props.isLoggedin && props.auth.is_admin) {
      scheduleRefreshToken();
    }

    return {
      isLoggedin: props.isLoggedin,
    }
  }

  render() {
    return (
      <div className='d-none'></div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedin: state.auth.loggedin,
    auth: state.auth,
  }
}

export default connect(mapStateToProps, { updateToken, tokenExpired })(AuthChecker);