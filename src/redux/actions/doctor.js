import {
	GET_DOCTOR_LIST
} from '../type';
  
export const getDoctors = () => {
  return {
    type: GET_DOCTOR_LIST,
    data: {}
  }
}