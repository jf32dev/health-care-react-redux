import {
  GET_CATEGORY,
} from '../type';
  
export const getCategories = () => {
  return {
    type: GET_CATEGORY,
    data: {}
  }
}