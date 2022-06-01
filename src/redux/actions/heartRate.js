import {
  GET_HEARTRATE_LIST,GET_STEPS_LIST,GET_WEIGHT_LIST,GET_ALCOHOL_USE_LIST,GET_HEARTPRESSURE_LIST, GET_ENERGY_LIST, GET_SLEEP_LIST, GET_STAND_LIST, GET_EXERCISE_LIST, GET_ECG_LIST,
  ADD_STAND, ADD_EXERCISE, ADD_ENERGY, ADD_SLEEP, ADD_STEP,ADD_HEART_RATE, ADD_WEIGHT, ADD_ALCOHOL, ADD_HEAERT_PRESSURE,
} from '../type';
  
export const getHeartRate = () => {
  return {
    type: GET_HEARTRATE_LIST,
    data: {}
  }
}

export const getSteps = () => {
  return {
    type: GET_STEPS_LIST,
    data: {}
  }
}

export const getWeight = () => {
  return {
    type: GET_WEIGHT_LIST,
    data: {}
  }
}

export const getAlcoholUse = () => {
  return {
    type: GET_ALCOHOL_USE_LIST,
    data: {}
  }
}

export const getHeartPressure = () => {
  return {
    type: GET_HEARTPRESSURE_LIST,
    data: {}
  }
}

export const getEnergy = () => {
  return {
    type: GET_ENERGY_LIST,
    data: {}
  }
}

export const getSleep = () => {
  return {
    type: GET_SLEEP_LIST,
    data: {}
  }
}

export const getStand = () => {
  return {
    type: GET_STAND_LIST,
    data: {}
  }
}

export const getExercise = () => {
  return {
    type: GET_EXERCISE_LIST,
    data: {}
  }
}

export const getECG = () => {
  return {
    type: GET_ECG_LIST,
    data: {}
  }
}


export const addStep = (data) => {
  return {
    type: ADD_STEP,
    data: data
  }
}

export const addHeartRate = (data) => {
  return {
    type: ADD_HEART_RATE,
    data: data
  }
}


export const addWeight = (data) => {
  return {
    type: ADD_WEIGHT,
    data: data
  }
}
export const addAlcohol = (data) => {
  return {
    type: ADD_ALCOHOL,
    data: data
  }
}

export const addHeartPressure = (data) => {
  return {
    type: ADD_HEAERT_PRESSURE,
    data: data
  }
}


export const addStand = (data) => {
  return {
    type: ADD_STAND,
    data: data
  }
}
export const addExercise = (data) => {
  return {
    type: ADD_EXERCISE,
    data: data
  }
}

export const addEnergy = (data) => {
  return {
    type: ADD_ENERGY,
    data: data
  }
}

export const addSleep = (data) => {
  return {
    type: ADD_SLEEP,
    data: data
  }
}



