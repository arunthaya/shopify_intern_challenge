import React, { Component } from 'react';
import SearchResult from './SearchBar';
import '../App.css';

class Favourites extends Component {

	constructor(props){
		super(props);
		//this.mapFavourites = this.mapFavourites.bind(this);
	}

	// mapFavourites(){
	// 	this.props.favourites.map( (favourite) => {
	// 		<SearchResult 
	// 			key={favourite._id} 
 //        favourited = {this.props.favourites.includes(favourite._id) ? true : false}
 //        handleClick = {this.handleStarClick}
 //        title={favourite.title}
 //        textToDisplay={favourite.body}
 //        id={favourite._id}
	// 		/>
	// 	});
	// }

	render(){
		return(
			<p>Herro</p>
		);
	}

}

export default Favourites;

//