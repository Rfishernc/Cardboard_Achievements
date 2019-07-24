import axios from 'axios';
import apiKeys from './apiKeys';

const DBURL = apiKeys.baseUrl;

const getGamers = () => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/user`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    })
});

const getUserOverview = (userId) => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/user/${userId}`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    })
});

const getNotifications = (userId) => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/user/${userId}/notifications`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    })
});

const clearNotification = (notificationId) => new Promise((resolve, reject) => {
  axios.put(`${DBURL}/user/notified/${notificationId}`)
    .then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    })
});

export default {
  getGamers,
  getUserOverview,
  getNotifications,
  clearNotification,
}