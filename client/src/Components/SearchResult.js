import React, { Component } from 'react';
import entities from 'entities';
import ReactHtmlParser from 'react-html-parser';
import '../App.css';

class SearchResult extends Component {
	
	constructor(props){
		super(props);
		this.handleStarClick = this.handleStarClick.bind(this);
	}

	handleStarClick(val){
		this.props.handleClick(val);
	}

	render(){
		return(
			<React.Fragment>
    		{console.log(entities.decodeHTML(this.props.textToDisplay))}
	    		<tr>
			      <td onClick={() => this.handleStarClick(this.props.id)}className="Star">&#9733;</td>
			      <td>{this.props.title}</td>
			      <td>{ReactHtmlParser(entities.decodeHTML(this.props.textToDisplay))}</td>
			    </tr>
  		</React.Fragment>
		);
	}
}

export default SearchResult;