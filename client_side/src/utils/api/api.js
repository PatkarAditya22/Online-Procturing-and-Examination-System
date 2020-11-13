import axios from 'axios';

export default () => {
  return axios.create({
    baseURL: `https://www.nerdsofafeather.ml/server/api`,
    headers: {
      'Authorization': localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  })
}