import { postAPI } from './base';

export async function createComment(post_id,text){
  return await postAPI(`comment/0`, {
    post_id,text
  });
}

