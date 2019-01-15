import React, { Component } from 'react'
import SearchResult from './SearchResult.jsx'
import '../styling/SearchResults.css'
//import loadingIcon from 'loadingIcon.svg'

class SearchResults extends Component {
  constructor (props) {
    super(props)
    this.handleStarClick = this.handleStarClick.bind(this)
    this.conditionalRender = this.conditionalRender.bind(this)
  }

  handleStarClick (identifier) {
    this.props.handleClick(identifier)
  }

  conditionalRender (whatToRender) {
    switch (whatToRender) {
      case 'error':
        return <h3>{this.props.results.toString()}</h3>
      case 'isLoading':
        return <h3>Loading...</h3>
      case 'results':
        return (
          <table className='Results-table'>
            <tbody>
              {this.props.results.map((result) =>
                <SearchResult
                  key={result._id}
                  favourited={!!this.props.favourites.includes(result._id)}
                  handleClick={this.handleStarClick}
                  title={result.title}
                  textToDisplay={result.body}
                  id={result._id} />
              )
              }
            </tbody>
          </table>)
      case 'noresults':
        return <h3>No results found</h3>
      default:
        return null
    }
  }

  render () {
    const whatToRender = this.props.whatToRender
    return (
      <div className='searchresult-child'>
        {this.conditionalRender(whatToRender)}
      </div>
    )
  }
}

export default SearchResults
