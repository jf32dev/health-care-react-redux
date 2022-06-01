import { getAPI, postAPI } from './base';

export async function getDoctors(){
  return await getAPI('doctor');
}

export async function requestChat(doctor_id){
    return await postAPI(`chat`, {
        doctor_id
    });
  }

  export async function closeChat(room_id){
    return await postAPI(`chat/close`, {
        room_id
    });
  }
