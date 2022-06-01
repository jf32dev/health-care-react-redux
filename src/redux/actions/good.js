import {
	GET_GOOD_LIST,
	GET_MY_GOOD_LIST
} from '../type';
  
export const getMyGoods = () => {
  return {
    type: GET_MY_GOOD_LIST,
    data: {}
  }
}

export const getGoods = () => {
  return {
    type: GET_GOOD_LIST,
    data: {}
  }
}
