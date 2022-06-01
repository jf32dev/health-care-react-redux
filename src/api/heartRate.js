import { getAPI, postAPI } from './base';

export async function getHeartRate(){
  return await getAPI('health/heart_rate');
}

export async function getSteps(){
  return await getAPI('health/steps');
}

export async function getWeight(){
  return await getAPI('health/weight');
}

export async function getAlcoholUse(){
  return await getAPI('health/alcohol');
}

export async function getHeartPressure(){
  return await getAPI('health/blood_pressure');
}

export async function getEnergy(){
  return await getAPI('health/energy');
}

export async function getExercise(){
  return await getAPI('health/exercise');
}

export async function getStand(){
  return await getAPI('health/stand');
}

export async function getSleep(){
  return await getAPI('health/sleep');
}

export async function getECG(){
  return await getAPI('health/ecg-records');
}

export async function getECGDetail(data){
  return await postAPI('health/ecg-detail', data);
}
