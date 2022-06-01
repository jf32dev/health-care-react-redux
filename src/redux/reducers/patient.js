import {
	GET_PATIENT_LIST,
	GET_PATIENT_LIST_SUCCESS
} from '../type';

const INITIAL = {
  patients: [],
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case GET_PATIENT_LIST: {
      return { ...state };
		}
		case GET_PATIENT_LIST_SUCCESS: {
			return {
				...state,
				patients: action.data
			}
		}
    default:
      return state;
  }
} 