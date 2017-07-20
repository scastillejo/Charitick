import { DISPLAY_DETAILS } from '../actions/types';

export default (state = null, action) => {
  switch (action.type) {
    case DISPLAY_DETAILS:
      return {
        details: action.payload
      };
    default: return state;
  }
}
