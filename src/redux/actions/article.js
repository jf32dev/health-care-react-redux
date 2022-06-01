import {
	GET_ARTICLES_LIST,
	GET_MY_ARTICLE_LIST,
  UPDATE_ARTICLE
} from '../type';
  
export const getMyArticles = () => {
  return {
    type: GET_MY_ARTICLE_LIST,
    data: {}
  }
}

export const getArticles = () => {
  return {
    type: GET_ARTICLES_LIST,
    data: {}
  }
}

export const updateArticle = (id, article) => {
  return {
    type: UPDATE_ARTICLE,
    data: { id, article }
  }
}