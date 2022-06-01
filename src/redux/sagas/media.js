import {
  GET_LOGO, GET_LOGO_SUCCESS
} from '../type';
import { takeLatest, put } from 'redux-saga/effects';

import {
  getLogo as getLogoApi
} from '../../api';

function* getLogo(payload){
  try {
    const result = yield getLogoApi()
    if (result && result.data) {
      yield put({ type: GET_LOGO_SUCCESS, data: result.data })
    } 
  } catch (err) {
    console.log("LOGO ERROR", err)
  }
}

export function* watchGetLogo(){
  yield takeLatest(GET_LOGO, getLogo)
}
