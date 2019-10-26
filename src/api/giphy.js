import axios from 'axios';

// API key is passed in request with searh term in App.js
export default axios.create({
    baseURL: 'http://api.giphy.com'
});