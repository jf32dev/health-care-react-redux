import { getAPI, postAPI } from './base';

export async function getUsers(){
  return await getAPI(`admin/user`);
}

export async function modifyUser(id, value) {
  return await postAPI(`admin/user/modify/${id}`, { value });
}

export async function resetUserPassword(id, password) {
  return await postAPI(`admin/user/reset_password`, { user_id: id, password });
}

export async function getTransactionHistory(customer_id) {
  return await getAPI(`admin/user/payment?customer_id=${customer_id}`);
}