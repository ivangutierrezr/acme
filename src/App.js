import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route, HashRouter, Link
} from 'react-router-dom'
import axios from 'axios'
import './App.css'
import '../node_modules/sweetalert/dist/sweetalert.css'
import Login from './login'
import Admin from './admin'
import Vendedor from './vendedor'

/* import webdriver from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome'
import firefox from 'selenium-webdriver/firefox' */

/* const {Builder, By, Key, until} = require('selenium-webdriver'); */
/* const { chrome } = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox'); */
/* 
let driver = new webdriver.Builder()
    .forBrowser('firefox')
    .setChromeOptions()
    .setFirefoxOptions()
    .build(); */

/* chrome.setDefaultService(new chrome.ServiceBuilder('../opt/chrome/chromedriver.exe').build());

const {Builder} = require('selenium-webdriver');

(async function myFunction() {
  let driver = await new Builder().forBrowser('chrome').build();
  //your code inside this block
})(); */

class App extends Component {
  state = {
    infoCargada: true
  }
  
  componentWillMount() {
    const self = this
  }

  render() {
    return (
      <Router>
        {
          this.state.infoCargada && <HashRouter>
            <div>
              <Route path="/" exact component={Login} />
              <Route path="/admin" exact component={Admin} />
              <Route path="/home" exact component={Vendedor} />
            </div>
          </HashRouter>
        }
      </Router>
    )
  }
}

export default App;
