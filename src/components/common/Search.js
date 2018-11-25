import React from 'react';
import { withRouter } from 'react-router-dom';
import Loading from './Loading.js';
import { API_URL } from '../../config.js';
import { handleResponse } from '../../helper.js';
import './Search.css';

class Search extends React.Component {

    constructor() {
        super();

        this.state ={
            searchResults: [],
            searchQuery: '',
            loading: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleRedirect = this.handleRedirect.bind(this);
    }

    handleChange(event) {
        const searchQuery = event.target.value;

        this.setState({
            searchQuery: searchQuery
        });

        // if searchQuery is not present, don't send request to server
        if (!searchQuery) {
            return '';
        }

        this.setState({
            loading: true
        });

        fetch(`${API_URL}/autocomplete?searchQuery=${searchQuery}`)
            .then(handleResponse)
            .then((result) => {
                this.setState({
                    loading: false,
                    searchResults: result,
                });
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    error: error.errorMessage,
                });
            });
    }

    handleRedirect(currencyId) {
        // Clear input value and close autocomplete container,
        // by clearing searchQuery state
        this.setState({
            searchQuery: '',
            searchResults: [],
        });

        this.props.history.push(`/currency/${currencyId}`);
    }

    renderSearchResults() {
        const {searchResults, searchQuery, loading} = this.state;

        if (!searchQuery) {
            return '';
        }

        if (searchResults.length > 0) {
        return (
            <div className='Search-result-container'>
                {searchResults.map(result => (
                    <div 
                        key={result.id} 
                        className='Search-result'
                        onClick={() => this.handleRedirect(result.id)}
                    >
                        {result.name} ({result.symbol})
                    </div>
                ))}
            </div>
        );
        }

        if (!loading) {
        return (
            <div className='Search-result-container'>
                <div className='Search-no-result'>
                    No Results Found.
                </div>
            </div>
        );
        }
    }

    render() {
        const { loading, searchQuery } = this.state;

        return (
            <div className='Search'>
                <span className='Search-icon' />
                <input 
                    className='Search-input'
                    type='text'
                    placeholder='Currency Name' 
                    onChange={this.handleChange}
                    value={searchQuery} />

                {loading && 
                <div className='Search-loading'>
                    <Loading
                        width='12px'
                        height='12px'
                        top='15px'
                        left="-15px"
                        position='absolute' 
                    />
                </div>}
                {this.renderSearchResults()}
            </div>
        );
    }
}

export default withRouter(Search);

