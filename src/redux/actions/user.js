import {
	GET_USER_LIST,
  MODIFY_USER,
  SET_DOCTOR_TABLE_INFO,
  SET_USER_TABLE_INFO
} from '../type';
  
export const getUsers = () => {
  return {
    type: GET_USER_LIST,
    data: {}
  }
}

export const modifyUser = (id, value) => {
  return {
    type: MODIFY_USER,
    data: { id, value }
  }
}

export const setUserTableInfo = (data) => {
  return {
    type: SET_USER_TABLE_INFO,
    data: data
  }
}

export const setDoctorTableInfo = (data) => {
  return {
    type: SET_DOCTOR_TABLE_INFO,
    data: data
  }
}