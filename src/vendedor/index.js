import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import './vendedor.css'
import { Tabs, Radio } from 'antd';
const { TabPane } = Tabs;
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormVenta from '../formVenta';
import SweetAlert from 'sweetalert-react'

export default class Vendedor extends Component {
  state = {
    swal: {
      swalShow: false,
      swalTitle: "",
      swalMessage: "",
      swalCancel: false,
      swalHtml: false,
      swalType: "info"
    },
  }
  openSwal = (mensaje, funcion, title = 'Lo Sentimos') => {
    if (funcion === 0) {
      const swal = {
        swalTitle: title,
        swalMessage: mensaje,
        swalShow: true,
        swalFunction: funcion,
        swalCancel: false,
        swalHtml: false,
        swalType: "error"
      }
      this.setState({
        swal: swal
      })
    }
    if (funcion === 1 || funcion === 10) {
      const swal = {
        swalTitle: title,
        swalMessage: mensaje,
        swalShow: true,
        swalFunction: funcion,
        swalCancel: false,
        swalHtml: false,
        swalType: "success"
      }
      this.setState({
        swal: swal
      })
    }
    if (funcion === 2) {
      const swal = {
        swalTitle: title,
        swalMessage: mensaje,
        swalShow: true,
        swalFunction: funcion,
        swalCancel: false,
        swalHtml: false,
        swalType: "info"
      }
      this.setState({
        swal: swal
      })
    }
    if (funcion === 3 || funcion === 11) {
      const swal = {
        swalTitle: title,
        swalMessage: mensaje,
        swalShow: true,
        swalFunction: funcion,
        swalCancel: true,
        swalHtml: false,
        swalType: "warning"
      }
      this.setState({
        swal: swal
      })
    }
    if (funcion === 12) {
      const swal = {
        swalTitle: title,
        swalMessage: mensaje,
        swalShow: true,
        swalFunction: funcion,
        swalCancel: false,
        swalHtml: false,
        swalType: "warning"
      }
      this.setState({
        swal: swal
      })
    }
  }
  componentWillMount() {
    const self = this
    axios.get('http://localhost:8080/api/loggedin')
    // axios.get('http://localhost:8080/api/loggedinPruebas')
      .then(function (response) {
        if (response.data.codigo === 0) {
          self.openSwal("Debe iniciar sesión para acceder a la aplicación", 12, "Atención")
        }
        if (response.data.codigo === 1) {
          console.log(response.data.usuario)
          self.setState({
            usuario: response.data.usuario,
            infoCargada: true
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    this.setState({ infoCargada: true })
  }
  logout = () => {
    const self = this
    axios.post('http://localhost:8080/api/logout')
      .then(function (resp) {
        self.openSwal("Sesión cerrada exitosamente", 10, "Correcto")
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  cerrarSesion = () => {
    this.openSwal("¿Desea cerrar sesión?", 11, "Atención")
  }
  render() {
    return (
      <div className="contentVendedor">
        {
          this.state.sesionCerrada && <Redirect to={{ pathname: '/' }} />
        }
        {
          this.state.infoCargada && <div className='header'>
            <div className="logoContainer">
              <img src="assets/logo.png" alt="" className="grayscale" />
            </div>
            <span className="tituloPagina">Menú Usuario</span>
            <div className='buttonsNav'>
              <a title='Cerrar Sesión' onClick={() => this.cerrarSesion()}><FontAwesomeIcon size='2x' color='white' icon='sign-out-alt' /></a>
            </div>
          </div>
        }
        {
          this.state.infoCargada && <Tabs className="tabsMenu" defaultActiveKey="1" tabPosition="left">
            <TabPane tab="Generar Venta" key="1">
              <div className="mainContainer">
                <span className="titleContainer">Generar Venta</span>
                <FormVenta usuario={this.state.usuario} />
              </div>
            </TabPane>
          </Tabs>
        }
        <SweetAlert
          show={this.state.swal.swalShow}
          title={this.state.swal.swalTitle}
          text={this.state.swal.swalMessage}
          html={this.state.swal.swalHtml}
          type={this.state.swal.swalType}
          confirmButtonText='Aceptar'
          cancelButtonText='Cancelar'
          showCancelButton={this.state.swal.swalCancel}
          onConfirm={() => {
            if (this.state.swal.swalFunction === 0) {
              const swal = {
                swalShow: false,
                swalTitle: "",
                swalMessage: "",
                swalCancel: false,
                swalHtml: false,
                swalType: "info"
              }
              this.setState({
                swal: swal
              })
            }
            if (this.state.swal.swalFunction === 1) {
              const swal = {
                swalShow: false,
                swalTitle: "",
                swalMessage: "",
                swalCancel: false,
                swalHtml: false,
                swalType: "info"
              }
              this.setState({
                swal: swal
              })
            }
            if (this.state.swal.swalFunction === 10) {
              const swal = {
                swalShow: false,
                swalTitle: "",
                swalMessage: "",
                swalCancel: false,
                swalHtml: false,
                swalType: "info"
              }
              this.setState({
                swal: swal,
                sesionCerrada: true
              })
            }
            if (this.state.swal.swalFunction === 11) {
              this.logout()
            }
            if (this.state.swal.swalFunction === 12) {
              const swal = {
                swalShow: false,
                swalTitle: "",
                swalMessage: "",
                swalCancel: false,
                swalHtml: false,
                swalType: "info"
              }
              this.setState({
                swal: swal,
                sesionCerrada: true
              })
            }
          }}
          onCancel={() => {
            if (this.state.swal.swalFunction === 11) {
              const swal = {
                swalShow: false,
                swalTitle: "",
                swalMessage: "",
                swalCancel: false,
                swalHtml: false,
                swalType: "info"
              }
              this.setState({
                swal: swal
              })
            }
          }}
        />
      </div>
    )
  }
}
