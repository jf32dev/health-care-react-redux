import {
	GET_ACTIVE_PAYMENT
} from '../type';
  
export const getActivePayment = () => {
  return {
    type: GET_ACTIVE_PAYMENT,
    data: {}
  }
}
