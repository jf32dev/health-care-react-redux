import {
	GET_MY_ARTICLE_LIST, GET_MY_ARTICLE_SUCCESS, GET_MY_ARTICLE_FAIL, GET_ARTICLES_LIST, GET_ARTICLES_LIST_SUCCESS, GET_ARTICLES_LIST_FAIL, UPDATE_ARTICLE
} from '../type';
import { takeLatest, put } from 'redux-saga/effects';
import {
	getMyArticles as getMyArticlesApi,
	getArticles as getArticlesApi,
	updateArticle as updateArticleApi,
} from '../../api';

function* getMyArticles(payload){
	try {
		const result = yield getMyArticlesApi()
		if (result && result.data) {
			yield put({ type: GET_MY_ARTICLE_SUCCESS, data: result.data })
		} else {
			if (result && result.errors) {
				yield put({ type: GET_MY_ARTICLE_FAIL, errors: [] })
			} else {
				yield put({ type: GET_MY_ARTICLE_FAIL, errors: [] })
			}
		}
	} catch (err) {
		yield put({ type: GET_MY_ARTICLE_FAIL, errors: [err] })
	}
}

export function* watchGetMyArticles(){
	yield takeLatest(GET_MY_ARTICLE_LIST, getMyArticles)
}

function* updateArticle(payload){
	try {
		const { id, article } = payload.data;
		const result = yield updateArticleApi(id, article);
		if (result && result.data) {
			yield put({ type: GET_MY_ARTICLE_SUCCESS, data: result.data })
		} 
	} catch (err) {
		console.log("UPDATE ERROR", err);
	}
}

export function* watchUpdateArticle(){
	yield takeLatest(UPDATE_ARTICLE, updateArticle)
}


function* getArticles(payload){
	try {
		const result = yield getArticlesApi()
		if (result && result.data) {
			yield put({ type: GET_ARTICLES_LIST_SUCCESS, data: result.data })
		} else {
			if (result && result.errors) {
				yield put({ type: GET_ARTICLES_LIST_FAIL, errors: [] })
			} else {
				yield put({ type: GET_ARTICLES_LIST_FAIL, errors: [] })
			}
		}
	} catch (err) {
		yield put({ type: GET_ARTICLES_LIST_FAIL, errors: [err] })
	}
}

export function* watchGetArticles(){
	yield takeLatest(GET_ARTICLES_LIST, getArticles)
}