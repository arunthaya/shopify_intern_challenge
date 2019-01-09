import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import SearchBar from './Components/SearchBar';

class App extends Component {

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = { searchField: ''};
  }

  handleInputChange(text){
    this.setState({searchField: text});
  }

  /*
  componentDidMount(){
    if (!('indexedDB' in window)) {
      console.log('This browser doesn\'t support IndexedDB');
    }
    this.fetchData()
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  
  fetchData = async () => {
    const response = await fetch('/api/hello');
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message)

    return body;
  }*/

  render() {
    const searchFieldText = this.state.searchField;

    return (
      <div className="App">
        <header className="App-header">
          <h1>Toronto Waste Lookup</h1>
        </header>
        < SearchBar 
            value={searchFieldText} 
            onInputChange={this.handleInputChange} />
      </div>
    );
  }
}

export default App;
