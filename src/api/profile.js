import { postAPI } from './base';

export async function updateProfile(data){
  return await postAPI('profile', data);
}