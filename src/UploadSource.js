/**
 * @module src/UploadSource
 *
 * Component that display SourceDocument
 * Accepts the following properties:
 *  - language: Ethnologue code of the language
 *  - version: version of source language
 *  - base64_arr: file in the form of base64
*/

import React, { Component } from 'react';
import './App.css';
import Footer from './Footer';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router';
import ListLanguages from './Component/ListLanguages';
import $ from 'jquery';
import GlobalURL from './GlobalURL';
import Versions from './Component/Versions';

class Header extends Component {
  render() {
    return (
        <Navbar inverse collapseOnSelect fixedTop >
        <Navbar.Header><Navbar.Brand>
            <a href="/homepage">&nbsp;<span className='glyphicon glyphicon-home'></span>&nbsp;&nbsp;Autographa MT</a>
          </Navbar.Brand><Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse >
          <Nav className="customHeaderAdmin">
            <NavItem eventKey={1} ><Link to={'/createsource'}>Create Source</Link></NavItem>
            <NavItem eventKey={2} ><Link to={'/admin'}>Upload Source</Link></NavItem>
            <NavItem eventKey={3} ><Link to={'/homepage'}>Log out</Link></NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

class UploadSource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sourcelang:'',
      version: '',
      getVersions: [],
      base64_arr: [],
      uploaded:'Uploading',
      message: ''
    }

    // Upload file specific callback handlers
    this.uploadFile = this.uploadFile.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.file_base64 = this.file_base64.bind(this);
    this.onSelectSource = this.onSelectSource.bind(this);

  }

  onSelect(e) {
    this.setState({
      [e.target.name]: e.target.value });
  }

  file_base64(e){
    var files = document.getElementById('file-input').files
    var file = [];
    global.base64_arr = [];
    if(files.length > 0){
        for (var i = 0; i < files.length; i++) {
        var reader = new FileReader();
        reader.readAsDataURL(files[i] );
        reader.onload = (function (file) {
          return function (e) {
            var data = this.result;
            var unwantedData = "data:;base64,";
            data = data.replace(unwantedData, "");
            global.base64_arr.push(data);
          }
        })(file);
        reader.onerror = function (error) {
        };
      }
    }
    
  }

  //onSelectSource for Dynamic Versions
  onSelectSource(e) {

      this.setState({ Sourcelanguage: e.target.value });
      var _this = this;
      let accessToken = JSON.parse(window.localStorage.getItem('access_token')) 
      var data = { 
        "language": e.target.value
      }
      $.ajax({
        url: GlobalURL["hostURL"]+"/v1/version",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(data),
        method : "POST",
        headers: {
          "Authorization": "bearer " + accessToken
        },
        success: function (result) {
          var getVer = JSON.parse(result);
          _this.setState({getVersions: getVer.length > 0 ? getVer : []})
        },
        error: function (error) {
        }
      });
  }

  uploadFile(e){
    e.preventDefault();
    var ext = $('#file-input').val().split('.').pop().toLowerCase();
    if($.inArray(ext, ['usfm']) === -1) {
      this.setState({uploaded: 'success'})
    } else {
      this.setState({uploaded: 'failure'}) 
    } 

    var _this = this
    for(var i = 0; i < (global.base64_arr).length; i++){
      var data = { 
        "language": this.state.Sourcelanguage, "version": this.state.getVersions[0], "content": [global.base64_arr[i]]
      }
      
      let accessToken = JSON.parse(window.localStorage.getItem('access_token'));
      var countSuccess = 0;
      var countFailure = 0;

      $.ajax({
        url: GlobalURL["hostURL"]+"/v1/sources",
        contentType: "application/json; charset=utf-8",
        data : JSON.stringify(data),
        method : "POST",
        headers: {
                  "Authorization": "bearer " + accessToken
        },
      beforeSend: function () {
          $(".modal").show();
      },
        // eslint-disable-next-line
        success: function (result) {
        result = JSON.parse(result)
        if (result.success !== false) {
            countSuccess++;
          _this.setState({message: "Uploading ...... file no." + countSuccess, uploaded: 'success'})
          if((countSuccess + countFailure) === (global.base64_arr).length){  
            _this.setState({message: "Uploaded " + countSuccess + " files successfully", uploaded: 'success'})
            $(".modal").hide();
          }        
        }else {
          countFailure++;
          _this.setState({message: result.message, uploaded: 'failure'})
          if((countSuccess + countFailure) === (global.base64_arr).length){   
             _this.setState({message: "Uploaded " + countSuccess + " files successfully", uploaded: 'success'})
             $(".modal").hide();
          } 
        }
        }
      });
     } 
    }

  render() {
    return(
      <div className="container">
        <Header/ >
        <div className="col-xs-12 col-md-6 col-md-offset-3">
          <form className="col-md-8 uploader" encType="multipart/form-data">
            <h1 className="source-header">Upload Sources</h1>&nbsp;
            <div className={"alert " + (this.state.uploaded === 'success'? 'alert-success' : 'invisible')}>
                <strong>{this.state.message}</strong>
            </div>
            <div className={"alert " + (this.state.uploaded === 'failure'? 'alert-danger': 'invisible')}>
                <strong>{this.state.message}</strong>
            </div>
              <div className="form-group">
                <lable className="control-label"> <strong> Language Name </strong> </lable>
                <ListLanguages 
                  onChange={this.onSelectSource} 
                />
              </div>&nbsp;
              <div className="form-group">
                <lable className="control-lable"> <strong> Version </strong> </lable>
                <Versions 
                  version={this.state.getVersions} 
                />
              </div>&nbsp;
              <div className="form-group">
                <div className="form-control">
                  <input id="file-input" type="file" className="fileInput" onChange={this.file_base64} multiple />
                </div>&nbsp;
                <div className="form-group">
                  <button id="button" type="button" className="btn btn-success sourcefooter" onClick={this.uploadFile} disabled={!this.state.getVersions} ><span className="glyphicon glyphicon-upload"></span>&nbsp;&nbsp;Upload Source</button>&nbsp;&nbsp;&nbsp;
                  </div>
                  <div className="modal" style={{display: 'none'}}>
                    <div className="center">
                        <img alt="" src={require('./Images/loader.gif')} />
                    </div>
                  </div>
              </div>
          </form>
          </div>
        <Footer/>
      </div>
      );
    }
}

export default UploadSource;