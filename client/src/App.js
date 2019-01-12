import React, { Component } from 'react';
import SearchBar from './Components/SearchBar';
import SearchResults from './Components/SearchResults';
import helpers from './utilities/StringHelper';
import './App.css';



class App extends Component {

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.handleStarClick = this.handleStarClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.state = {
      searchField: '',
      favourites: [],
      favouritesVerbatim: [],
      results: [],
      prevSearch: '',
      whatToRender: null,
      badInput: false
    };
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
    );
  }

  handleKeyPress(e){
    if(e.keyCode === 13){
      this.handleInputSubmit();
    }
  }

  handleInputSubmit(){
    const { searchField, prevSearch, results } = this.state;
    helpers.isSameSearch(searchField, prevSearch, results);
    this.setState({
      whatToRender: 'isLoading',
      prevSearch: searchField.trim()
    }, () => {
      this.fetchData()
        .then(
        res => {
          console.log(res);
          let x = [];
          x = res.body;
          if(res.body.length === 0){
            this.setState({
              results: [...x],
              whatToRender: 'noresults'
            });
          } else {
            this.setState({
              results: [...x],
              whatToRender: 'results'
            });
          }
        })
      .catch(err => this.setState({results: err, whatToRender: 'error'}));
    });
  }

  componentDidMount(){
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB');
    }
  }


  fetchData = async () => {
    console.log(`req made`);
    const response = await fetch(`/api/search?keywords=${this.state.searchField}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message)
    return body;
  }

  handleStarClick(val){
    let favouritesCopy = [...this.state.favourites];
    let favouritesVerbatimCopy = [...this.state.favouritesVerbatim];
    let index = favouritesCopy.indexOf(val);
    if (index !== -1){
      let favouriteVerbatimIndex = -1;
      favouritesCopy.splice(index, 1);
      for(let i=0; i<favouritesVerbatimCopy.length; i++){
        console.log(favouritesVerbatimCopy[i]._id);
        if(favouritesVerbatimCopy[i]._id == val){
          console.log('true')
          favouriteVerbatimIndex = i;
        }
      }
      favouritesVerbatimCopy.splice(favouriteVerbatimIndex, 1);
      console.log(favouritesVerbatimCopy);
      this.setState({
        favourites: favouritesCopy,
        favouritesVerbatim: favouritesVerbatimCopy
      });
    } else {
      let resultToBeStored = {};
      this.state.results.map((result) => {
        if(result._id === val){
          this.setState({
            favourites: this.state.favourites.concat([val]),
            favouritesVerbatim: this.state.favouritesVerbatim.concat(result)
          });
        }
      })
    }
  }

//alphabetize css and this, utility.js file , and stick to the same name make it significiant
  render() {
    const searchFieldText = this.state.searchField;
    const { results, whatToRender, favourites, favouritesVerbatim } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>Toronto Waste Lookup Test</h1>
        </header>
        <SearchBar
          value={searchFieldText}
          onInputChange={this.handleInputChange}
          onSearchSubmit={this.handleInputSubmit}
          keyPress={this.handleKeyPress} />
        <div className="App-searchresults">
          <SearchResults results={results} whatToRender={whatToRender} handleClick={this.handleStarClick} favourites={favourites}/>
        </div>
        <div className="App-favourites">
          <h1>Favourites</h1>
          <SearchResults
            results={favouritesVerbatim}
            whatToRender={
              favourites.length > 0 ? 'results' : null
            }
            handleClick={this.handleStarClick}
            favourites={favourites}/>
        </div>
      </div>
    );
  }
}

export default App;
