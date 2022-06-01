import {
  GET_LOGO,
} from '../type';
  
export const getLogo = () => {
  return {
    type: GET_LOGO,
    data: {}
  }
}