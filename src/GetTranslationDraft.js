/**
 * @module src/GetTranslationDraft
 *
 * Component that display GetTranslationDraft
 * Accepts the following properties:
 *  - source language: Which language you want to convert from 
 *  - version : Version of source language
 *  - target language: In which tokens have been translated too
 *  - token words: token words showul be entered in the form of xls
*/

import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import { FormControl } from 'react-bootstrap';
import SourceLanguages from './SourceLanguages';
import TargetLanguages from './TargetLanguages';
import $ from 'jquery';
import GlobalURL from './GlobalURL';
import saveAs from 'save-as'
var JSZip = require("jszip");
var zip = new JSZip();

class GetTranslationDraft extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sourcelang:'tam',
      targetlang:'tam',
      version: '',
      revision: '',
      bookName: '',
      uploaded:'Uploading'
    }

      // Upload file specific callback handlers
      this.uploadFile = this.uploadFile.bind(this);
      this.onSelect = this.onSelect.bind(this);
      this.exportToUSFMFile = this.exportToUSFMFile.bind(this);
  }
  
  onSelect(e) {
    this.setState({
      [e.target.name]: e.target.value });
  }

  uploadFile(e){
    e.preventDefault();
    var _this = this
    var data = { 
            "sourcelang": this.state.sourcelang, "version": this.state.version, "revision": this.state.revision,  "targetlang": this.state.targetlang
          }
    let accessToken = JSON.parse(window.localStorage.getItem('access_token'))
    $.ajax({
      url: GlobalURL["hostURL"]+"/v1/translations",
      contentType: "application/json; charset=utf-8",
      data : JSON.stringify(data),
      method : "POST",
      headers: {
                "Authorization": "bearer " + JSON.stringify(accessToken['access_token']).slice(1,-1)},
      beforeSend: function () {
          $(".modal").show();
      },
      complete: function () {
          $(".modal").hide();
      },
      success: function (result) {
         if (result.success !== false) {
          _this.exportToUSFMFile(result)
          _this.setState({message: result.message, uploaded: 'success'})
        }else {
          _this.setState({message: result.message, uploaded: 'failure'})
          }
      },
      error: function (error) {
        _this.setState({uploaded: 'failure'}) 
      }
    });   
    
  }

  exportToUSFMFile(jsonData) {
    var _this = this;
    jsonData = JSON.parse(jsonData)
    let exportFileDefaultName = [];
    $.each(jsonData, function(key, value) {
      zip.file(key + '.usfm', value)
      exportFileDefaultName.push(key + '.usfm');
    });
    zip.generateAsync({type:"blob"})
      .then(function(content) {
          saveAs(content, _this.state.targetlang + '.zip');
      }, function(err){
         _this.setState({uploaded: 'failure'}) 
      })
  }

  render() {
    return(
      <div className="container">
        <Header/ >
        <div className="col-xs-12 col-md-6 col-md-offset-3">
          <form className="col-md-8 uploader" encType="multipart/form-data">
            <h1 className="source-header">Translation Draft</h1>&nbsp;
            <div className={"alert " + (this.state.uploaded === 'success'? 'alert-success' : 'invisible')}>
                <strong>Translation Done Successfully !!!</strong>
            </div>
            <div className={"alert " + (this.state.uploaded === 'failure'? 'alert-danger': 'invisible')}>
                <strong>Failed to Translate Sources !!!</strong>
            </div>
              <div className="form-group">
                <lable className="control-label"> <strong> Source Language </strong> </lable>
                    <FormControl value={this.state.sourcelang} onChange={this.onSelect} name="sourcelang" componentClass="select" placeholder="select">
                      {SourceLanguages.map((sourcelang, i) => <option  key={i} value={sourcelang.code}>{sourcelang.value}</option>)}
                    </FormControl>
              </div>&nbsp;
              <div className="form-group">
                <lable className="control-lable"> <strong> Ethnologue Code </strong> </lable>
                      <input value={this.state.sourcelang} onChange={this.onSelect} type="text" name="EthnologueCode" placeholder="tam" className="form-control"/>
              </div>&nbsp;
              <div className="form-group">
                <lable className="control-lable"> <strong> Version </strong> </lable>
                    <input value={this.state.version} onChange={this.onSelect} name="version" type="text"  placeholder="version" className="form-control" /> 
              </div>&nbsp;
              <div className="form-group">
                <lable className="control-lable"> <strong> Revision </strong> </lable>
                    <input value={this.state.revision} onChange={this.onSelect} name="revision" type="text" placeholder="revision" className="form-control"/> 
              </div>&nbsp;
              <div className="form-group">
                <lable className="control-label"> <strong> Target Language </strong> </lable>
                    <FormControl value={this.state.targetlang} onChange={this.onSelect} name="targetlang" componentClass="select" placeholder="select">
                      {TargetLanguages.map((targetlang, i) => <option  key={i} value={targetlang.code}>{targetlang.value}</option>)}
                    </FormControl>
              </div>&nbsp;
                <div className="form-group"> 
                  <button id="btnGet" type="button" className="btn btn-success sourcefooter" onClick={this.uploadFile}> Translate </button>&nbsp;&nbsp;&nbsp;
                </div>
                <div className="modal" style={{display: 'none'}}>
                    <div className="center">
                        <img src={require('./loader.gif')} />
                    </div>
                </div>
          </form>
          </div>
        <Footer/>
      </div>
      );
    }
}

export default GetTranslationDraft;
