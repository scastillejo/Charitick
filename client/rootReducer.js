import { combineReducers } from 'redux';

import details from './reducers/donateDetails';
import flashMessages from './reducers/flashMessages';
import auth from './reducers/auth';

export default combineReducers({
  details,	
  flashMessages,
  auth
});
