import { getAPI,postAPI } from './base';

export async function getCategories(){
  return await getAPI('data/category');
}

export async function updateCategory(id, data){
  return await postAPI(`admin/category?id=${id}`, data);
}