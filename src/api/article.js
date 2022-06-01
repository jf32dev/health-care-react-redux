import { getAPI,postAPI } from './base';

export async function getMyArticles(){
  return await getAPI('admin/article/mine');
}

export async function getArticles(){
  return await getAPI('data/article');
}

export async function updateArticle(id, data){
  return await postAPI(`admin/article/${id}`, data);
}

export async function deleteArticle(id) {
	return await postAPI(`admin/article/delete/${id}`);
}