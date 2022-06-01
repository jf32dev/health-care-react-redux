import {
	DO_REACTION,
	DO_REACTION_SUCCESS,
	GET_GOOD_LIST,
	GET_GOOD_LIST_FAIL,
	GET_GOOD_LIST_SUCCESS,
	GET_MY_GOOD_FAIL,
	GET_MY_GOOD_LIST,
	GET_MY_GOOD_SUCCESS,
} from '../type';

const INITIAL = {
  my_goods: [],
	goods:[],
	loading: false,
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case GET_MY_GOOD_LIST:
		case GET_GOOD_LIST:	
			{
				return { 
					...state, loading: true
				};
			}
		case GET_MY_GOOD_SUCCESS: {
			return {
				...state,
				my_goods: action.data,
				loading: false
			}
		}
		case GET_GOOD_LIST_SUCCESS: {
			return {
				...state,
				goods: action.data,
				loading: false
			}
		}
		case GET_MY_GOOD_FAIL:
		case GET_GOOD_LIST_FAIL: {
			return {
				...state,
				loading: false
			}
		}
		case DO_REACTION: {
			const { relation_id, value, user_id, type } = action.data;
			let goods = [].concat(state.goods);
			if (type === 2) {
				let index = goods.findIndex(temp => temp.id === relation_id);
				let { likes, dislikes } = goods[index];
				
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
				goods[index] = { ...goods[index], likes, dislikes };
			}
			return {
				...state,
				goods
			}
		}
		case DO_REACTION_SUCCESS: {
			const { type, relation_id, likes, dislikes } = action.data;
			let goods = [].concat(state.goods);
			if (type === 2) {
				let index = goods.findIndex(temp => temp.id === relation_id);
				goods[index] = { ...goods[index], likes, dislikes };
			}
			return {
				...state,
				goods
			}
		}
    default:
      return state;
  }
} 
