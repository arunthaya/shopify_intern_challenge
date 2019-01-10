import React, { Component } from 'react';
//import Debounce from './Debounce';
import '../App.css';


class SearchBar extends Component {
	
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(){
		this.props.onSearchSubmit();	
	}

	handleChange(e) {
		console.log(e.target.value);
		this.props.onInputChange(e.target.value);
	}

	render(){
		const searchFieldText = this.props.value;
		return(
			<div className="App-search">
	          <input 
	          	value={searchFieldText} 
	          	onChange={this.handleChange} />
	          <button onClick={this.handleSubmit}>Search</button>
	        </div>
        );
	}

}

export default SearchBar;