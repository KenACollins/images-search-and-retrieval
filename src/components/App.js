import React from 'react';
import getImages from '../api/giphy';
import SearchBar from './SearchBar';
import ImageList from './ImageList';

class App extends React.Component {
    state = { previousSearchTerm: '', images: [], totalCount: 0, noResultsCode: 0 };
    maxResultsPerPage = 50; // We only want to retrieve 50 images per API call.
    currentOffset = 0;      // Akin to page number, index position starting point for next batch of results.

    /**
     * This function is called when the user types a search term into the input field and presses Enter. It replaces any history 
     * of previously retrieved images with the first batch of images meeting the new criteria. 
     * 
     * If user has already gotten results for that search term, and perhaps scrolled down to obtain multiple batches of results, 
     * pressing Enter will reset the screen to the first batch of images.
     */
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

        const response = await getImages(term, this.currentOffset);
        
        if (response && response.data) {
            // Prevent code from bombing when pagination object is missing.
            const total_count = (response.data.pagination && response.data.pagination.total_count) ? response.data.pagination.total_count : 0;
            if (total_count === 0) { this.setState({ noResultsCode: 2}); }
            
            // For new searches, replace images array with data returned in this API response.
            this.setState({ previousSearchTerm: term, images: response.data.data, totalCount: total_count });
        }
    };
    
    /**
     * This function is called whenever the user scrolls down to the bottom of a screen full of images, causing another API call to retrieve
     * an additional batch of images. If the user reaches the end of the result set, a warning message indicating 'no MORE results' will appear.
     */
    addMoreImages = async () => {
        // If moving the offset to the next position goes beyond the total number of results, alert user there are no more results. Avoid needless API call.
        if (this.currentOffset + this.maxResultsPerPage + 1 > this.state.totalCount) {
            this.setState({ noResultsCode: 3 });
            return;
        }

        // Okay, it is safe to increment offset for next API call.
        this.currentOffset += this.maxResultsPerPage + 1;
        
        const response = await getImages(this.state.previousSearchTerm, this.currentOffset);
               
        if (response && response.data) {
            // For subsequent searches, total_count should have the same non-zero value as it did in first search.
            const total_count = (response.data.pagination && response.data.pagination.total_count) ? response.data.pagination.total_count : 0;

            // For additional searches of same search term, concatenate images array with data returned in this API response.
            this.setState({ images: [...this.state.images, ...response.data.data], totalCount: total_count });
        }
    };

    /**
     * This function gracefully handles situations where there is a lack of results by displaying an appropriate message on the screen.
     */
    showNoResultsMessage = () => {
        switch(this.state.noResultsCode) {
            case 1: return <div>{`Please type a search term into the field above and press Enter.`}</div>;
            case 2: return <div>{`No results were found for search term ${this.state.previousSearchTerm}.`}</div>;
            case 3: return <div>{`No MORE results are available, total count displayed is ${this.formatNumber(this.state.totalCount)}.`}</div>
            default: return null;
        }
    };

    /**
     * This utility function formats large numbers with thousands separator. Example: 12345 => 12,345
     */
    formatNumber = num => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    };

    componentDidMount() {
        /**
         * Detect if user has scrolled to the bottom of the screen so that another batch of images matching the search criteria
         * can automatically be retrieved without the need for the user to click a button or do anything special.
         * 
         * FYI, window.onscroll must be set to an arrow function or else 'this' will not be resolved. 
         */
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