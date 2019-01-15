import React, { Component } from 'react'
import SearchResult from './SearchResult.jsx'
import ThreeDots from '../images/ThreeDots.svg'


/**
 * Class that encapsulates each individual searchresult 
 *
 */
class SearchResults extends Component {
  constructor (props) {
    super(props)
    this.handleStarClick = this.handleStarClick.bind(this)
    this.conditionalRender = this.conditionalRender.bind(this)
  }

  handleStarClick (identifier) {
    this.props.handleClick(identifier)
  }

  /**
   * Conditional render that will render based on the string entered
   * @param {String} whatToRender - String passed as a prop from parent component
   */
  conditionalRender (whatToRender) {
    switch (whatToRender) {
      case 'error':
        return <h3>{this.props.results.toString()}</h3>
      case 'isLoading':
        return <img src={ThreeDots} alt="" />
      case 'results':
        return (
          <table className='Results-table'>
            <tbody>
              {this.props.results.map((result) =>
                <SearchResult
                  key={result._id}
                  favourited={this.props.favourites.includes(result._id)}
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
