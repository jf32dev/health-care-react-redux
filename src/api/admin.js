import { postAPI } from './base';

export async function adminLogin(data){
  return await postAPI('admin/auth/login', data);
}

export async function adminLogout(refresh_token){
  return await postAPI('admin/auth/logout', { refresh_token });
}

export async function adminUpdateToken(refresh_token){
  return await postAPI('admin/auth/token', { refresh_token });
}