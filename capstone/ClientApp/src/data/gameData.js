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

const getUsersGames = (userId) => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/user/${userId}/games`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    });
});

const getGameDetails = (gameId, userId) => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/game/${gameId}/${userId}`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    })
});

const getNumberOfPlayers = (gameId) => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/game/${gameId}/players`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    })
});

const getGamePopularity = (gameId) => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/game/${gameId}/popularity`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    })
});

export default {
  getAllGames,
  getUsersGames,
  getGameDetails,
  getNumberOfPlayers,
  getGamePopularity,
}