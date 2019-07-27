import axios from 'axios';
import apiKeys from './apiKeys';

const DBURL = apiKeys.baseUrl;

const addVote = (userId, achievementId) => new Promise((resolve, reject) => {
  axios.post(`${DBURL}/vote`, { userId, achievementId })
    .then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    })
});

export default {
  addVote,
}