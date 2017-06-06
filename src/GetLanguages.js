/**
 * @module src/GetLanguages
 *
 * Component that display SourceDocument
 * Accepts the only authentication token in header
*/

import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import $ from 'jquery';

class GetLanguages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      getLanguages: '',
      getBooks: '',
      language: '',
      version: ''
    }
      // Upload file specific callback handlers
      this.getLanguages = this.getLanguages.bind(this);
      this.getBooks = this.getBooks.bind(this);
      // this.getBookData = this.getBookData.bind(this);
  }
  
  componentDidMount() {
      window.addEventListener('load', this.getLanguages);
  }
  
  getLanguages(e){
    e.preventDefault();
    let accessToken = JSON.parse(window.localStorage.getItem('access_token'))
     console.log(accessToken)
    var _this = this;
    $.ajax({
      url: "http://127.0.0.1:8000/v1/get_languages",
      contentType: "application/json; charset=utf-8",
      method : "POST",
      headers: {
                "Authorization": "bearer " + JSON.stringify(accessToken['access_token']).slice(1,-1)},
      success: function (result) {
        var getLang = JSON.parse(result);
        _this.setState({getLanguages: getLang.length > 0 ? getLang : []})
        for (var i = 0; i < getLang.length; i++) {
        }
      },
      error: function (error) {

      }
    });   
    
  }

  getBooks(e){

    e.preventDefault();
    
    var _this = this;

    let accessToken = JSON.parse(window.localStorage.getItem('access_token'))

    var data = {
      "language": "this.state.language", "version": "this.state.version"
    }

    $.ajax({
      url: "http://127.0.0.1:8000/v1/get_books",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(data),
      method : "POST",
      headers: {
                "Authorization": "bearer " + JSON.stringify(accessToken['access_token']).slice(1,-1)},
      success: function (result) {
        // var getBook = JSON.parse(result);
      },
      error: function (error) {
      }
    });     
  }

  
  render() {
    let currentLanguages = this.state.getLanguages.length > 0 ?  this.state.getLanguages : [];
    return(
      <div className="container">
        <Header/ >
        <div className="col-xs-12 col-md-6 col-md-offset-3">
          <form className="col-md-8 uploader" encType="multipart/form-data">
            <h1 className="source-header-lan">Available Source Texts</h1>&nbsp;
            <div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Language</th>
                    <th>Versions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentLanguages.map(function(data, index){
                    return (<tr key={index}><td>{data[0]}</td><td>{data[1]}</td>
                            <td><button data-lang={data[0]} data-ver={data[1]} >Show Book</button></td>
                            </tr>
                            );
                  })}
                </tbody>
              </table>
            </div>
          </form>
        </div>
        <Footer/>
      </div>
      );
    }
}

export default GetLanguages;
