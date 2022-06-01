import {
	GET_PATIENT_LIST
} from '../type';
  
export const getPatients = () => {
  return {
    type: GET_PATIENT_LIST,
    data: {}
  }
}