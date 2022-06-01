import { getAPI,postAPI } from './base';

export async function getMyPost(){
  return await getAPI('post/mine');
}

export async function getPosts(){
  return await getAPI('post');
}

export async function updatePost(id, data){
  return await postAPI(`post/${id}`, data);
}

export async function deletePost(id) {
	return await postAPI(`post/delete/${id}`);
}

export async function getAdminPosts(){
  return await getAPI('admin/post');
}

export async function deleteAdminPost(id) {
	return await postAPI(`admin/post/delete/${id}`);
}