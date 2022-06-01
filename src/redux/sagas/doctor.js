import {
  GET_DOCTOR_LIST, GET_DOCTOR_LIST_SUCCESS, GET_DOCTOR_LIST_FAIL
} from '../type';
import { takeLatest, put } from 'redux-saga/effects';

import {
  getDoctors as getDoctorsApi
} from '../../api';

function* getDoctors(payload){
  try {
		const result = yield getDoctorsApi()
    if (result && result.data) {
			yield put({ type: GET_DOCTOR_LIST_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: GET_DOCTOR_LIST_FAIL, errors: [] })
      } else {
        yield put({ type: GET_DOCTOR_LIST_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: GET_DOCTOR_LIST_FAIL, errors: [err] })
  }
}

export function* watchGetDoctors(){
  yield takeLatest(GET_DOCTOR_LIST, getDoctors)
}
