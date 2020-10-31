import axios from 'axios';

export default () => {
  return axios.create({
    baseURL: `http://152.67.10.242/server/api`,
    headers: {
      'Authorization': localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  })
}