import axios from 'axios';
import apiKeys from './apiKeys';

const baseUrl = apiKeys.baseUrl

const currentUserInfo = uid => new Promise ((resolve, reject) => {
  axios.get(`${baseUrl}/user/${uid}`)
  .then(res => resolve(res))
  .catch(err => reject(err));
});

export default { currentUserInfo };