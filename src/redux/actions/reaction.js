import {
	DO_REACTION
} from '../type';
  
export const doReaction = (data) => {
  return {
    type: DO_REACTION,
    data: data
  }
}
