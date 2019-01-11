import React, { Component } from 'react';
import SearchBar from './Components/SearchBar';
import SearchResults from './Components/SearchResults';
import Favourites from './Components/Favourites';
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
      results: [],
      prevSearch: '',
      whatToRender: null,
      badInput: false
    };
  }

  handleInputChange(text){
    this.setState({searchField: text});
    let searchFieldCurrent = this.state.searchField.slice();
    let x = [];
    if(searchFieldCurrent.trim() === ''){
      this.setState({results: x, whatToRender: null});
    }
  }

  handleKeyPress(e){
    if(e.keyCode === 13){
      this.handleInputSubmit();
    }
  }

  handleInputSubmit(){
    const { searchField, prevSearch } = this.state;
    if( searchField.trim() === prevSearch){
      return;
    }
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
          this.setState({
            results: [...x],
            whatToRender: 'results'
          })
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
    const response = await fetch('/api/hello');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message)
    return body;
  }

  handleStarClick(val){
    let favouritesCopy = [...this.state.favourites];
    let index = favouritesCopy.indexOf(val);
    if (index !== -1){
      favouritesCopy.splice(index, 1);
      this.setState({
        favourites: favouritesCopy
      });
    } else {
      this.setState({
        favourites: this.state.favourites.concat([val])
      });
    }
  }

  render() {
    const searchFieldText = this.state.searchField;
    const { results, whatToRender, favourites } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>Toronto Waste Lookup</h1>
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
          <Favourites />
        </div>
      </div>
    );
  }
}

export default App;
