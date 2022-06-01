import { postAPI } from './base';
export async function addStep (data){
  return await postAPI(`health/steps`, {
      data
  });
}

export async function addHeartRate (data){
    return await postAPI(`health/heart_rate`, {
        data
    });
  }

export async function addWeight (data){
    return await postAPI(`health/weight`, {
        data
    });
  }

  export async function addAlohol (data){

    return await postAPI(`health/alcohol`, {
        data
    });
  }
  
  export async function addHeartPressure (data){
    return await postAPI(`health/blood_pressure`, {
        data
    });
  }

  export async function addEnergy (data){
    return await postAPI(`health/energy`, {
        data
    });
  }

  export async function addExercise (data){

    return await postAPI(`health/exercise`, {
        data
    });
  }
  
  export async function addStand (data){
    return await postAPI(`health/stand`, {
        data
    });
  }

  export async function addSleep (data){
    return await postAPI(`health/sleep`, {
        data
    });
  }