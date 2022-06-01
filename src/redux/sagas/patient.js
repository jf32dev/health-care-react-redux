import {
    GET_PATIENT_LIST, GET_PATIENT_LIST_SUCCESS, GET_PATIENT_LIST_FAIL
  } from '../type';
  import { takeLatest, put } from 'redux-saga/effects';
  
  import {
    getPatients as getPatientsApi
  } from '../../api';
  
  function* getPatients(payload){
    try {
          const result = yield getPatientsApi()
      if (result && result.data) {
              yield put({ type: GET_PATIENT_LIST_SUCCESS, data: result.data })
      } else {
        if (result && result.errors) {
          yield put({ type: GET_PATIENT_LIST_FAIL, errors: [] })
        } else {
          yield put({ type: GET_PATIENT_LIST_FAIL, errors: [] })
        }
      }
    } catch (err) {
      yield put({ type: GET_PATIENT_LIST_FAIL, errors: [err] })
    }
  }
  
  export function* watchGetPatients(){
    yield takeLatest(GET_PATIENT_LIST, getPatients)
  }
  