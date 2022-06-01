import {
  LEAVE_COMMENT
} from '../type';
  
export const leaveComment = (data) => {
  return {
    type: LEAVE_COMMENT,
    data: data
  }
}
