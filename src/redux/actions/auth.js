import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_SIGNUP,
  AUTH_UPDATE_TOKEN,
  AUTH_EXPIRED,
	AUTH_ACTIVATE,
	AUTH_FACEBOOK_LOGIN,
	AUTH_GOOGLE_LOGIN, 
	AUTH_ADMIN_LOGIN, AUTH_UPDATE_PROFILE
} from '../type';
  
export const authLogin = (loginData) => {
  return {
    type: AUTH_LOGIN,
    data: loginData
  }
}

export const authAdminLogin = (loginData) => {
  return {
    type: AUTH_ADMIN_LOGIN,
    data: loginData
  }
}

export const authFacebookLogin = (loginData) => {
  return {
    type: AUTH_FACEBOOK_LOGIN,
    data: loginData
  }
}

export const authGoogleLogin = (loginData) => {
  return {
    type: AUTH_GOOGLE_LOGIN,
    data: loginData
  }
}


export const authLogout = () => {
  return {
    type: AUTH_LOGOUT,
    data: { }
  }
}

export const authSignup = (signupData) => {
  return {
    type: AUTH_SIGNUP,
    data: signupData
  }
}

export const updateToken = (data) => {
  return {
    type: AUTH_UPDATE_TOKEN,
    data: data
  }
}

export const tokenExpired = () => {
  return {
    type: AUTH_EXPIRED,
    data: { }
  }
}

export const activate = (data) => {
	return {
		type: AUTH_ACTIVATE,
		data: data
	}
}

export const updateProfile = (data) => {
	return {
		type: AUTH_UPDATE_PROFILE,
		data: data
	}
}