import {
	DO_REACTION,
	DO_REACTION_SUCCESS,
	GET_My_POST_LIST,
	GET_My_POST_LIST_FAIL,
	GET_My_POST_LIST_SUCCESS,
	GET_POSTS_LIST,
	GET_POSTS_LIST_FAIL,
	GET_POSTS_LIST_SUCCESS,
	LEAVE_COMMENT
} from '../type';

const INITIAL = {
  my_posts: [],
	posts:[],
	loading: false,
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case GET_My_POST_LIST:
		case GET_POSTS_LIST:	
			{
				return { 
					...state, loading: true
				};
			}
		case GET_My_POST_LIST_SUCCESS: {
			return {
				...state,
				my_posts: action.data,
				loading: false
			}
		}
		case GET_POSTS_LIST_SUCCESS: {
			return {
				...state,
				posts: action.data,
				loading: false
			}
		}
		case GET_My_POST_LIST_FAIL:
		case GET_POSTS_LIST_FAIL: {
			return {
				...state,
				loading: false
			}
		}
		case DO_REACTION: {
			const { relation_id, value, user_id, type } = action.data;
			let posts = [].concat(state.posts);
			if (type === 0) {
				let index = posts.findIndex(temp => temp.id === relation_id);
				let { likes, dislikes } = posts[index];
				
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
				posts[index] = { ...posts[index], likes, dislikes };
			}
			return {
				...state,
				posts
			}
		}
		case DO_REACTION_SUCCESS: {
			const { type, relation_id, likes, dislikes } = action.data;
			let posts = [].concat(state.posts);
			if (type === 0) {
				let index = posts.findIndex(temp => temp.id === relation_id);
				posts[index] = { ...posts[index], likes, dislikes };
			} else if (type === 3) {
				let index = posts.findIndex(temp => temp.id === action.data.postID);
				let comments = [].concat(posts[index].comments);

				let commentIndex = comments.findIndex(temp => temp.id === relation_id);
				comments[commentIndex] = { ...comments[commentIndex], likes, dislikes };
				posts[index].comments = comments;
			}
			return {
				...state,
				posts
			}
		}
		case LEAVE_COMMENT: {
			const { id, response } = action.data;
			let posts = [].concat(state.posts);
			let index = posts.findIndex(temp => temp.id === id);
			posts[index].comments.push(response);
			return {
				...state,
				posts
			}
		}
    default:
      return state;
  }
} 
