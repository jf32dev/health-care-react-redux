import {
	GET_MY_GOOD_LIST, GET_MY_GOOD_SUCCESS, GET_MY_GOOD_FAIL, GET_GOOD_LIST, GET_GOOD_LIST_SUCCESS, GET_GOOD_LIST_FAIL
} from '../type';
import { takeLatest, put } from 'redux-saga/effects';
import {
	getGoods as getGoodsApi,
	getMyGoods as getMyGoodsApi,
} from '../../api';

function* getMyGoods(payload){
	try {
		const result = yield getMyGoodsApi()
		if (result && result.data) {
			yield put({ type: GET_MY_GOOD_SUCCESS, data: result.data })
		} else {
			if (result && result.errors) {
				yield put({ type: GET_MY_GOOD_FAIL, errors: [] })
			} else {
				yield put({ type: GET_MY_GOOD_FAIL, errors: [] })
			}
		}
	} catch (err) {
		yield put({ type: GET_MY_GOOD_FAIL, errors: [err] })
	}
}

export function* watchGetMyGoods(){
	yield takeLatest(GET_MY_GOOD_LIST, getMyGoods)
}


function* getGoods(payload){
	try {
		const result = yield getGoodsApi()
		if (result && result.data) {
			yield put({ type: GET_GOOD_LIST_SUCCESS, data: result.data })
		} else {
			if (result && result.errors) {
				yield put({ type: GET_GOOD_LIST_FAIL, errors: [] })
			} else {
				yield put({ type: GET_GOOD_LIST_FAIL, errors: [] })
			}
		}
	} catch (err) {
		yield put({ type: GET_GOOD_LIST_FAIL, errors: [err] })
	}
}

export function* watchGetGoods(){
	yield takeLatest(GET_GOOD_LIST, getGoods)
}