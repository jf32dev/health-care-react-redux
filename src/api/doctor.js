import { getAPI } from './base';

export async function getDoctors(){
  return await getAPI('doctor');
}
