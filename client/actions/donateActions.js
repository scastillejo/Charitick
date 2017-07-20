import axios from 'axios';
import { DISPLAY_DETAILS } from './types';

export function sendData(data) {
  return {
    type: DISPLAY_DETAILS,
	payload:data
  };
}

export function createDonation(donate) {
  return dispatch => {
    return axios.post('/api/donate', donate).then(res => {
      dispatch(sendData(res.data));
    });
  };
}
