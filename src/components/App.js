import React from 'react';
import giphy from '../api/giphy';
import SearchBar from './SearchBar';
import ImageList from './ImageList';

const keys = require('../config/keys');

class App extends React.Component {
    state = { images: [] };

    onSearchSubmit = async term => {
        const response = await giphy.get('/v1/gifs/search', {
            params: {
                q: term,
                api_key: keys.giphyApiKey
            }
        });
        
        this.setState({ images: response.data.data });
    };

    render() {
        return (
            <div className="ui container" style={{marginTop: '30px'}}>
                <SearchBar onSubmit={this.onSearchSubmit} />
                <ImageList images={this.state.images} />
            </div>
        );
    }
}

export default App;