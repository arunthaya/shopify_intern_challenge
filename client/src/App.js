import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import SearchBar from './Components/SearchBar';

function SwitchComponent({text, stateConditional}){
  console.log(text);
  switch(stateConditional){
    case 'error':
      return <h3>{text.message}</h3>;
    case 'isLoading':
      return <h3>Loading</h3>;
    case 'results':
      return (
        text.map( (number) => 
          <TestList 
            key={number._id} 
            title={number.title}
            textToDisplay={number.body}/>));
    default:
      return null;
  }
}


function TestList(props){
  return(
    <React.Fragment>
    <tr>
      <td>{props.title}</td>
      <td>{props.textToDisplay}</td>
    </tr>
    </React.Fragment>
  );
}

class App extends Component {

  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.state = { 
      searchField: '',
      favourites: [],
      results: [],
      isLoading: false,
      prevSearch: '',
      whatToRender: null,
      badInput: false
    };
  }

  handleInputChange(text){
    this.setState({searchField: text});
    let searchFieldCurrent = this.state.searchField.slice();
    let x = [];
    if(searchFieldCurrent.trim() == ''){
      this.setState({results: x, whatToRender: null});
    }
  }

  //TODO - ADD FUNCTION TO TEST FOR EMPTY STRING 

  handleInputSubmit(){
    const { searchField, prevSearch } = this.state;
    if( searchField.trim() == prevSearch){
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
            results: this.state.results.concat(...x),
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


  render() {
    const searchFieldText = this.state.searchField;
    const arrayOfNumbers = this.state.results;
    const { isLoading, results, error, whatToRender } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h1>Toronto Waste Lookup</h1>
        </header>
        <SearchBar
          value={searchFieldText}
          onInputChange={this.handleInputChange}
          onSearchSubmit={this.handleInputSubmit} />
        <div className="App-searchresults">
          <SwitchComponent text={results} stateConditional={whatToRender}/>
        </div>
      </div>
    );
  }
}

export default App;
