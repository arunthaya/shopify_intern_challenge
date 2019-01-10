import React, { Component } from 'react';
import SearchResult from './SearchResult';
import '../App.css';


class SearchResults extends Component {

  constructor(props){
    super(props);
    this.handleStarClick = this.handleStarClick.bind(this);
    this.conditionalRender = this.conditionalRender.bind(this);
  }

  handleStarClick(identifier){
    console.log('handleStarClick from searchResults');
    this.props.handleClick(identifier);
  }

  conditionalRender(whatToRender){
    switch(whatToRender){
      case 'error':
        return <h3>{this.props.results}</h3>;
      case 'isLoading':
        return <h3>Loading</h3>;
      case 'results':
        return (
          <table className="Results-table">
            <tbody>
              {this.props.results.map( (result) => 
                <SearchResult
                  key={result._id} 
                  handleClick = {this.handleStarClick}
                  title={result.title}
                  textToDisplay={result.body}
                  id={result._id}/>
                )
              }
            </tbody>
          </table>);
      default:
        return null;
    }
  }

  render(){
    const whatToRender = this.props.whatToRender;
    return (
      this.conditionalRender(whatToRender)
    );
  }

}

export default SearchResults;