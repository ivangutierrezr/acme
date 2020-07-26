import React, { Component } from 'react'
import './login.css'
import axios from 'axios'

import LoginBox from './LoginBox'

export default class Login extends Component {
  componentWillMount() {
    document.body.style.backgroundImage = "url('./assets/background_login.jpg')"
  }
  ejecutarScript = () => {
    console.log("entró")
    axios.get('http://localhost:8080/funcionAuxiliar')
      .then(function (response) {
        console.log(response.data.message)
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  render() {
    return(
      <div className="login_container">
        <div className="titulo_login">
          <img src="./assets/logo.png" alt="logo acme inc" className="logoHome"/>
        </div>
        <div className="container_cajas_login">
          <LoginBox />
        </div>
        {/* <div className="row rowCenter">
          <button className="btn blueNav" onClick={() => this.ejecutarScript()}>Ejecutar Script</button>
        </div> */}
      </div>
    )
  }
}
