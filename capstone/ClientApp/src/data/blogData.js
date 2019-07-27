import axios from 'axios';
import apiKeys from './apiKeys';

const DBURL = apiKeys.baseUrl;

const getBlogPosts = () => new Promise((resolve, reject) => {
  axios.get(`${DBURL}/blog`)
    .then((data) => {
      resolve(data.data);
    })
    .catch((err) => {
      reject(err);
    })
});

export default {
  getBlogPosts,
}