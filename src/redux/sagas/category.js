import {
   GET_CATEGORY, GET_CATEGORY_SUCCESS
} from '../type';
import { takeLatest, put } from 'redux-saga/effects';

import {
  getCategories as getCategoriesApi
} from '../../api';

function* getCategories(payload){
  try {
    const result = yield getCategoriesApi()
    if (result && result.data) {
      yield put({ type: GET_CATEGORY_SUCCESS, data: result.data })
    } 
  } catch (err) {
    console.log("CATEGORY FETCH ERR", err);
  }
}

export function* watchGetCategories(){
  yield takeLatest(GET_CATEGORY, getCategories)
}
