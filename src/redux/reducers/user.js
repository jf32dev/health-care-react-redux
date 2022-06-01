import {
  GET_USER_LIST,
  GET_USER_LIST_FAIL,
  GET_USER_LIST_SUCCESS,
  MODIFY_USER,
  SET_DOCTOR_TABLE_INFO,
  SET_USER_TABLE_INFO,
} from '../type';

const INITIAL = {
	users:[],
  loading: false,
  
  user_page_size: 10,
  user_page: 0,

  doctor_page_size: 10,
  doctor_page: 0,
}

export default (state = INITIAL, action) => {
  switch (action.type) {
		case GET_USER_LIST:	 {
      return { 
        ...state, loading: true
      };
    }
		case GET_USER_LIST_SUCCESS: {
			return {
				...state,
				users: action.data,
				loading: false
			}
		}
		case GET_USER_LIST_FAIL: {
			return {
				...state,
				loading: false
			}
    }
    case MODIFY_USER: {
      const { id, value } = action.data;
      let copyUsers = [].concat(state.users);
      let index = copyUsers.findIndex(temp => temp.id === id);
      if (index > -1) {
        value !== 2 ? copyUsers[index].status = value : copyUsers.splice(index, 1);
      }
      return {
        ...state,
        users: copyUsers
      }
    }
    case SET_USER_TABLE_INFO: {
      const { user_page_size, user_page } = action.data;
      return {
        ...state,
        user_page_size,
        user_page
      }
    }
    case SET_DOCTOR_TABLE_INFO: {
      const { doctor_page_size, doctor_page } = action.data;
      return {
        ...state,
        doctor_page_size,
        doctor_page
      }
    }
    default:
      return state;
  }
} 
