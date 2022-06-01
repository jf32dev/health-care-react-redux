import { getAPI,postAPI } from './base';

export async function getMyGoods(){
  return await getAPI('admin/good/mine');
}

export async function getGoods(){
  return await getAPI('data/good');
}

export async function updateGood(id, data){
  return await postAPI(`admin/good/${id}`, data);
}

export async function deleteGood(id) {
	return await postAPI(`admin/good/delete/${id}`);
}