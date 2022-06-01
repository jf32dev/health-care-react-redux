import {
	GET_HEARTRATE_LIST,
	GET_HEARTRATE_LIST_SUCCESS,

	GET_STEPS_LIST,
	GET_STEPS_LIST_SUCCESS,

	GET_WEIGHT_LIST,
	GET_WEIGHT_LIST_SUCCESS,

	GET_ALCOHOL_USE_LIST,
	GET_ALCOHOL_USE_LIST_SUCCESS,

	GET_HEARTPRESSURE_LIST,
	GET_HEARTPRESSURE_LIST_SUCCESS,

	GET_STAND_LIST_SUCCESS,
	GET_SLEEP_LIST_SUCCESS,
	GET_EXERCISE_LIST_SUCCESS,
	GET_ENERGY_LIST_SUCCESS,

	ADD_STEP,
	ADD_STEP_SUCCESS,
	
	ADD_HEART_RATE,
	ADD_HEART_RATE_SUCCESS,

	ADD_WEIGHT,
	ADD_WEIGHT_SUCCESS,

	ADD_ALCOHOL_SUCCESS,
	ADD_ALCOHOL,

	ADD_HEAERT_PRESSURE,
	ADD_HEAERT_PRESSURE_SUCCESS,

	GET_EXERCISE_LIST,
	GET_ENERGY_LIST,
	GET_STAND_LIST,

	ADD_STAND,
	ADD_EXERCISE,
	ADD_ENERGY,
	ADD_ENERGY_SUCCESS,
	ADD_EXERCISE_SUCCESS,
	ADD_STAND_SUCCESS,

	GET_SLEEP_LIST,
	ADD_SLEEP_SUCCESS,
	ADD_SLEEP,
	
	GET_ECG_LIST,
	GET_ECG_LIST_SUCCESS,
} from '../type';

const INITIAL = {
  heartRate: [],
  steps:[],
  weight:[],
  alcohol_use:[],
  heart_pressure:[],
  sleep:[],
  stand:[],
  energy:[],
	exercise:[],
	ecg: [],
  loading: false
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case GET_HEARTRATE_LIST:
		case GET_STEPS_LIST:
		case GET_WEIGHT_LIST:
		case GET_ALCOHOL_USE_LIST:
		case GET_HEARTPRESSURE_LIST:
		case GET_EXERCISE_LIST:
		case GET_ENERGY_LIST:
		case GET_STAND_LIST:
    case GET_SLEEP_LIST:
		case GET_ECG_LIST: {
			return { ...state };
		}

		case ADD_STEP:
		case ADD_HEART_RATE:
		case ADD_WEIGHT:
		case ADD_ALCOHOL:
		case ADD_HEAERT_PRESSURE:
		case ADD_STAND:
		case ADD_EXERCISE:
		case ADD_ENERGY:
		case ADD_SLEEP: {
			return { 
				...state,
				loading: true  
			};
		}
		case GET_HEARTRATE_LIST_SUCCESS: {
			return {
				...state,
				heartRate: action.data
			}
		}
		case GET_STEPS_LIST_SUCCESS: {
			return {
				...state,
				steps: action.data
			}
		}
		case GET_WEIGHT_LIST_SUCCESS: {
			return {
				...state,
				weight: action.data
			}
		}
		case GET_ALCOHOL_USE_LIST_SUCCESS: {
			return {
				...state,
				alcohol_use: action.data
			}
		}
		case GET_HEARTPRESSURE_LIST_SUCCESS: {
			return {
				...state,
				heart_pressure: action.data
			}
		}
		case GET_STAND_LIST_SUCCESS: {
			return {
				...state,
				stand: action.data
			}
		}
		case GET_SLEEP_LIST_SUCCESS: {
			return {
				...state,
				sleep: action.data
			}
		}
		case GET_EXERCISE_LIST_SUCCESS: {
			return {
				...state,
				exercise: action.data
			}
		}
		case GET_ENERGY_LIST_SUCCESS: {
			return {
				...state,
				energy: action.data
			}
		}
		case GET_ECG_LIST_SUCCESS: {
			return {
				...state,
				ecg: action.data
			}
		}
		case ADD_STEP_SUCCESS: {
			return {
				...state,
				steps:action.data,
				loading: false,
			}
		}
		case ADD_HEART_RATE_SUCCESS: {
			return {
				...state,
				heartRate:action.data,
				loading: false
			}
		}
		case ADD_WEIGHT_SUCCESS: {
			return {
				...state,
				weight:action.data,
				loading: false
			}
		}
		case ADD_ALCOHOL_SUCCESS: {
			return {
				...state,
				alcohol_use:action.data,
				loading: false
			}
		}
		case ADD_HEAERT_PRESSURE_SUCCESS: {
			return {
				...state,
				heart_pressure:action.data,
				loading: false
			}
		}
		case ADD_ENERGY_SUCCESS: {
			return {
				...state,
				energy:action.data,
				loading: false
			}
		}
		case ADD_EXERCISE_SUCCESS: {
			return {
				...state,
				exercise:action.data,
				loading: false
			}
		}
		case ADD_STAND_SUCCESS: {
			return {
				...state,
				stand:action.data,
				loading: false
			}
		}
		case ADD_SLEEP_SUCCESS: {
			return {
				...state,
				sleep:action.data,
				loading: false
			}
		}
    default:
      return state;
  }
} 