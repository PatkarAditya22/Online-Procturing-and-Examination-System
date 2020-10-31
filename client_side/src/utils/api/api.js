import axios from 'axios';

export default () => {
  return axios.create({
    baseURL: `http://localhost:5000/api`,
    headers: {
      'Authorization': localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  })
}