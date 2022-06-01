import {  postAPI } from './base';


export async function submitFeedback(chat_id,rating,description,doctor_id){
    return await postAPI(`feedback/`+doctor_id, {
        chat_id,rating,description
    });
  }
