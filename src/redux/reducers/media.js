import {
  GET_LOGO_SUCCESS
} from '../type';

const INITIAL = {
  logo: '',
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case GET_LOGO_SUCCESS: {
      return { 
        ...state,
        logo: action.data.logo
      };
    }
    default:
      return state;
  }
} 