/**
 * This component strictly defines how a search bar looks and how it responds to user interaction.  It does not contain code to actually conduct the search.
 * o Its appearance has a hardcoded label and an input field.
 * o Its behavior is to capture keystrokes typed in input field and invoke an onFormSubmit() method when the user presses the Enter key.
 * o The App component caller handles the search logic in a function local to it, and it passes that function as props.onSubmit to this component.
 * o When the user presses the Enter key, the callback function passed as props.onSubmit from the App component caller is executed.
 */
import React from 'react';

class SearchBar extends React.Component {
    state = { term: '' };

    onFormSubmit = event => {   // This code is triggered when user presses Enter key.
        event.preventDefault(); // Prevent refreshing the page when user submits form by pressing Enter.
        this.props.onSubmit(this.state.term);
    }

    render() {
        return (
            <div className="ui segment">
                <form onSubmit={this.onFormSubmit} className="ui form">
                    <div className="field">
                        <label>Image Search</label>
                        <input type="text" placeholder="cars, engines, Fleetwood Mac, etc." value={this.state.term} onChange={e => this.setState({ term: e.target.value })} />
                    </div>
                </form>
            </div>
        );
    }
}

export default SearchBar;