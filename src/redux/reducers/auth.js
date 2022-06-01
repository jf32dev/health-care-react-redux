import jwtDecode from 'jwt-decode';
import { REHYDRATE } from 'redux-persist';

import {
  AUTH_LOGIN,
  AUTH_LOGIN_SUCCESS,
	AUTH_LOGIN_FAILED,

  AUTH_SIGNUP,
  AUTH_SIGNUP_SUCCESS,
  AUTH_SIGNUP_FAILED,

  AUTH_LOGOUT,
  AUTH_LOGOUT_SUCCESS,
  
  AUTH_UPDATE_TOKEN,
  AUTH_EXPIRED,
	AUTH_ACTIVATE, 
	AUTH_GOOGLE_LOGIN, 
	AUTH_FACEBOOK_LOGIN, 
	
	AUTH_ADMIN_LOGIN, 
	AUTH_ADMIN_LOGIN_SUCCESS, 
	AUTH_ADMIN_LOGIN_FAILED, AUTH_UPDATE_PROFILE
} from '../type';


const INITIAL = {
  loading: false,
  loggedin: false,
  token: null,
  refresh_token: null,
  me: null,
	messages: null,
	is_admin: false,
	
	remember_me: false,
	email: '',
	password: ''
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (!action.payload) return state;
      
      const { auth } = action.payload;
      let { loggedin, token, refresh_token, me } = auth;
      if (loggedin && token) {
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
          loggedin = false;
          token = null;
          refresh_token = null;
          me = null;
        }
      }
      return {
        ...auth,
        loggedin,
        token,
        refresh_token,
				me,
				loading: false
      };
		}
		
    case AUTH_LOGIN: {
			const { email, password, remember_me } = action.data.login_info;
			return { ...state, messages: null, remember_me, email: remember_me ? email : '', password: remember_me ? password : '', is_admin: false }
		}

		case AUTH_ADMIN_LOGIN: {
			return { ...state, loading: true, messages: null, is_admin: false }
		}
    case AUTH_LOGOUT:
    case AUTH_SIGNUP:
		case AUTH_FACEBOOK_LOGIN:
		case AUTH_GOOGLE_LOGIN:
		case AUTH_ACTIVATE: {
      return { ...state, loading: true, messages: null }
    }
    
    case AUTH_LOGIN_SUCCESS:
    case AUTH_SIGNUP_SUCCESS: {
      const { user, token, refresh_token } = action.data;
      const userActivated = !!token

      return { ...state, loading: false, loggedin: userActivated, token, refresh_token, me: user, messages: null, is_admin: false };
		}
		
		case AUTH_ADMIN_LOGIN_SUCCESS: {
			const { user, token, refresh_token } = action.data;
      const userActivated = !!token

      return { ...state, loading: false, loggedin: userActivated, token, refresh_token, me: user, messages: null, is_admin: true };
		}

    case AUTH_UPDATE_TOKEN: {
      const { user, token, refresh_token } = action.data;
      return { ...state, loggedin: true, token, refresh_token, me: user };
    }
    
    case AUTH_LOGOUT_SUCCESS:
    case AUTH_EXPIRED: {
      return { ...state, loading: false, loggedin: false, token: null, refresh_token: null, me: null, messages: null };
    }

    case AUTH_LOGIN_FAILED:
		case AUTH_SIGNUP_FAILED: 
		case AUTH_ADMIN_LOGIN_FAILED: {
      const { errors } = action;
      let messages = [];
      for (var i=0; i<errors.length; i++) {
        messages.push(errors[i].message)
      }
      if (messages.length === 0) {
        messages.push('Unkown error')
      }
      
      return { ...state, loading: false, messages: messages }
		}
		
		case AUTH_UPDATE_PROFILE: {
			return {
				...state,
				me: {
					...state.me, 
					...action.data
				}
			}
		}

    default:
      return state;
  }
}