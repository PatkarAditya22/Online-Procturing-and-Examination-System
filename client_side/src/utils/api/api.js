import axios from 'axios';

export default (body) => {
  return axios.create({
    baseURL: `http://localhost:3000`,
    headers: {
      'Authorization': localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  })
}