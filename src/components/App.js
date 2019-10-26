import React from 'react';
import SearchBar from './SearchBar';
import ImageList from './ImageList';
const keys = require('../config/keys');

class App extends React.Component {
    render() {
        return (
            <div>
                <SearchBar />
                <ImageList />
            </div>
        );
    }
}

export default App;