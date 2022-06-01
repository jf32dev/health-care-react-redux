import { SIDEBAR_TOGGLE } from '../type';

export const toggleSidebar = (isOpen) => {
  return {
    type: SIDEBAR_TOGGLE,
    data: { isOpen }
  }
}