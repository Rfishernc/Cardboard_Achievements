import axios from 'axios';
import apiKeys from './apiKeys';

const DBURL = apiKeys.baseUrl;

const getUsersAchievementsForGame = (userId, gameId) => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/achievement/${userId}/${gameId}`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    })
});

const getPopularity = () => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/achievement/popularity`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    })
});

const getUsersAchievements = (userId) => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/achievement/${userId}`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    })
});

const getAchievementsForGame = (gameId) => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/achievement/game/${gameId}`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    })
});

const submitAchievement = (achievement) => new Promise((resolve, reject) => {
  axios.post(`${DBURL}/achievement`, achievement)
    .then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    })
});

const getRecentAchievements = (userId) => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/achievement/recent/${userId}`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    })
});

const getRecentProposedAchievements = (userId) => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/achievement/proposed&recent/${userId}`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    })
});

const getProposedAchievementsForGame = (gameId, userId) => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/achievement/proposed/${gameId}/${userId}`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    })
});

const addProposedAchievement = (newAchievement) => new Promise((resolve, reject) => {
  axios.post(`${DBURL}/achievement/proposed`, newAchievement)
    .then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    })
});

const getAchievementsToCheck = () => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/achievement/mod`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    });
});

const approveUserAchievement = (userAchievementId) => new Promise((resolve, reject) => {
  axios.put(`${DBURL}/achievement/approve/${userAchievementId}`)
    .then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
});

const declineUserAchievement = (userAchievementId, msg) => new Promise((resolve, reject) => {
  axios.put(`${DBURL}/achievement/decline/${userAchievementId}`, { userAchievementId, declineMsg: msg })
    .then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
});

export default {
  getUsersAchievementsForGame,
  getPopularity,
  getUsersAchievements,
  getAchievementsForGame,
  submitAchievement,
  getRecentAchievements,
  getRecentProposedAchievements,
  getProposedAchievementsForGame,
  addProposedAchievement,
  getAchievementsToCheck,
  approveUserAchievement,
  declineUserAchievement,
}