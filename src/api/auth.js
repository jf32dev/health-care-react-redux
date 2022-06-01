import { getAPI, postAPI } from './base';

export async function login(email, password){
  return await postAPI('auth/login', {
    email, password, login_type: 0
  });
}

export async function facebookLogin(data){
  return await postAPI('auth/facebook', { ...data, login_type: 0} );
}

export async function googleLogin(data){
  return await postAPI('auth/google',  { ...data, login_type: 0} );
}

export async function me(){
  return await getAPI('auth/me');
}

export async function signup(data){
  return await postAPI('auth/signup',  { ...data, login_type: 0} );
}

export async function activate(email, code){
  return await postAPI('auth/activate', {
    email, code, login_type: 0
  });
}

export async function requestActivation(email){
  return await postAPI(`auth/request_activation`, {
    email
  });
}

export async function logout(refresh_token){
  return await postAPI('auth/logout', {
    refresh_token,
  });
}

export async function updateToken(refresh_token){
  return await postAPI('auth/token', {
    refresh_token,
  });
}

export async function requestResetPassword(email){
  return await postAPI(`auth/request_reset_password`, {
    email
  });
}

export async function resetPassword(data){
  return await postAPI('auth/reset_password', data);
}