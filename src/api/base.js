import axios from 'axios';

let store;

function getHeader() {
  let state = store.getState()
  const { token } = state.auth;
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${token}`,
    }
  };
}

export function setStore(appStore) {
  store = appStore;
}

export async function getAPI(url) {
  try {
    let result = await axios.get(`${process.env.REACT_APP_SERVER_ROOT_URL}/${url}`, getHeader());
    result = result && result.data
    
    return result;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    console.log(error);
    throw error;
  }
}

export async function postAPI(url, data) {
  try {
    let result = await axios.post(`${process.env.REACT_APP_SERVER_ROOT_URL}/${url}`, data, getHeader());
    result = result && result.data
    
    return result;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    console.log(error);
    throw error;
  }
}

export async function uploadAPI(url, file) {
  const header = getHeader()
  header.headers['Content-Type'] = 'multipart/form-data';
  
  const formData = new FormData();
  formData.append('file', file)

  try {
    let result = await axios.post(`${process.env.REACT_APP_SERVER_ROOT_URL}/${url}`, formData, header);
    result = result && result.data
    
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}