import React from 'react';
import giphy from '../api/giphy';
import SearchBar from './SearchBar';
import ImageList from './ImageList';

const keys = require('../config/keys');

class App extends React.Component {
    state = { term: '', images: [], totalCount: 0 };
    maxResultsPerPage = 50;
    currentOffset = -51;
    previousSearchTerm = '';

    onSearchSubmit = async term => {
        this.currentOffset += this.maxResultsPerPage + 1;
        const response = await giphy.get('/v1/gifs/search', {
            params: {
                q: term,
                api_key: keys.giphyApiKey,
                limit: this.maxResultsPerPage,
                offset: this.currentOffset
            }
        });
        
        // this.setState({ term, images: [...this.state.images, ...response.data.data], totalCount: response.data.pagination.total_count });
        console.log('Pagination object:', response.data.pagination);
        const newImages = this.refreshOrConcatenate(response);
        this.setState({ term, images: newImages, totalCount: response.data.pagination.total_count });
    };

    refreshOrConcatenate = response => {
        if (this.state.term === this.previousSearchTerm) {
            return [...this.state.images, ...response.data.data];
        }
        else {
            this.previousSearchTerm = this.state.term;
            console.log("Just set prev term to: " + this.previousSearchTerm);
            return response.data.data;
        }
    };

    componentDidMount() {
        window.onscroll = () => {
            if (!this.state || this.state.term === '') { return; }
    
            const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
            const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
            const scrolledToBottom = (scrollTop + window.innerHeight) >= scrollHeight;
    
            if (scrolledToBottom) {
                this.onSearchSubmit(this.state.term);
            }
        }
    }

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