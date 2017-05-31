/**
 * @module src/GetConcordances
 *
 * Component that display GetConcordances
 * Accepts the following properties:
 *  - language: Ethnologue code of the language
 *  - version: Content of all the source documents stored
 *  - revision : Returned as a response after authentication
*/

import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import { FormControl } from 'react-bootstrap';
import SourceLanguages from './SourceLanguages';
import $ from 'jquery';

class GetConcordances extends Component {
  constructor(props) {
    super(props);

    this.state = {
      language:'',
      version: '',
      revision: '',
      token: '',
      uploaded:'uploadingStatus',
    }
      // Upload file specific callback handlers
      this.onSelect = this.onSelect.bind(this);
      this.getConcordances = this.getConcordances.bind(this);
  }
  
  onSelect(e) {
    this.setState({
      [e.target.name]: e.target.value });
  }

//To get concordances for a particular token
  getConcordances(e){
    e.preventDefault();
    var _this = this
    var data = {
      "language": this.state.language, "version": this.state.version, "revision": this.state.revision, "token": this.state.token
    }

    let accessToken = JSON.parse(window.localStorage.getItem('access_token'))
    
    $.ajax({
      url: "https://api.mt2414.in/v1/getconcordance",
      contentType: "application/json; charset=utf-8",
      data : JSON.stringify(data),
      method : "POST",
      headers: {
                "Authorization": "bearer " + JSON.stringify(accessToken['access_token']).slice(1,-1),
      },
      success: function (result) {
        var text = ""
        $.each(JSON.parse(result), function (key, value) {
          _this.setState({uploaded:'success'})
            text+= key+ " -> " + value+ "\n";
        });
        $("#get_concordances").val(text);
      },
      error: function (error) {
        _this.setState({uploaded:'failure'}) 
      }
    });      
  }

  render() {
    return(
      <div className="container">
        <Header/ >
        <div className="col-xs-12 col-md-6 col-md-offset-3">
          <form className="col-md-8 uploader" encType="multipart/form-data">
            <h1 className="source-header">Get Concordances</h1>&nbsp;
            <div className={"alert " + (this.state.uploaded === 'success'? 'alert-success' : 'invisible')}>
              <strong>Found Concordances Successfully !!!</strong>
            </div>
            <div className={"alert " + (this.state.uploaded === 'failure'? 'alert-danger': 'invisible')}>
              <strong>Token does not exits in DB !!!</strong>
            </div>
              <div className="form-group">
                <lable className="control-label"> <strong> Language Name </strong> </lable>
                    <FormControl value={this.state.language} onChange={this.onSelect} name="language" componentClass="select" placeholder="select">
                      {SourceLanguages.map((language, i) => <option  key={i} value={language.code}>{language.value}</option>)}
                    </FormControl>
              </div>&nbsp;
              <div className="form-group">
                <lable className="control-lable"> <strong> Version </strong> </lable>
                    <input value={this.state.version} onChange={this.onSelect} name="version" type="text"  placeholder="version" className="form-control"/> 
              </div>&nbsp;
              <div className="form-group">
                <lable className="control-lable"> <strong> Revision </strong> </lable>
                    <input value={this.state.revision} onChange={this.onSelect} name="revision" type="text" placeholder="revision" className="form-control"/> 
              </div>&nbsp;
              <div className="form-group">
                <lable className="control-lable"> <strong>Token </strong> </lable>
                    <input value={this.state.token} onChange={this.onSelect} name="token" type="text"  placeholder="token" className="form-control"/> 
              </div>&nbsp;
              <div className="form-group">
                  <button id="button" type="button" className="btn btn-success sourcefooter" onClick={this.getConcordances}>Get Concordances</button>&nbsp;&nbsp;&nbsp;
              </div>
              <div className="form-group">
                <lable className="control-label"> Get Concordance </lable>
                <textarea value="" type="text" id="get_concordances" name="get concordance" placeholder="Get Concordance" className="form-control textarea" />
              </div>
          </form>
          </div>
        <Footer/>
      </div>
      );
    }
}

export default GetConcordances;
