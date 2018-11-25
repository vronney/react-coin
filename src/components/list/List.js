import React,{Component} from 'react';
import { handleResponse } from '../../helper.js';
import { API_URL } from '../../config.js';
import Loading from '../common/Loading.js';
import Table from './Table.js';
import Pagination from './Pagination.js';


class List extends Component {
    constructor(){
        super();

        this.state = {
            loading: false,
            currencies: [],
            error: null,
            totalPages: 0,
            page: 1,
        };

        this.handlePaginationClick = this.handlePaginationClick.bind(this);
    }

    componentDidMount() {
        this.fetchCurrencies();
    }

    fetchCurrencies() {
        this.setState({
            loading: true
        });

        const {
            page
        } = this.state;

        fetch(`${API_URL}/cryptocurrencies?page=${page}&perPage=20`)
            .then(handleResponse)
            .then((data) => {
                const {
                    currencies,
                    totalPages
                } = data;

                this.setState({
                    currencies: currencies,
                    totalPages: totalPages,
                    loading: false
                });
            })
            .catch((error) => {
                this.setState({
                    error: error.errorMessage,
                    loading: false
                });
            });
    }

    handlePaginationClick(direction) {
        let nextPage = this.state.page;

        if (direction === 'next') {
            nextPage++;
        } else {
            nextPage--;
        }

        this.setState({page: nextPage},
            // call fetchCurrencies function inside setState's callback
            // because we have to make sure first page state is updated
            () => {this.fetchCurrencies();
            });
    } 
    
    render() {
        const { loading, error, currencies, page, totalPages } = this.state;

        // render only loading component, if loading state is set to true
        if (loading) {
            return <div className='loading-container'><Loading/></div>
        }

        // render only error message, if error occurred while fetching data
        if (error) {
            return <div className='error'>{this.state.error}</div>
        }

        return (
           <div>
            <Table 
                currencies={currencies}
            />
            <Pagination
                page={page}
                totalPages={totalPages}
                handlePaginationClick={this.handlePaginationClick}
            />    
           </div> 
        );
    }
}

export default List;

