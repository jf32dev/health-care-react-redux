import { getAPI } from './base';

export async function getPatients(){
  let aa =await getAPI('patient');
  return aa;
}


