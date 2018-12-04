import React, { Component } from "react";
import axios from "axios";

//import authors from "./data.js";

// Components
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";
import AuthorsList from "./AuthorsList";
import AuthorDetail from "./AuthorDetail";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentAuthor: {},
      filteredAuthors: [],
      authors: [],
      loading: true
    };
    this.selectAuthor = this.selectAuthor.bind(this);
    this.unselectAuthor = this.unselectAuthor.bind(this);
    this.filterAuthors = this.filterAuthors.bind(this);
  }
  componentDidMount() {
    axios
    .get("https://the-index-api.herokuapp.com/api/authors/")
    .then(res => res.data)
    .then(authorData => this.setState({authors: authorData, loading:false}))
    .catch(err => console.log(err))
  }
  selectAuthor(author) {

    axios.get(`https://the-index-api.herokuapp.com/api/authors/${author.id}/`)
    .then(this.setState({loading:true}))
    .then(res => res.data)
    .then(author => this.setState({currentAuthor:author, loading:false}))
    .catch(err => console.log(err))
    
  }

  unselectAuthor() {
    this.setState({ currentAuthor: {} });
  }

  filterAuthors(query) {
    query = query.toLowerCase();
    let filteredAuthors = this.state.authors.filter(author => {
      return `${author.first_name} ${author.last_name}`.includes(query);
    });
    this.setState({ filteredAuthors: filteredAuthors });
  }

  getContentView() {
    if (this.state.currentAuthor.first_name) {
      return <AuthorDetail author={this.state.currentAuthor} />;
    } else if(!this.state.loading) {
      return (
        <AuthorsList
          authors={this.state.authors}
          selectAuthor={this.selectAuthor}
        />
      );
    }
    else
      return (

      <p>POTATO</p>)
  }

  render() {
    return (
      <div id="app" className="container-fluid">
        <div className="row">
          <div className="col-2">
            <Sidebar unselectAuthor={this.unselectAuthor} />
          </div>
          <div className="content col-10">
            <SearchBar filterAuthors={this.filterAuthors} />
            {this.getContentView()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
