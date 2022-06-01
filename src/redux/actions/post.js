import {
	GET_My_POST_LIST, GET_POSTS_LIST
} from '../type';
  
export const getMyPost = () => {
  return {
    type: GET_My_POST_LIST,
    data: {}
  }
}

export const getPosts = () => {
  return {
    type: GET_POSTS_LIST,
    data: {}
  }
}
