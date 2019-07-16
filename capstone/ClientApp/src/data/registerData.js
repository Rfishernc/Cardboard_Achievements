
import firebase from 'firebase/app';
import 'firebase/auth';
import axios from 'axios';
import apiKeys from './apiKeys';

const DBURL = apiKeys.baseUrl;

axios.interceptors.request.use((request) => {
  const token = sessionStorage.getItem('token');
  if (token != null) {
      request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
}, (err) => {
  return Promise.reject(err);
});

axios.interceptors.response.use(response => {
    return response;
}, errorResponse => {
   console.error("Blew up")
});

const createUser = (email, password) => new Promise((resolve, reject) => {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
});

const createUserInDB = (UserName, Uid) => {
  const newUser = {
    UserName,
    Uid
  }
  axios.post(`${DBURL}/user`, newUser);
}

export default {
  createUser,
  createUserInDB
};
