import {
	GET_USER_LIST, GET_USER_LIST_SUCCESS, GET_USER_LIST_FAIL
} from '../type';
import { takeLatest, put } from 'redux-saga/effects';
import {
  getUsers as getUsersApi,
} from '../../api';

function* getUsers(payload){
	try {
		const result = yield getUsersApi()
		if (result && result.data) {
			yield put({ type: GET_USER_LIST_SUCCESS, data: result.data })
		} else {
			if (result && result.errors) {
				yield put({ type: GET_USER_LIST_FAIL, errors: [] })
			} else {
				yield put({ type: GET_USER_LIST_FAIL, errors: [] })
			}
		}
	} catch (err) {
		yield put({ type: GET_USER_LIST_FAIL, errors: [err] })
	}
}

export function* watchGetUsers(){
	yield takeLatest(GET_USER_LIST, getUsers)
}