import React, { Component } from 'react'
import entities from 'entities'
import ReactHtmlParser from 'react-html-parser'
import '../App.css'

class SearchResult extends Component {
  constructor (props) {
    super(props)
    this.handleStarClick = this.handleStarClick.bind(this)
  }

  handleStarClick (val) {
    this.props.handleClick(val)
  }

  render () {
    return (
      <React.Fragment>
        <tr>
          {this.props.favourited ?
            (
              <td onClick={() => this.handleStarClick(this.props.id)}>
                <button className='star highlighted'>&#9733;</button>
                {this.props.title}
              </td>
            ) : (
              <td onClick={() => this.handleStarClick(this.props.id)}>
                <button className='star'>&#9733;</button>
                {this.props.title}
              </td>
            )
          }


          <td>{ReactHtmlParser(entities.decodeHTML(this.props.textToDisplay))}</td>
        </tr>
      </React.Fragment>
    )
  }
}

export default SearchResult

/* onClick={() => this.handleStarClick(this.props.id)} */
