import {
	GET_ACTIVE_PAYMENT, GET_ACTIVE_PAYMENT_FAIL, GET_ACTIVE_PAYMENT_SUCCESS
} from '../type';
import { takeLatest, put } from 'redux-saga/effects';
import {
	getActivePayment as getActivePaymentApi
} from '../../api';

function* getActivePayment(payload){
	try {
		const result = yield getActivePaymentApi()
		if (result && result.data) {
			yield put({ type: GET_ACTIVE_PAYMENT_SUCCESS, data: result.data })
		} else {
			if (result && result.errors) {
				yield put({ type: GET_ACTIVE_PAYMENT_FAIL, errors: [] })
			} else {
				yield put({ type: GET_ACTIVE_PAYMENT_FAIL, errors: [] })
			}
		}
	} catch (err) {
		yield put({ type: GET_ACTIVE_PAYMENT_FAIL, errors: [err] })
	}
}

export function* watchGetActivePayment(){
	yield takeLatest(GET_ACTIVE_PAYMENT, getActivePayment)
}