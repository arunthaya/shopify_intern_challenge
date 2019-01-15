import React, { Component } from 'react'
import '../styling/App.css'
import '../styling/SearchBarStyling.css'

/**
 * Class to render searchbar, self explanatory code
 *
 */

class SearchBar extends Component {
  constructor (props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  handleSubmit () {
    this.props.onSearchSubmit()
  }

  handleChange (e) {
    this.props.onInputChange(e.target.value)
  }

  handleKeyPress (e) {
    this.props.keyPress(e)
  }

  render () {
    const searchFieldText = this.props.value
    return (
      <div className='search'>
        {this.props.isBadInput ? ( //change input background to red if bad input
          <input
            value={searchFieldText}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyPress}
            className='error'
          />
        ) : (
          <input
            value={searchFieldText}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyPress}
          />
        )}
          <button onClick={this.handleSubmit}>&#8981;</button>
      </div>
    )
  }
}



export default SearchBar
