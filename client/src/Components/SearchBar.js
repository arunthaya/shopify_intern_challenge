import React, { Component } from 'react';
//import Debounce from './Debounce';
import '../App.css';


class SearchBar extends Component {
	
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.props.onInputChange(e.target.value);
	}

	render(){
		const searchFieldText = this.props.value;
		return(
			<div className="App-search">
	          <input></input>
	          <button></button>
	        </div>
        );
	}

}

export default SearchBar;