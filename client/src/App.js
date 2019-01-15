import React, { Component } from 'react'
import SearchBar from './components/SearchBar.jsx'
import SearchResults from './components/SearchResults.jsx'
import helpers from './utilities/StringHelper'
import './App.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleInputSubmit = this.handleInputSubmit.bind(this)
    this.handleStarClick = this.handleStarClick.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.state = {
      searchField: '',
      favourites: [],
      favouritesVerbatim: [],
      results: [],
      prevSearch: '',
      whatToRender: null,
      isBadInput: false
    }
  }

  handleInputChange(text){
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

  handleKeyPress(e){
    if(e.keyCode === 13){
      this.handleInputSubmit()
    } else {
      this.setState({
        isBadInput: false
      })
    }
  }

  handleInputSubmit(){
    const { searchField, prevSearch, results } = this.state;
    console.log(helpers.isSameSearch(searchField, prevSearch, results) === true)
    if (helpers.isSameSearch(searchField, prevSearch, results) === true){
      return this.setState({
        isBadInput: true
      })
    }
    this.setState({
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
              whatToRender: 'results'
            })
          }
        })
      .catch(err => this.setState({results: err, whatToRender: 'error'}))
    })
  }

  componentDidMount(){
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB')
    }
  }

  fetchData = async () => {
    const response = await fetch(`/api/search?keywords=${this.state.searchField}`)
    const body = await response.json()
    if (response.status !== 200) {
      console.log(body)
      throw Error(body.error)
    }
    return body
  }

  handleStarClick(val){
    let favouritesCopy = [...this.state.favourites];
    let favouritesVerbatimCopy = [...this.state.favouritesVerbatim];
    let index = favouritesCopy.indexOf(val);
    if (index !== -1){
      let favouriteVerbatimIndex = -1
      favouritesCopy.splice(index, 1)
      for(let i=0; i<favouritesVerbatimCopy.length; i++){
        if(favouritesVerbatimCopy[i]._id === val){
          favouriteVerbatimIndex = i
        }
      }
      favouritesVerbatimCopy.splice(favouriteVerbatimIndex, 1);
      this.setState({
        favourites: favouritesCopy,
        favouritesVerbatim: favouritesVerbatimCopy
      })
    } else {
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
            onInputChange={this.handleInputChange}
            onSearchSubmit={this.handleInputSubmit}
            keyPress={this.handleKeyPress}
            value={searchFieldText}
          />
        </div>
        <div className="app-body">
          <div className="searchresults">
            <SearchResults
              results={results}
              whatToRender={whatToRender}
              handleClick={this.handleStarClick}
              favourites={favourites}
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
                handleClick={this.handleStarClick}
                favourites={favourites}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
