import { getAPI, postAPI } from './base';

export async function getActivePayment(){
  return await getAPI(`subscription/payment`);
}

export async function createOnetimePay(data){
  return await postAPI(`subscription/onetime-pay`, data);
}

export async function getPaymentSecret(data){
  return await postAPI(`subscription/payment_intent`, data);
}

export async function subscribe(data){
  return await postAPI(`subscription/subscribe`, data);
}

export async function unsubscribe(data){
  return await postAPI(`subscription/cancel_subscription`, data);
}