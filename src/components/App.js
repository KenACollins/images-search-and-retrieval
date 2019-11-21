import './back-to-top.css';
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
        // Remove any extraneous white space characters in beginning or end of search term.
        // term = term.trim();
        
        // Display a message if user pressed Enter but did not type anything into the search input field.
        if (term === '') {
            // this.setState({ noResultsCode: 1 });
            this.setState({ previousSearchTerm: '', images: [], noResultsCode: 1 });
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
         * If user has scrolled enough for the search field to disappear, fade in 'back to top' floater.
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

            // ===================
            // Back to Top Feature
            // ===================
            // If distance from top exceeds 200 pixels, fade in 'back to top' floater.
            if (scrollTop > 200) {
                document.getElementById('backToTop').classList.remove('fadeOut');
                document.getElementById('backToTop').classList.add('fadeIn');
            }
            // Otherwise, user is near top of page, fade out 'back to top' floater.
            else {
                document.getElementById('backToTop').classList.remove('fadeIn');
                document.getElementById('backToTop').classList.add('fadeOut');
            }
        }

        // When user clicks on 'back to top' floater, quickly scroll web page up to the top. Occurs faster than jQuery since timing can't be set.
        // Notes: 
        // 1. Some browsers do not support smooth option parameter, so web page jumps to top: Edge, IE, and Safari (both macOS and iOS).
        // 2. window.scroll({top: 0, left: 0, behavior: 'smooth' }) has identical effect as document.body.scrollIntoView({ behavior: 'smooth' }) 
        //    but window.scroll() is not supported on IE and Safari for iOS so 'back to top' feature would not be available on those browsers. It 
        //    is therefore better to go with scrollIntoView() which is supposedly supported by all browsers, even if smooth behavior is not.
        // 3. Applying scrollIntoView() on body tag works. Can also apply on an ID, i.e., document.getElementById('root') or other HTML tag, i.e.,
        //    document.querySelector('h1').
        document.getElementById('backToTop').addEventListener('click', () => {
            document.body.scrollIntoView({ behavior: 'smooth' });
        });

        // Because 'back to top' floater is initially hidden when page loads with scroll position at the top, we must assign "display: none".
        // However, once fade in animation begins or fade out animation ends, we control the display property, overriding its default.
        // We need this in place before the fade out animation starts, because #backToTop element must be visible for JS code to find it.
        document.getElementById('backToTop').addEventListener('animationstart', (event) => {
            if (event.animationName === 'fadeInKF') {
                document.getElementById('backToTop').style.display = 'block';
            }
        });

        // Only when the fading out animation has concluded do we restore the "display: none" setting to the #backToTop element.
        document.getElementById('backToTop').addEventListener('animationend', (event) => {
            if (event.animationName === 'fadeOutKF') {
                document.getElementById('backToTop').style.display = 'none';
            }
        });
    }

    componentWillUnmount() {
        // Best practices: Remove event listeners when component is going away.
        document.getElementById('backToTop').removeEventListener('click', () => {
            document.body.scrollIntoView({ behavior: 'smooth' });
        });

        document.getElementById('backToTop').removeEventListener('animationstart', (event) => {
            if (event.animationName === 'fadeInKF') {
                document.getElementById('backToTop').style.display = 'block';
            }
        });

        document.getElementById('backToTop').removeEventListener('animationend', (event) => {
            if (event.animationName === 'fadeOutKF') {
                document.getElementById('backToTop').style.display = 'none';
            }
        });
    }

    render() {
        return (
            <div className="ui container" style={{marginTop: '30px'}}>
                <SearchBar onSubmit={this.onSearchSubmit} />
                <ImageList images={this.state.images} />
                <div>{this.showNoResultsMessage()}</div>
                <button id="backToTop" title="Back to Top"><span></span></button>
            </div>
        );
    }
}

export default App;