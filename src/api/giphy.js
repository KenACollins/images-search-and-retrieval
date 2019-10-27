import axios from 'axios';

const keys = require('../config/keys');
const MAX_RESULTS_PER_PAGE = 50; // We only want to retrieve 50 images per API call.

const getImages = async (searchTerm = '', currentOffset = 0) => {
    try {
        const response = await axios.create({ baseURL: 'https://api.giphy.com' }).get('/v1/gifs/search', {
            params: {
                q: searchTerm,
                api_key: keys.giphyApiKey,
                limit: MAX_RESULTS_PER_PAGE,
                offset: currentOffset
            }
        });
        console.log("Using https URL");
        return response;
    }
    catch (err) {
        return err;
    }
};

export default getImages;