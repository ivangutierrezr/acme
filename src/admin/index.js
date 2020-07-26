import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import './admin.css'
import { Tabs, Radio } from 'antd';
const { TabPane } = Tabs;
import SweetAlert from 'sweetalert-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import InventarioProductos from '../inventarioProductos'
import ListadoClientes from '../listadoClientes';
import FormVenta from '../formVenta';
import ListadoVentas from '../listadoVentas';
import ListadoCompras from '../listadoCompras';

export default class Admin extends Component {
  state = {
    swal: {
      swalShow: false,
      swalTitle: "",
      swalMessage: "",
      swalCancel: false,
      swalHtml: false,
      swalType: "info"
    },
    tabActiva: 1
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
    if (funcion === 12 || funcion === 13) {
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
    axios.get('http://localhost:8080/api/loggedinAdmin')
    // axios.get('http://localhost:8080/api/loggedinAdminPruebas')
      .then(function (response) {
        if (response.data.codigo === 0) {
          self.openSwal("Debe iniciar sesión para acceder a la aplicación", 12, "Atención")
        }
        if (response.data.codigo === 1) {
          self.setState({
            usuario: response.data.usuario,
            infoCargada: true
          })
        }
        if (response.data.codigo === 2) {
          self.openSwal("No se puede acceder a esta sección de la aplicación desde el usuario Vendedor", 13, "Atención")
        }
      })
      .catch(function (error) {
        console.log(error);
      })
      this.setState({infoCargada: true})
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
      <div className="contentAdmin">
        {
          this.state.sesionCerrada && <Redirect to={{ pathname: '/' }} />
        }
        {
          this.state.vendedor && <Redirect to={{ pathname: '/home' }} />
        }
        {
          this.state.infoCargada && <div className='header'>
            <div className="logoContainer">
              <img src="assets/logo.png" alt="" className="grayscale" />
            </div>
            <span className="tituloPagina">Menú Administrador</span>
            <div className='buttonsNav'>
              <a title='Cerrar Sesión' onClick={() => this.cerrarSesion()}><FontAwesomeIcon size='2x' color='white' icon='sign-out-alt' /></a>
            </div>
          </div>
        }
        {
          this.state.infoCargada && <Tabs className="tabsMenu" defaultActiveKey="1" tabPosition="left" onChange={(activeKey) => {
            console.log(parseInt(activeKey))
            this.setState({ tabActiva: parseInt(activeKey) })
          }}>
            <TabPane tab="Inventario de Productos" key="1">
              {
                this.state.tabActiva == 1 && <div className="mainContainer">
                  <span className="titleContainer">Inventario de Productos</span>
                  <InventarioProductos />
                </div>
              }
            </TabPane>
            {/* <TabPane tab="Listado de Compras" key="2">
              {
                this.state.tabActiva == 2 && <div className="mainContainer">
                  <span className="titleContainer">Listado de Compras</span>
                  <ListadoCompras />
                </div>
              }
            </TabPane>
            <TabPane tab="Listado de Clientes" key="3">
              {
                this.state.tabActiva == 3 && <div className="mainContainer">
                  <span className="titleContainer">Listado de Clientes</span>
                  <ListadoClientes />
                </div>
              }
            </TabPane>
            <TabPane tab="Generar Venta" key="4">
              {
                this.state.tabActiva == 4 && <div className="mainContainer">
                  <span className="titleContainer">Generar Venta</span>
                  <FormVenta usuario={this.state.usuario}/>
                </div>
              }
            </TabPane>
            <TabPane tab="Informe de Ventas" key="5">
              {
                this.state.tabActiva == 5 && <div className="mainContainer">
                  <span className="titleContainer">Informe de Ventas</span>
                  <ListadoVentas openSwal={this.openSwal}/>
                </div>
              }
            </TabPane> */}
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
            if (this.state.swal.swalFunction === 13) {
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
                vendedor: true
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
