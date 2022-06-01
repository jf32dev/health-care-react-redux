import jwtDecode from 'jwt-decode';
import {
  AUTH_LOGIN,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILED,

  AUTH_SIGNUP,
  AUTH_SIGNUP_SUCCESS,
  AUTH_SIGNUP_FAILED,

  AUTH_ACTIVATE,

  AUTH_LOGOUT,
  AUTH_LOGOUT_SUCCESS,

  AUTH_UPDATE_TOKEN,
  AUTH_EXPIRED,
	AUTH_SCHEDULE_UPDATE_TOKEN,
	
	AUTH_FACEBOOK_LOGIN,
	AUTH_GOOGLE_LOGIN, AUTH_ADMIN_LOGIN, AUTH_ADMIN_LOGIN_SUCCESS, AUTH_ADMIN_LOGIN_FAILED
} from '../type';
import { takeLatest, put, select, call } from 'redux-saga/effects';

import {
  signup as signupAPI,
  activate as activateAPI,
  logout as logoutAPI,
	updateToken as updateTokenAPI,
	facebookLogin as facebookLoginApi,
	googleLogin as googleLoginApi,

	adminLogin as adminLoginApi,
	adminLogout as adminLogoutApi,
	adminUpdateToken as adminUpdateTokenApi,
} from '../../api';

const getAuth = (state) => state.auth;

function* login(payload){
  const { data } = payload.data
  yield put({ type: AUTH_LOGIN_SUCCESS, data })
}

export function* watchSignin(){
  yield takeLatest(AUTH_LOGIN, login)
}

function* adminLogin(payload){
  try {
    const result = yield adminLoginApi(payload.data)
    if (result && result.data) {
      if (result.data.user) {
        yield put({ type: AUTH_ADMIN_LOGIN_SUCCESS, data: result.data })
        yield scheduleUpdateToken();
      } else {
        yield put({ type: AUTH_ADMIN_LOGIN_FAILED, errors: [] })
      }
    } else {
      if (result && result.errors) {
        yield put({ type: AUTH_ADMIN_LOGIN_FAILED, errors: result.errors })
      } else {
        yield put({ type: AUTH_ADMIN_LOGIN_FAILED, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: AUTH_ADMIN_LOGIN_FAILED, errors: [err] })
  }
}

export function* watchAdminSignin(){
  yield takeLatest(AUTH_ADMIN_LOGIN, adminLogin)
}

function* facebookLogin(payload){
  try {
    const result = yield facebookLoginApi(payload.data)
    if (result && result.data) {
      if (result.data.user) {
        yield put({ type: AUTH_LOGIN_SUCCESS, data: result.data })
      } else {
        yield put({ type: AUTH_LOGIN_FAILED, errors: [] })
      }
    } else {
      if (result && result.errors) {
        yield put({ type: AUTH_LOGIN_FAILED, errors: result.errors })
      } else {
        yield put({ type: AUTH_LOGIN_FAILED, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: AUTH_LOGIN_FAILED, errors: [err] })
  }
}

export function* watchFacebookLogin(){
  yield takeLatest(AUTH_FACEBOOK_LOGIN, facebookLogin)
}

function* googleLogin(payload){
  try {
    const result = yield googleLoginApi(payload.data)
    if (result && result.data) {
      if (result.data.user) {
        yield put({ type: AUTH_LOGIN_SUCCESS, data: result.data })
      } else {
        yield put({ type: AUTH_LOGIN_FAILED, errors: [] })
      }
    } else {
      if (result && result.errors) {
        yield put({ type: AUTH_LOGIN_FAILED, errors: result.errors })
      } else {
        yield put({ type: AUTH_LOGIN_FAILED, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: AUTH_LOGIN_FAILED, errors: [err] })
  }
}

export function* watchGoogleLogin(){
  yield takeLatest(AUTH_GOOGLE_LOGIN, googleLogin)
}

function* signup(payload){
  try {
    const result = yield signupAPI(payload.data)
    if (result && result.data) {
      if (result.data.user) {
        yield put({ type: AUTH_SIGNUP_SUCCESS, data: result.data })
      } else {
        yield put({ type: AUTH_SIGNUP_FAILED, errors: [] })
      }
    } else {
      if (result && result.errors) {
        yield put({ type: AUTH_SIGNUP_FAILED, errors: result.errors })
      } else {
        yield put({ type: AUTH_SIGNUP_FAILED, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: AUTH_SIGNUP_FAILED, errors: [err] })
  }
}

export function* watchSignup(){
  yield takeLatest(AUTH_SIGNUP, signup)
}

function* activate(payload){
  const { email, code } = payload.data
  try {
    const result = yield activateAPI(email, code)
    if (result && result.data) {
      if (result.data.user && result.data.token) {
        yield put({ type: AUTH_LOGIN_SUCCESS, data: result.data })
      } else {
        yield put({ type: AUTH_LOGIN_FAILED, errors: [] })
      }
    } else {
      if (result && result.errors) {
        yield put({ type: AUTH_LOGIN_FAILED, errors: result.errors })
      } else {
        yield put({ type: AUTH_LOGIN_FAILED, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: AUTH_LOGIN_FAILED, errors: [err] })
  }
}

export function* watchActivate(){
  yield takeLatest(AUTH_ACTIVATE, activate)
}

function* logout(payload){
  try {
		const auth = yield select(getAuth)
    let result = null;
		if (auth.is_admin) {
			result = yield adminLogoutApi(auth.refresh_token)
		} else {
			result = yield logoutAPI(auth.refresh_token)
		}
    if (result && result.data) {
      yield put({ type: AUTH_LOGOUT_SUCCESS })
    } else {
      if (result && result.errors) {
        yield put({ type: AUTH_EXPIRED, errors: result.errors })
      } else {
        yield put({ type: AUTH_EXPIRED, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: AUTH_EXPIRED, errors: [err] })
  }
}

export function* watchSignout(){
  yield takeLatest(AUTH_LOGOUT, logout)
}

function* updateToken() {
  try {
    const auth = yield select(getAuth)
		let result = null;
		if (auth.is_admin) {
			result = yield adminUpdateTokenApi(auth.refresh_token)
		} else {
			result = yield updateTokenAPI(auth.refresh_token)
		}
    if (result && result.data) {
      yield put({ type: AUTH_UPDATE_TOKEN, data: result.data })
      yield scheduleUpdateToken();
    } else {
      if (result && result.errors) {
        yield put({ type: AUTH_EXPIRED, errors: result.errors })
      } else {
        yield put({ type: AUTH_EXPIRED, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: AUTH_EXPIRED, errors: [err] })
  }
}

const delay = time => new Promise(resolve => setTimeout(resolve, time));

function* scheduleUpdateToken() {
  try {
    // calculate token life time
    let auth = yield select(getAuth);
    if (auth && auth.loggedin) {
      const decoded = jwtDecode(auth.token);
      const tokenLifeTime = decoded.exp * 1000 - Date.now();

      // delay till 10 seconds before from expire time
      yield call(delay, tokenLifeTime - 10 * 1000);

      auth = yield select(getAuth);
      if (auth.loggedin) {
        yield updateToken();
      }
    }
  } catch (err) {
    console.log('error on scheduleUpdateToken', err);
    yield put({ type: AUTH_EXPIRED, errors: [err] })
  }
}

export function* watchScheduleUpdateToken(){
  yield takeLatest(AUTH_SCHEDULE_UPDATE_TOKEN, scheduleUpdateToken)
}