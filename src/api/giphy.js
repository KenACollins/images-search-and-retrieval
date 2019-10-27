import axios from 'axios';

const keys = require('../config/keys');
const MAX_RESULTS_PER_PAGE = 50; // We only want to retrieve 50 images per API call.

// API key is passed in request with searh term in App.js
export const giphy = axios.create({
    baseURL: 'http://api.giphy.com'
});

const getImages = async (searchTerm = '', currentOffset = 0) => {
    try {
        const response = await axios.create({ baseURL: 'http://api.giphy.com' }).get('/v1/gifs/search', {
            params: {
                q: searchTerm,
                api_key: keys.giphyApiKey,
                limit: MAX_RESULTS_PER_PAGE,
                offset: currentOffset
            }
        });
        return response;
    }
    catch (err) {
        return err;
    }
};

export default getImages;