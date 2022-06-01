import {
	GET_DOCTOR_LIST,
	GET_DOCTOR_LIST_SUCCESS,
	GET_DOCTOR_LIST_FAIL
} from '../type';

const INITIAL = {
  doctors: [],
  loading: false,
}

export default (state = INITIAL, action) => {
  switch (action.type) {
	case GET_DOCTOR_LIST: {
      	return { 
			...state,
			loading: true
		};
	}
	case GET_DOCTOR_LIST_FAIL: {
		return { 
			...state,
			loading: false
		};
	}
	case GET_DOCTOR_LIST_SUCCESS: {
		return {
			...state,
			doctors: action.data,
			loading: false,
		}
	}
    default:
      return state;
  }
} 