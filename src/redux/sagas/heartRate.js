import {
  GET_HEARTRATE_LIST, GET_HEARTRATE_LIST_SUCCESS, GET_HEARTRATE_LIST_FAIL,
  GET_STEPS_LIST, GET_STEPS_LIST_SUCCESS, GET_STEPS_LIST_FAIL,
  GET_WEIGHT_LIST, GET_WEIGHT_LIST_SUCCESS, GET_WEIGHT_LIST_FAIL,
  GET_ALCOHOL_USE_LIST, GET_ALCOHOL_USE_LIST_SUCCESS, GET_ALCOHOL_USE_LIST_FAIL,
  GET_HEARTPRESSURE_LIST, GET_HEARTPRESSURE_LIST_SUCCESS, GET_HEARTPRESSURE_LIST_FAIL,
  GET_ENERGY_LIST, GET_ENERGY_LIST_FAIL, GET_ENERGY_LIST_SUCCESS,
  GET_EXERCISE_LIST, GET_EXERCISE_LIST_FAIL, GET_EXERCISE_LIST_SUCCESS,
  GET_STAND_LIST, GET_STAND_LIST_FAIL, GET_STAND_LIST_SUCCESS,
  GET_SLEEP_LIST,GET_SLEEP_LIST_FAIL,GET_SLEEP_LIST_SUCCESS,
  GET_ECG_LIST, GET_ECG_LIST_SUCCESS, GET_ECG_LIST_FAIL,

  ADD_STEP,ADD_STEP_SUCCESS,ADD_STEP_FAIL,
  ADD_HEART_RATE,ADD_HEART_RATE_SUCCESS,ADD_HEART_RATE_FAIL,
  ADD_WEIGHT,ADD_WEIGHT_SUCCESS,ADD_WEIGHT_FAIL,
  ADD_ALCOHOL,ADD_ALCOHOL_SUCCESS,ADD_ALCOHOL_FAIL, ADD_HEAERT_PRESSUREL_FAIL, ADD_HEAERT_PRESSURE_SUCCESS, ADD_HEAERT_PRESSURE,
  ADD_STAND,ADD_STAND_SUCCESS,ADD_STAND_FAIL,
  ADD_EXERCISE,ADD_EXERCISE_SUCCESS,ADD_EXERCISE_FAIL,
  ADD_ENERGY,ADD_ENERGY_SUCCESS,ADD_ENERGY_FAIL,
  ADD_SLEEP, ADD_SLEEP_SUCCESS, ADD_SLEEP_FAIL
} from '../type';
import { takeLatest, put } from 'redux-saga/effects';

import {
  getHeartRate as getHeartRateApi,
  getSteps as getStepsApi,
  getWeight as getWeightApi,
  getAlcoholUse as getAlcoholUseApi,
  getHeartPressure as getHeartPressureApi,
  getSleep as getSleepApi,
  getStand as getStandApi,
  getExercise as getExerciseApi,
  getEnergy as getEnergyApi,
  getECG as getECGApi,
  
  addStep as addStepApi,
  addHeartRate as addHeartRateApi,
  addWeight as addWeightApi,
  addAlohol as addAloholApi,
  addHeartPressure as addHeartPressureApi,
  addStand as addStandApi,
  addEnergy as addEnergyApi,
  addExercise as addExerciseApi,
  addSleep as addSleepApi
} from '../../api';
  
function* getHeartRate(payload){
  try {
    const result = yield getHeartRateApi()
    if (result && result.data) {
      yield put({ type: GET_HEARTRATE_LIST_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: GET_HEARTRATE_LIST_FAIL, errors: [] })
      } else {
        yield put({ type: GET_HEARTRATE_LIST_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: GET_HEARTRATE_LIST_FAIL, errors: [err] })
  }
}

export function* watchGetHeartRate(){
  yield takeLatest(GET_HEARTRATE_LIST, getHeartRate)
}
  
//step

function* getSteps(payload){
  try {
    const result = yield getStepsApi()
    if (result && result.data) {
      yield put({ type: GET_STEPS_LIST_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: GET_STEPS_LIST_FAIL, errors: [] })
      } else {
        yield put({ type: GET_STEPS_LIST_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: GET_STEPS_LIST_FAIL, errors: [err] })
  }
}

export function* watchGetSteps(){
  yield takeLatest(GET_STEPS_LIST, getSteps)
}

//weight

function* getWeight(payload){
  try {
    const result = yield getWeightApi()
    if (result && result.data) {
      yield put({ type: GET_WEIGHT_LIST_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: GET_WEIGHT_LIST_FAIL, errors: [] })
      } else {
        yield put({ type: GET_WEIGHT_LIST_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: GET_WEIGHT_LIST_FAIL, errors: [err] })
  }
}

export function* watchGetWeight(){
  yield takeLatest(GET_WEIGHT_LIST, getWeight)
}

//alcohol

function* getAlcoholUse(payload){
  try {
    const result = yield getAlcoholUseApi()
    if (result && result.data) {
      yield put({ type: GET_ALCOHOL_USE_LIST_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: GET_ALCOHOL_USE_LIST_FAIL, errors: [] })
      } else {
        yield put({ type: GET_ALCOHOL_USE_LIST_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: GET_ALCOHOL_USE_LIST_FAIL, errors: [err] })
  }
}

export function* watchgetAlcoholUse(){
  yield takeLatest(GET_ALCOHOL_USE_LIST, getAlcoholUse)
}

//HEARTPRESSURE

function* getHeartPressure(payload){
  try {
    const result = yield getHeartPressureApi()
    if (result && result.data) {
      yield put({ type: GET_HEARTPRESSURE_LIST_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: GET_HEARTPRESSURE_LIST_FAIL, errors: [] })
      } else {
        yield put({ type: GET_HEARTPRESSURE_LIST_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: GET_HEARTPRESSURE_LIST_FAIL, errors: [err] })
  }
}

export function* watchgetHeartPressure(){
  yield takeLatest(GET_HEARTPRESSURE_LIST, getHeartPressure)
}

function* getEnergy(payload){
  try {
    const result = yield getEnergyApi()
    if (result && result.data) {
      yield put({ type: GET_ENERGY_LIST_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: GET_ENERGY_LIST_FAIL, errors: [] })
      } else {
        yield put({ type: GET_ENERGY_LIST_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: GET_ENERGY_LIST_FAIL, errors: [err] })
  }
}

export function* watchgetEnergy(){
  yield takeLatest(GET_ENERGY_LIST, getEnergy)
}

function* getExercise(payload){
  try {
    const result = yield getExerciseApi()
    if (result && result.data) {
      yield put({ type: GET_EXERCISE_LIST_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: GET_EXERCISE_LIST_FAIL, errors: [] })
      } else {
        yield put({ type: GET_EXERCISE_LIST_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: GET_EXERCISE_LIST_FAIL, errors: [err] })
  }
}

export function* watchgetExercise(){
  yield takeLatest(GET_EXERCISE_LIST, getExercise)
}

function* getStand(payload){
  try {
    const result = yield getStandApi()
    if (result && result.data) {
      yield put({ type: GET_STAND_LIST_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: GET_STAND_LIST_FAIL, errors: [] })
      } else {
        yield put({ type: GET_STAND_LIST_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: GET_STAND_LIST_FAIL, errors: [err] })
  }
}

export function* watchgetStand(){
  yield takeLatest(GET_STAND_LIST, getStand)
}

function* getSleep(payload){
  try {
    const result = yield getSleepApi()
    if (result && result.data) {
      yield put({ type: GET_SLEEP_LIST_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: GET_SLEEP_LIST_FAIL, errors: [] })
      } else {
        yield put({ type: GET_SLEEP_LIST_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: GET_SLEEP_LIST_FAIL, errors: [err] })
  }
}

export function* watchgetSleep(){
  yield takeLatest(GET_SLEEP_LIST, getSleep)
}

function* getECG(payload){
  try {
    const result = yield getECGApi()
    if (result && result.data) {
      yield put({ type: GET_ECG_LIST_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: GET_ECG_LIST_FAIL, errors: [] })
      } else {
        yield put({ type: GET_ECG_LIST_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: GET_ECG_LIST_FAIL, errors: [err] })
  }
}

export function* watchGetECG(){
  yield takeLatest(GET_ECG_LIST, getECG)
}


function* addStep(payload){
  try {
    const result = yield addStepApi(payload.data)
    if (result && result.data) {
      yield put({ type: ADD_STEP_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: ADD_STEP_FAIL, errors: [] })
      } else {
        yield put({ type: ADD_STEP_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: ADD_STEP_FAIL, errors: [err] })
  }
}

export function* watchaddStep(){
  yield takeLatest(ADD_STEP, addStep)
}

function* addHeartRate(payload){
  try {
    const result = yield addHeartRateApi(payload.data)
    if (result && result.data) {
      yield put({ type: ADD_HEART_RATE_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: ADD_HEART_RATE_FAIL, errors: [] })
      } else {
        yield put({ type: ADD_HEART_RATE_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: ADD_HEART_RATE_FAIL, errors: [err] })
  }
}

export function* watchaddHeartRate(){
  yield takeLatest(ADD_HEART_RATE, addHeartRate)
}

function* addWeight(payload){
  try {
    const result = yield addWeightApi(payload.data)
    if (result && result.data) {
      yield put({ type: ADD_WEIGHT_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: ADD_WEIGHT_FAIL, errors: [] })
      } else {
        yield put({ type: ADD_WEIGHT_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: ADD_WEIGHT_FAIL, errors: [err] })
  }
}

export function* watchaddWeight(){
  yield takeLatest(ADD_WEIGHT, addWeight)
}

function* addAlohol(payload){
  try {
    const result = yield addAloholApi(payload.data)
    if (result && result.data) {
      yield put({ type: ADD_ALCOHOL_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: ADD_ALCOHOL_FAIL, errors: [] })
      } else {
        yield put({ type: ADD_ALCOHOL_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: ADD_ALCOHOL_FAIL, errors: [err] })
  }
}

export function* watchaddAlohol(){
  yield takeLatest(ADD_ALCOHOL, addAlohol)
}

function* addHeartPressure(payload){
  try {
    const result = yield addHeartPressureApi(payload.data)
    if (result && result.data) {
      yield put({ type: ADD_HEAERT_PRESSURE_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: ADD_HEAERT_PRESSUREL_FAIL, errors: [] })
      } else {
        yield put({ type: ADD_HEAERT_PRESSUREL_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: ADD_HEAERT_PRESSUREL_FAIL, errors: [err] })
  }
}

export function* watchaddHeartPressure(){
  yield takeLatest(ADD_HEAERT_PRESSURE, addHeartPressure)
}

function* addStand(payload){
  try {
    const result = yield addStandApi(payload.data)
    if (result && result.data) {
      yield put({ type: ADD_STAND_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: ADD_STAND_FAIL, errors: [] })
      } else {
        yield put({ type: ADD_STAND_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: ADD_STAND_FAIL, errors: [err] })
  }
}

export function* watchaddStand(){
  yield takeLatest(ADD_STAND, addStand)
}


function* addExercise(payload){
  try {
    const result = yield addExerciseApi(payload.data)
    if (result && result.data) {
      yield put({ type: ADD_EXERCISE_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: ADD_EXERCISE_FAIL, errors: [] })
      } else {
        yield put({ type: ADD_EXERCISE_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: ADD_EXERCISE_FAIL, errors: [err] })
  }
}

export function* watchaddExercise(){
  yield takeLatest(ADD_EXERCISE, addExercise)
}


function* addEnergy(payload){
  try {
    const result = yield addEnergyApi(payload.data)
    if (result && result.data) {
      yield put({ type: ADD_ENERGY_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: ADD_ENERGY_FAIL, errors: [] })
      } else {
        yield put({ type: ADD_ENERGY_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: ADD_ENERGY_FAIL, errors: [err] })
  }
}

export function* watchaddEnergy(){
  yield takeLatest(ADD_ENERGY, addEnergy)
}


function* addSleep(payload){
  try {
    const result = yield addSleepApi(payload.data)
    if (result && result.data) {
      yield put({ type: ADD_SLEEP_SUCCESS, data: result.data })
    } else {
      if (result && result.errors) {
        yield put({ type: ADD_SLEEP_FAIL, errors: [] })
      } else {
        yield put({ type: ADD_SLEEP_FAIL, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: ADD_SLEEP_FAIL, errors: [err] })
  }
}

export function* watchaddSleep(){
  yield takeLatest(ADD_SLEEP, addSleep)
}
