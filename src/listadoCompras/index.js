import React, { Component } from 'react'
import SweetAlert from 'sweetalert-react'
import axios from 'axios'
import { Table, Button, Input, Icon, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import moment from 'moment';

const dateFormat = 'DD/MM/YYYY';

export default class ListadoCompras extends Component {
  state = {
    swal: {
      swalShow: false,
      swalTitle: "",
      swalMessage: "",
      swalCancel: false,
      swalHtml: true,
      swalType: "info"
    },
    compras: [],
    comprasOriginales: [],
  }
  componentWillMount() {
    const self = this
    axios.get('http://localhost:8080/cargarCompras')
      .then(function (response) {
        console.log(response.data.compras)
        self.setState({
          compras: response.data.compras,
          comprasOriginales: response.data.compras,
        })
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  openSwal = (mensaje, funcion, title = 'Lo Sentimos') => {
    if (funcion === 0) {
      const swal = {
        swalTitle: title,
        swalMessage: mensaje,
        swalShow: true,
        swalFunction: funcion,
        swalCancel: false,
        swalHtml: true,
        swalType: "error"
      }
      this.setState({
        swal: swal
      })
    }
    if (funcion === 1) {
      const swal = {
        swalTitle: title,
        swalMessage: mensaje,
        swalShow: true,
        swalFunction: funcion,
        swalCancel: false,
        swalHtml: true,
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
        swalHtml: true,
        swalType: "info"
      }
      this.setState({
        swal: swal
      })
    }
    if (funcion === 3) {
      const swal = {
        swalTitle: title,
        swalMessage: mensaje,
        swalShow: true,
        swalFunction: funcion,
        swalCancel: true,
        swalHtml: true,
        swalType: "warning"
      }
      this.setState({
        swal: swal
      })
    }
  }

  _renderCompras = () => {
    let data = []
    for (let p = 0; p < this.state.compras.length; p++) {
      const compra = this.state.compras[p];
      let newFecha = new Date(compra.fechacompra)
      let day = newFecha.getDate()
      if (day < 10) {
        day = "0" + day
      }
      let month = newFecha.getMonth() + 1
      if (month < 10) {
        month = "0" + month
      }
      let year = newFecha.getFullYear()
      let fechacompra = day + "/" + month + "/" + year
      let objCompra = {
        key: p,
        _id: compra._id,
        idproducto: compra.idproducto,
        nombre: compra.nombre,
        fechacompra: fechacompra,
        cantidadcompra: compra.cantidadcompra,
        preciocompra: '$ ' + compra.preciocompra.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
      data.push(objCompra)
    }
    return data
  }
  
  eliminarCompra = () => {
    const self = this
    let indexCompra = this.state.comprasOriginales.findIndex(comp => comp._id == this.state.compraEliminar)
    let compra = this.state.comprasOriginales[indexCompra]
    axios.post('http://localhost:8080/eliminarCompra', compra)
      .then(function (response) {
        self.setState({
          compras: response.data.compras,
          comprasOriginales: response.data.compras,
        })
        self.openSwal(response.data.message, 1, "Correcto")
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  render() {
    return (
      <div className="contentForms">
        {
          this.state.compras.length > 0 && <div className="gridFormVentaUno">
            <div className="item title">Buscar Compras Por Producto</div>
            <div className="item">
              <Input
                style={{ width: '100%' }}
                prefix={<Icon type="search" style={{ color: '#08AD49' }} />}
                placeholder="Digite el nombre del compra"
                onChange={(ele) => {
                  let value = ele.target.value
                  const data = this.state.comprasOriginales
                  const newData = data.filter((item) => {
                    const itemData = item.nombre.toUpperCase()
                    const textData = value.toUpperCase()
                    return itemData.indexOf(textData) > -1
                  })
                  if (value === "" || value === null) {
                    this.setState({
                      compras: this.state.comprasOriginales
                    })
                  }
                  else {
                    this.setState({
                      compras: newData,
                    })
                  }
                }}
              />
            </div>
          </div>
        }
        {
          this.state.compras.length > 0 ? <Table
            bordered
            style={{ width: '100%', marginTop: '5px' }}
            columns={[
              {
                title: 'Cód',
                dataIndex: 'idproducto',
                key: 'idproducto',
              },
              {
                title: 'Producto',
                dataIndex: 'nombre',
                key: 'nombre',
              },
              {
                title: 'Fecha de compra',
                dataIndex: 'fechacompra',
                key: 'fechacompra',
              },
              {
                title: 'Cantidad',
                dataIndex: 'cantidadcompra',
                key: 'cantidad',
              },
              {
                title: 'Precio de compra',
                dataIndex: 'preciocompra',
                key: 'preciocompra',
                className: 'column-money'
              },
              {
                title: '', dataIndex: '', key: 'z', render: (record) => <div className="itemButtons">
                  <FontAwesomeIcon title="Eliminar Compra" size='2x' color='#D9534E' icon='trash-alt' onClick={() => {
                      this.setState({
                        compraEliminar: record._id
                      })
                      this.openSwal("¿Desea eliminar este compra?<br><br>La información no podrá ser recuperada posteriormente", 3, "Atención")
                    }}
                  />
                </div>
              }
            ]}
            size="small"
            dataSource={this._renderCompras()}
            pagination={10}
          /> : <span>No se encuentran compras</span>
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
            if (this.state.swal.swalFunction === 0 || this.state.swal.swalFunction === 1) {
              const swal = {
                swalShow: false,
                swalTitle: "",
                swalMessage: "",
                swalCancel: false,
                swalHtml: true,
                swalType: "info"
              }
              this.setState({
                swal: swal
              })
            }
            if (this.state.swal.swalFunction === 3) {
              this.eliminarCompra()
            }
          }}
          onCancel={() => {
            if (this.state.swal.swalFunction === 3) {
              const swal = {
                swalShow: false,
                swalTitle: "",
                swalMessage: "",
                swalCancel: false,
                swalHtml: true,
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
