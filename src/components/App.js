import React from 'react';
import giphy from '../api/giphy';
import SearchBar from './SearchBar';
import ImageList from './ImageList';

const keys = require('../config/keys');

class App extends React.Component {
    state = { previousSearchTerm: '', images: [], totalCount: 0, noResultsCode: 0 };
    maxResultsPerPage = 50; // We only want to retrieve 50 images per API call.
    currentOffset = 0;      // Akin to page number, index position starting point for next batch of results.

    onSearchSubmit = async term => {
        term = term.trim(); // Remove any extraneous white space characters in beginning or end of search term.

        // Display a message if user pressed Enter but did not type anything into the search input field.
        if (term === '') {
            this.setState({ noResultsCode: 1 });
            return;
        }

        // Avoid repeated API calls if user already submitted a search for a term for which no results were found.
        if (term === this.state.previousSearchTerm && this.state.totalCount === 0 && this.state.noResultsCode === 2) {
            return;
        }

        // Initialize all state properties and instance variables before processing current search.
        this.setState({ previousSearchTerm: '', images: [], totalCount: 0, noResultsCode: 0 });
        this.currentOffset = 0;

        const response = await giphy.get('/v1/gifs/search', {
            params: {
                q: term,
                api_key: keys.giphyApiKey,
                limit: this.maxResultsPerPage,
                offset: this.currentOffset
            }
        });
        
        // For new searches, replace images array with data returned in this API response.
        const total_count = (response.data.pagination && response.data.pagination.total_count) ? response.data.pagination.total_count : 0;
        if (total_count === 0) { this.setState({ noResultsCode: 2}); }
        this.setState({ previousSearchTerm: term, images: response.data.data, totalCount: total_count });
    };

    addMoreImages = async () => {
        // If moving the offset to the next position goes beyond the total number of results, alert user there are no more results. Avoid needless API call.
        if (this.currentOffset + this.maxResultsPerPage + 1 > this.state.totalCount) {
            this.setState({ noResultsCode: 3 });
            return;
        }
        this.currentOffset += this.maxResultsPerPage + 1;
        
        const response = await giphy.get('/v1/gifs/search', {
            params: {
                q: this.state.previousSearchTerm,
                api_key: keys.giphyApiKey,
                limit: this.maxResultsPerPage,
                offset: this.currentOffset
            }
        });
        
        // For additional searches of same search term, concatenate images array with data returned in this API response.
        const total_count = (response.data.pagination && response.data.pagination.total_count) ? response.data.pagination.total_count : 0;
        this.setState({ images: [...this.state.images, ...response.data.data], totalCount: total_count });
    };

    showNoResultsMessage = () => {
        switch(this.state.noResultsCode) {
            case 1: return <div>{`Please type a search term into the field above and press Enter.`}</div>;
            case 2: return <div>{`No results were found for search term ${this.state.previousSearchTerm}.`}</div>;
            case 3: return <div>{`No MORE results are available, total count displayed is ${this.formatNumber(this.state.totalCount)}.`}</div>
            default: return null;
        }
    };

    // Format large numbers with thousands separator. Example: 12345 => 12,345
    formatNumber = num => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    };

    componentDidMount() {
        // Must set window.onscroll to an arrow function or else 'this' will not be resolved.
        window.onscroll = () => {
            if (!this.state || this.state.previousSearchTerm === '') { return; }
    
            const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
            const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
            const scrolledToBottom = (scrollTop + window.innerHeight) >= scrollHeight;
    
            if (scrolledToBottom) {
                this.addMoreImages();
            }
        }
    }

    render() {
        return (
            <div className="ui container" style={{marginTop: '30px'}}>
                <SearchBar onSubmit={this.onSearchSubmit} />
                <ImageList images={this.state.images} />
                <div>{this.showNoResultsMessage()}</div>
            </div>
        );
    }
}

export default App;