import {
  GET_CATEGORY,
  GET_CATEGORY_SUCCESS,
} from '../type';

const INITIAL = {
  categories: []
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case GET_CATEGORY: {
      return { ...state }
    }
		case GET_CATEGORY_SUCCESS:	 {
      return { 
        ...state, categories: action.data
      };
    }
    default:
      return state;
  }
} 
