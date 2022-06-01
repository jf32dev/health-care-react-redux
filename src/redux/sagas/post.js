import {
	GET_My_POST_LIST, GET_My_POST_LIST_SUCCESS, GET_My_POST_LIST_FAIL, GET_POSTS_LIST, GET_POSTS_LIST_SUCCESS, GET_POSTS_LIST_FAIL,
} from '../type';
import { takeLatest, put, select } from 'redux-saga/effects';
import {
	getMyPost as getMyPostsApi,
	getPosts as getPostsApi,
	getAdminPosts as getAdminPostsApi
} from '../../api';

const getAuth = (state) => state.auth;

function* getMyPost(payload){
	try {
		const result = yield getMyPostsApi()
		if (result && result.data) {
			yield put({ type: GET_My_POST_LIST_SUCCESS, data: result.data })
		} else {
			if (result && result.errors) {
				yield put({ type: GET_My_POST_LIST_FAIL, errors: [] })
			} else {
				yield put({ type: GET_My_POST_LIST_FAIL, errors: [] })
			}
		}
	} catch (err) {
		yield put({ type: GET_My_POST_LIST_FAIL, errors: [err] })
	}
}

export function* watchGetMyPost(){
	yield takeLatest(GET_My_POST_LIST, getMyPost)
}


function* getPosts(payload){
	try {
		const auth = yield select(getAuth)
    let result = [];
		if (auth.is_admin) {
			result = yield getAdminPostsApi()
		} else {
			result = yield getPostsApi()
		}
		if (result && result.data) {
						yield put({ type: GET_POSTS_LIST_SUCCESS, data: result.data })
		} else {
			if (result && result.errors) {
				yield put({ type: GET_POSTS_LIST_FAIL, errors: [] })
			} else {
				yield put({ type: GET_POSTS_LIST_FAIL, errors: [] })
			}
		}
	} catch (err) {
		yield put({ type: GET_POSTS_LIST_FAIL, errors: [err] })
	}
}

export function* watchGetPosts(){
	yield takeLatest(GET_POSTS_LIST, getPosts)
}