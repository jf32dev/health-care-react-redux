import {
	DO_REACTION,
	DO_REACTION_SUCCESS,
	GET_ARTICLES_LIST,
	GET_ARTICLES_LIST_FAIL,
	GET_ARTICLES_LIST_SUCCESS,
	GET_MY_ARTICLE_FAIL,
	GET_MY_ARTICLE_LIST,
	GET_MY_ARTICLE_SUCCESS,
} from '../type';

const INITIAL = {
  my_articles: [],
	articles:[],
	loading: false,
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case GET_MY_ARTICLE_LIST:
		case GET_ARTICLES_LIST:	
			{
				return { 
					...state, loading: true
				};
			}
		case GET_MY_ARTICLE_SUCCESS: {
			return {
				...state,
				my_articles: action.data,
				loading: false
			}
		}
		case GET_ARTICLES_LIST_SUCCESS: {
			return {
				...state,
				articles: action.data,
				loading: false
			}
		}
		case GET_MY_ARTICLE_FAIL:
		case GET_ARTICLES_LIST_FAIL: {
			return {
				...state,
				loading: false
			}
		}
		case DO_REACTION: {
			const { relation_id, value, user_id, type } = action.data;
			let articles = [].concat(state.articles);
			if (type === 1) {
				let index = articles.findIndex(temp => temp.id === relation_id);
				let { likes, dislikes } = articles[index];
				
				let likeIndex = likes.findIndex(temp => temp.user_id === user_id);
				let dislikeIndex = dislikes.findIndex(temp => temp.user_id === user_id);
				if (value === 1) {
					if (likeIndex === -1) {
						likes.push({ user_id })
						if (dislikeIndex !== -1) dislikes.splice(dislikeIndex, 1);
					} else {
						likes.splice(likeIndex, 1);
					}
				} else {
					if (dislikeIndex === -1) {
						dislikes.push({ user_id })
						if (likeIndex !== -1) likes.splice(likeIndex, 1);
					} else {
						dislikes.splice(dislikeIndex, 1);
					}
				}
				articles[index] = { ...articles[index], likes, dislikes };
			}
			return {
				...state,
				articles
			}
		}
		case DO_REACTION_SUCCESS: {
			const { type, relation_id, likes, dislikes } = action.data;
			let articles = [].concat(state.articles);
			if (type === 1) {
				let index = articles.findIndex(temp => temp.id === relation_id);
				articles[index] = { ...articles[index], likes, dislikes };
			}
			return {
				...state,
				articles
			}
		}
    default:
      return state;
  }
} 
