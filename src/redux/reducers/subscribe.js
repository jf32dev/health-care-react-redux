import {
	GET_ACTIVE_PAYMENT,
	GET_ACTIVE_PAYMENT_FAIL,
	GET_ACTIVE_PAYMENT_SUCCESS,
} from '../type';

const INITIAL = {
  payment_info: {}
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case GET_ACTIVE_PAYMENT:
		case GET_ACTIVE_PAYMENT_FAIL:
			{
				return { 
					...state, payment_info: {}
				};
			}
		case GET_ACTIVE_PAYMENT_SUCCESS: {
			return {
				...state,
				payment_info: action.data
			}
		}
    default:
      return state;
  }
} 
