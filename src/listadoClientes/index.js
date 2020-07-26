import React, { Component } from 'react'
import { Table, Button, Modal, Icon, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormClientes from '../formClientes'
import SweetAlert from 'sweetalert-react'
import axios from 'axios'
import moment from 'moment'

const dateFormat = 'DD/MM/YYYY'

export default class ListadoClientes extends Component {
  state = {
    clientes: [],
    clientesOriginales: [],
    swal: {
      swalShow: false,
      swalTitle: "",
      swalMessage: "",
      swalCancel: false,
      swalHtml: false,
      swalType: "info"
    },
    mostrarNuevoCliente: false,
    mostrarEditarCliente: false,
    nuevoCliente: {
      nombre: "",
      tipodocumento: "",
      numeroidentificacion: "",
      fechanacimiento: moment().subtract(18, 'years'),
      telefono: "",
      direccion: "",
      mayorista: true,
    },
    clienteEditar: {
      _id: '',
      nombre: "",
      tipodocumento: "",
      numeroidentificacion: "",
      fechanacimiento: moment().subtract(18, 'years'),
      telefono: "",
      direccion: "",
      mayorista: true,
    },
  }
  componentWillMount() {
    const self = this
    axios.get('http://localhost:8080/cargarClientes')
      .then(function (response) {
        self.setState({
          clientes: response.data.clientes,
          clientesOriginales: response.data.clientes,
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
        swalHtml: false,
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
    if (funcion === 3) {
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
  }
  _renderclientes = () => {
    let data = []
    for (let p = 0; p < this.state.clientes.length; p++) {
      const cliente = this.state.clientes[p];
      let mayorista = "Minorista"
      if (cliente.mayorista == true) {
        mayorista = "Mayorista"
      }
      let date = new Date(cliente.fechanacimiento)
      let day = date.getDate()
      if (day < 10) {
        day = "0" + day
      }
      let month = date.getMonth()+1
      if (month < 10) {
        month = "0" + month
      }
      let year = date.getFullYear()
      let fechanacimiento = day+"/"+month+"/"+year
      let objCliente = {
        key: p,
        _id: cliente._id,
        nombre: cliente.nombre,
        tipodocumento: cliente.tipodocumento,
        numeroidentificacion: cliente.numeroidentificacion,
        fechanacimiento: fechanacimiento,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        mayorista: mayorista,
      }
      data.push(objCliente)
    }
    return data
  }
  comprobarCedula = (valor) => {
    const self = this
    let cliente = {
      numeroidentificacion: valor
    }
    axios.post('http://localhost:8080/buscarClientePorCedula', cliente)
      .then(function (response) {
        if (response.data.codigo == 1) {
          let nuevoCliente = self.state.nuevoCliente
          nuevoCliente.numeroidentificacion = ""
          self.setState({
            nuevoCliente: nuevoCliente
          })
          self.openSwal("El número de identificación ingresado ya se encuentra registrado en la base de datos", 0, "Error")
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  editarNuevoCliente = (tipo, valor) => {
    let nuevoCliente = this.state.nuevoCliente
    if (tipo === 1) {
      nuevoCliente.nombre = valor
    }
    if (tipo === 2) {
      nuevoCliente.tipodocumento = valor
    }
    if (tipo === 3) {
      nuevoCliente.numeroidentificacion = valor
    }
    if (tipo === 4) {
      nuevoCliente.fechanacimiento = valor
    }
    if (tipo === 5) {
      nuevoCliente.telefono = valor
    }
    if (tipo === 6) {
      nuevoCliente.direccion = valor
    }
    if (tipo === 7) {
      nuevoCliente.mayorista = valor
    }
    this.setState({ nuevoCliente: nuevoCliente })
  }
  guardarNuevoCliente = () => {
    const self = this
    axios.post('http://localhost:8080/guardarCliente', this.state.nuevoCliente)
      .then(function (response) {
        self.setState({
          mostrarNuevoCliente: false,
          clientes: response.data.clientes,
          clientesOriginales: response.data.clientes,
          nuevoCliente: {
            nombre: "",
            tipodocumento: "",
            numeroidentificacion: "",
            fechanacimiento: moment().subtract(18, 'years'),
            telefono: "",
            direccion: "",
            mayorista: true,
          }
        })
        self.openSwal(response.data.message, 1, "Correcto")
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  editarCliente = (tipo, valor) => {
    let clienteEditar = this.state.clienteEditar
    if (tipo === 1) {
      clienteEditar.nombre = valor
    }
    if (tipo === 2) {
      clienteEditar.tipodocumento = valor
    }
    if (tipo === 3) {
      clienteEditar.numeroidentificacion = valor
    }
    if (tipo === 4) {
      clienteEditar.fechanacimiento = valor
    }
    if (tipo === 5) {
      clienteEditar.telefono = valor
    }
    if (tipo === 6) {
      clienteEditar.direccion = valor
    }
    if (tipo === 7) {
      clienteEditar.mayorista = valor
    }
    this.setState({ clienteEditar: clienteEditar })
  }
  guardarEdicionCliente = () => {
    const self = this
    axios.post('http://localhost:8080/editarCliente', this.state.clienteEditar)
      .then(function (response) {
        self.setState({
          mostrarEditarCliente: false,
          clientes: response.data.clientes,
          clientesOriginales: response.data.clientes,
          clienteEditar: {
            _id: '',
            nombre: "",
            tipodocumento: "",
            numeroidentificacion: "",
            fechanacimiento: moment().subtract(18, 'years'),
            telefono: "",
            direccion: "",
            mayorista: true,
          }
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
        <div className="contenButtons">
          <Button
            type="primary"
            size="default"
            icon="save"
            shape="round"
            onClick={() => this.setState({ mostrarNuevoCliente: true })}
          >Agregar Nuevo Cliente</Button>
        </div>
        {
          this.state.clientes.length > 0 && <div className="gridFormVentaUno">
            <div className="item title">Buscar Clientes Por Nombre</div>
            <div className="item">
              <Input
                style={{ width: '100%' }}
                prefix={<Icon type="search" style={{ color: '#08AD49' }} />}
                placeholder="Digite el nombre del cliente"
                onChange={(ele) => {
                  let value = ele.target.value
                  const data = this.state.clientesOriginales
                  const newData = data.filter((item) => {
                    const itemData = item.nombre.toUpperCase()
                    const textData = value.toUpperCase()
                    return itemData.indexOf(textData) > -1
                  })
                  if (value === "" || value === null) {
                    this.setState({
                      clientes: this.state.clientesOriginales
                    })
                  }
                  else {
                    this.setState({
                      clientes: newData,
                    })
                  }
                }}
              />
            </div>
          </div>
        }
        {
          this.state.clientes.length > 0 && <Table
            bordered
            style={{ width: '100%', marginTop: '15px' }}
            columns={[
              {
                title: 'Nombre',
                dataIndex: 'nombre',
                key: 'nombre',
                fixed: 'left',
                width: 200
              },
              {
                title: 'ID',
                dataIndex: 'numeroidentificacion',
                key: 'numeroidentificacion',
                fixed: 'left',
                width: 100
              },
              {
                title: 'Tipo ID',
                dataIndex: 'tipodocumento',
                key: 'tipodocumento',
                width: 80
              },
              {
                title: 'Fecha Nacimiento',
                dataIndex: 'fechanacimiento',
                key: 'fechanacimiento',
                width: 150
              },
              {
                title: 'Teléfono',
                dataIndex: 'telefono',
                key: 'telefono',
                width: 120
              },
              {
                title: 'Dirección',
                dataIndex: 'direccion',
                key: 'direccion'
              },
              {
                title: 'Tipo Cliente',
                dataIndex: 'mayorista',
                key: 'mayorista',
                fixed: 'right',
                width: 100
              },
              {
                title: '', 
                dataIndex: '', 
                key: 'x', 
                fixed: 'right', 
                width: 50, 
                render: (record) => <div className="itemButtons">
                  <FontAwesomeIcon title="Editar Cliente" size='2x' color='#DEC226' icon='edit' onClick={() => {
                    let indexCliente = this.state.clientesOriginales.findIndex(cliente => cliente._id == record._id)
                    if (indexCliente > -1) {
                      this.setState({
                        clienteEditar: this.state.clientesOriginales[indexCliente],
                        mostrarEditarCliente: true
                      })
                    }
                  }}
                  />
                </div>
              }
            ]}
            size="small"
            dataSource={this._renderclientes()}
            pagination={10}
            scroll={{ x: 1110 }}
          />
        }
        <Modal
          title="Agregar nuevo cliente"
          visible={this.state.mostrarNuevoCliente}
          okText="Guardar cliente"
          cancelText="Cancelar"
          onOk={() => {
            if (this.state.nuevoCliente.nombre == '' ||
                this.state.nuevoCliente.tipodocumento == '' ||
                this.state.nuevoCliente.numeroidentificacion == '' ||
                this.state.nuevoCliente.direccion == '' ||
                this.state.nuevoCliente.telefono == '') {
              this.openSwal("Todos los campos son obligatorios", 0, "Error")
            } else {
              this.guardarNuevoCliente()
            }
          }}
          onCancel={() => {
            this.setState({
              mostrarNuevoCliente: false,
              nuevoCliente: {
                nombre: "",
                tipodocumento: "",
                numeroidentificacion: "",
                fechanacimiento: moment().subtract(18, 'years'),
                telefono: "",
                direccion: "",
                mayorista: true,
              }
            });
          }}
        >
          <FormClientes editar={false} cliente={this.state.nuevoCliente} comprobarCedula={this.comprobarCedula} editarCliente={this.editarNuevoCliente} />
        </Modal>
        <Modal
          title="Editar cliente"
          visible={this.state.mostrarEditarCliente}
          okText="Guardar cliente"
          cancelText="Cancelar"
          onOk={() => {
            if (this.state.clienteEditar.nombre == '' ||
                this.state.clienteEditar.tipodocumento == '' ||
                this.state.clienteEditar.numeroidentificacion == '' ||
                this.state.clienteEditar.direccion == '' ||
                this.state.clienteEditar.telefono == '') {
              this.openSwal("Todos los campos son obligatorios", 0, "Error")
            } else {
              this.guardarEdicionCliente()
            }
          }}
          onCancel={() => {
            this.setState({
              mostrarEditarCliente: false,
              clienteEditar: {
                _id: '',
                nombre: "",
                tipodocumento: "",
                numeroidentificacion: "",
                fechanacimiento: moment().subtract(18, 'years'),
                telefono: "",
                direccion: "",
                mayorista: true,
              }
            });
          }}
        >
          <FormClientes editar={true} cliente={this.state.clienteEditar} comprobarCedula={this.comprobarCedula} editarCliente={this.editarCliente} />
        </Modal>
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
                swalHtml: false,
                swalType: "info"
              }
              this.setState({
                swal: swal
              })
            }
          }}
          onCancel={() => {
          }}
        />
      </div>
    )
  }
}
