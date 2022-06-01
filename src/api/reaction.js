import { postAPI } from './base';

export async function reaction(relation_id,type,value){
  return await postAPI(`reaction`, {
    relation_id,type,value
  });
}

