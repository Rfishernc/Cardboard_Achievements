import axios from 'axios';
import apiKeys from './apiKeys';

const DBURL = apiKeys.baseUrl;

const getAllGames = () => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/game/all`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    });
});

export default {
  getAllGames,
}