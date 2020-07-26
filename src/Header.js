import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Header extends Component {
  render() {
    return(
      <header>
        <img src="" alt=""/>
        <h2 className="tituloPagina">
          {
            this.props.tituloPagina
          }
        </h2>
        <button title='Cerrar sesión' onClick={() => this.props.cerrarSesion()} className="btn_icon cancel icon-logout"></button>
      </header>
    )
  }
}
