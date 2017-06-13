/**
 * @module src/UITranslation
 *
 * Component that display SourceDocument
 * Accepts the following properties:
 *  - language: Ethnologue code of the language
 *  - version: Version of the language
 *  - revision: Autogenerated for each updation of this same source
*/

import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import { FormControl } from 'react-bootstrap';
import SourceLanguages from './SourceLanguages';
import $ from 'jquery';
import GlobalURL from './GlobalURL';

class UITranslation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      language: 'tam',
      version: '',
      revision: '',
      uploaded:'uploadingStatus',
      message: '',
      tokenKeys: []
    }
      // Upload file specific callback handlers
      this.onSelect = this.onSelect.bind(this);
      this.downloadTokenWords = this.downloadTokenWords.bind(this);
      this.getConcordances = this.getConcordances.bind(this);
  }
  
  onSelect(e) {
    this.setState({
      [e.target.name]: e.target.value });
  }

// For Downloads Token words
  downloadTokenWords(e){
    e.preventDefault();
    var _this = this
    var data = { 
        "language": this.state.language, "version": this.state.version, "revision": this.state.revision 
      }
    let accessToken = JSON.parse(window.localStorage.getItem('access_token'))

    $.ajax({
      url: GlobalURL["hostURL"]+"/v1/autotokens",
      contentType: "application/json; charset=utf-8",
      data : JSON.stringify(data),
      method : "POST",
      headers: {
                "Authorization": "bearer " + JSON.stringify(accessToken['access_token']).slice(1,-1),
      },
      success: function (result) {
        var jsonData = JSON.parse(result);
        _this.setState({message: result.message, uploaded: 'success', tokenKeys: jsonData})
      },
      error: function (error) {
       _this.setState({message: error.message, uploaded: 'failure'})
      }
    });  
  }

  getConcordances(key){
    var _this = this;
    console.log(key)
    var data = {
      "language": _this.state.language, "version": _this.state.version, "revision": _this.state.revision, "token": key
    }

    let accessToken = JSON.parse(window.localStorage.getItem('access_token'))
    
    $.ajax({
      url: GlobalURL["hostURL"]+"/v1/getconcordance",
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
    var _this = this;
    return(
      <div className="container">
        <Header/ >
          <h1 className="source-header">Get Concordance</h1>&nbsp;
            <div className={"alert " + this.state.uploaded === 'success'? 'alert-success' : 'invisible'}>
              <strong>{this.state.message}</strong>
            </div>
            <div className={"alert " + this.state.uploaded === 'failure'? 'alert-danger': 'invisible' }>
              <strong>{this.state.message}</strong>
            </div>
          <div className="row">
            <form className="col-lg-4 uploader" encType="multipart/form-data">
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
                  <button id="button" type="button" className="btn btn-success" onClick={this.downloadTokenWords}>Generate Concordance</button>&nbsp;&nbsp;&nbsp;&nbsp;
              </div>
            </form>
            <div className="col-lg-4">
              <table className="tokenWords table">
                <thead>
                  <tr>
                    <th>TokenWords</th>
                  </tr>
                </thead>
                <tbody>
                  { Object.keys(this.state.tokenKeys).map(function(obj, i){
                      return (<tr><td><a href="javascript:void(0);" onClick={_this.getConcordances.bind(this, obj)}>{obj}</a></td></tr>);
                    })
                  }
                </tbody>

              </table>
            </div>
            <div className="col-lg-4" >
            <lable className="control-lable"> <strong> Generated Concordance </strong> </lable>
              <textarea value="" type="text" id="get_concordances" name="get concordance" placeholder="Get Concordance" className="form-control textarea" />
            </div>
          </div>
         <Footer/>
      </div>
      );
    }
}

export default UITranslation;