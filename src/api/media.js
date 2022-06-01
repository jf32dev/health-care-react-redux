import { getAPI, postAPI, uploadAPI } from './base';

export async function uploadImage(file){
  return await uploadAPI('media/upload', file);
}

export async function uploadLogo(data){
  return await postAPI('admin/logo', data);
}

export async function getLogo(){
  return await getAPI('data/logo');
}