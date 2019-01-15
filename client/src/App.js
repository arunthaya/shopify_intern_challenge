import React, { Component } from 'react'
import SearchBar from './components/SearchBar.jsx'
import SearchResults from './components/SearchResults.jsx'
import helpers from './utilities/StringHelper'
import './styling/App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputSubmit = this.handleInputSubmit.bind(this)
    this.handleStarClick = this.handleStarClick.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.state = {
      favourites: [], //favourites array storing indexes of items favourited
      favouritesVerbatim: [], //stores the actual result object in this array
      isBadInput: false, //if input submitted failed tests app doesn't send request
      prevSearch: '', //app compares prevSearch to currentSearch to determine if request will be sent
      results: [],  //arry that stores all results from a get request to server
      searchField: '', //stores the input val from <input> html tag
      whatToRender: null  //tells app to render error, loading, results, or no results
    }
  }

  /**
   * Function to render input box
   * @param {String} text - Sets state to string captured from input
   */
  handleInputChange(text){
    console.log(text)
    this.setState(
      {searchField: text},
      () => {
        let searchFieldCurrent = this.state.searchField.slice();
        let x = [];
        if(helpers.isEmpty(searchFieldCurrent)){
          this.setState({results: x, whatToRender: null});
        }
      }
    )
  }

  /**
   * Function to check if entered was hit on the input element
   * @param {Object} e - Target element captured, reset isBadInput if user previously entered one, allowing program to check the input again
   */
  handleKeyPress(e){
    if(e.keyCode === 13){
      this.handleInputSubmit()
    } else {
      this.setState({
        isBadInput: false
      })
    }
  }

  /**
   * Function to handle submit, checks to make sure input is not blank, or the same as previous search
   * @param {String, String, Object} this.state - Make sure none of the fields are null or equal to each other
   */
  handleInputSubmit(){
    const { searchField, prevSearch, results } = this.state;
    if (helpers.isSameSearch(searchField, prevSearch, results) === true){
      return this.setState({
        isBadInput: true //same search or empty search
      })
    }
    this.setState({ //otherwise change state to isLoading and begin fetch
      whatToRender: 'isLoading',
      prevSearch: searchField.trim()
    }, () => {
      this.fetchData()
        .then(
        res => {
          let x = []
          x = res.body
          console.log(res)
          if(res.body.length === 0){
            this.setState({
              results: [...x],
              whatToRender: 'noresults'
            })
          } else {
            this.setState({
              results: [...x],
              whatToRender: 'results' //parse results to display
            })
          }
        })
      .catch(err => this.setState({results: err, whatToRender: 'error'})) //catch error to display
    })
  }

  /**
   * Function to make get request to server address with words from input
   */
  fetchData = async () => {
    const response = await fetch(`/api/search?keywords=${this.state.searchField}`)
    const body = await response.json()
    if (response.status !== 200) {
      throw Error(body.error)
    }
    return body
  }

  /**
   * Function that compares star's id to an array of favourited stars, and either toggles star's favourite icon on or off
   * @param {Object._id} val- This is used to compare ids with the results array, if favourited the result is added to the favourites array
   */
  handleStarClick(val){
    let favouritesCopy = [...this.state.favourites];
    let favouritesVerbatimCopy = [...this.state.favouritesVerbatim];
    let index = favouritesCopy.indexOf(val);
    if (index !== -1){ //not favourited yet
      let favouriteVerbatimIndex = -1
      favouritesCopy.splice(index, 1)
      for(let i=0; i<favouritesVerbatimCopy.length; i++){
        if(favouritesVerbatimCopy[i]._id === val){
          favouriteVerbatimIndex = i
        }
      }
      favouritesVerbatimCopy.splice(favouriteVerbatimIndex, 1);
      this.setState({ //add newly favourited result to favourites
        favourites: favouritesCopy,
        favouritesVerbatim: favouritesVerbatimCopy
      })
    } else { //remove favourited object from favourites and return star color back to grey
      this.state.results
        .filter((result => result._id === val))
        .map((result) => {
            return this.setState({
              favourites: this.state.favourites.concat([val]),
              favouritesVerbatim: this.state.favouritesVerbatim.concat(result)
            })
        })
    }
  }

  render() {
    const searchFieldText = this.state.searchField;
    const { results, whatToRender, favourites, favouritesVerbatim, isBadInput } = this.state;
    return (
      <div className="app">
        <div className="app-header">
          <header className="header" >
            <h1>Toronto Waste Lookup Test</h1>
          </header>
          <SearchBar
            isBadInput={isBadInput}
            keyPress={this.handleKeyPress}
            onInputChange={this.handleInputChange}
            onSearchSubmit={this.handleInputSubmit}
            value={searchFieldText}
          />
        </div>
        <div className="app-body">
          <div className="searchresults">
            <SearchResults
              favourites={favourites}
              handleClick={this.handleStarClick}
              results={results}
              whatToRender={whatToRender}
            />
          </div>
          <div className="favourites">
            <div className="fav-content">
              <h1>Favourites</h1>
              <SearchResults
                results={favouritesVerbatim}
                whatToRender={
                  favourites.length > 0 ? 'results' : null
                }
                favourites={favourites}
                handleClick={this.handleStarClick}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
