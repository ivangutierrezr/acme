import React, { Component } from 'react'
import SweetAlert from 'sweetalert-react'
import axios from 'axios'
import { Table, Button, Input, Icon, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import FormProductos from '../formProductos'
import FormCompra from '../formCompra';

import moment from 'moment';

const dateFormat = 'DD/MM/YYYY';

export default class InventarioProductos extends Component {
  state = {
    swal: {
      swalShow: false,
      swalTitle: "",
      swalMessage: "",
      swalCancel: false,
      swalHtml: false,
      swalType: "info"
    },
    mostrarNuevoProducto: false,
    mostrarEditarProducto: false,
    mostrarCompra: false,
    nuevoProducto: {
      nombre: '',
      descripcion: '',
      cantidad: 0,
      preciocompra: 0,
      precioventa: 0,
    },
    productoEditar: {
      _id: '',
      nombre: '',
      descripcion: '',
      cantidad: 0,
      preciocompra: 0,
      precioventa: 0,
    },
    compra: {
      idproducto: '',
      nombre: '',
      cantidadcompra: 0,
      preciocompra: 0,
      fechacompra: moment()._d
    },
    productos: [],
    productosOriginales: [],
  }
  componentWillMount() {
    const self = this
    axios.get('http://localhost:8080/cargarProductos')
      .then(function (response) {
        self.setState({
          productos: response.data.productos,
          productosOriginales: response.data.productos,
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

  _renderProductos = () => {
    let data = []
    for (let p = 0; p < this.state.productos.length; p++) {
      const producto = this.state.productos[p];
      let objProducto = {
        key: p,
        _id: producto._id,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        cantidad: producto.cantidad,
        preciocompra: '$ ' + producto.preciocompra,
        precioventa: '$ ' + producto.precioventa,
      }
      data.push(objProducto)
    }
    return data
  }
  editarNuevoProducto = (tipo, valor) => {
    let nuevoProducto = this.state.nuevoProducto
    if (tipo === 1) {
      nuevoProducto.nombre = valor
    }
    if (tipo === 2) {
      nuevoProducto.descripcion = valor
    }
    this.setState({ nuevoProducto: nuevoProducto })
  }
  guardarNuevoProducto = () => {
    const self = this
    axios.post('http://localhost:8080/guardarProducto', this.state.nuevoProducto)
      .then(function (response) {
        self.setState({
          mostrarNuevoProducto: false,
          productos: response.data.productos,
          productosOriginales: response.data.productos,
          nuevoProducto: {
            nombre: '',
            descripcion: '',
            cantidad: 0,
            preciocompra: 0,
            precioventa: 0,
          }
        })
        self.openSwal(response.data.message, 1, "Correcto")
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  editarProducto = (tipo, valor) => {
    let productoEditar = this.state.productoEditar
    if (tipo === 1) {
      productoEditar.nombre = valor
    }
    if (tipo === 2) {
      productoEditar.descripcion = valor
    }
    if (tipo === 3) {
      productoEditar.precioventa = valor
    }
    this.setState({ productoEditar: productoEditar })
  }
  guardarEdicionProducto = () => {
    const self = this
    axios.post('http://localhost:8080/editarProducto', this.state.productoEditar)
      .then(function (response) {
        self.setState({
          mostrarEditarProducto: false,
          productos: response.data.productos,
          productosOriginales: response.data.productos,
          productoEditar: {
            _id: '',
            nombre: '',
            descripcion: '',
            cantidad: 0,
            preciocompra: 0,
            precioventa: 0,
          }
        })
        self.openSwal(response.data.message, 1, "Correcto")
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  editarCompra = (tipo, valor) => {
    console.log(tipo, valor)
    let compra = this.state.compra
    if (tipo === 1) {
      compra.fechacompra = valor
    }
    if (tipo === 2) {
      compra.cantidadcompra = valor
    }
    if (tipo === 3) {
      compra.preciocompra = valor
    }
    this.setState({ compra: compra })
    console.log(compra)
  }
  guardarCompra = () => {
    const self = this
    axios.post('http://localhost:8080/guardarCompra', this.state.compra)
      .then(function (resp) {
        let producto = self.state.productoEditar
        let newProducto = {
          _id: producto._id,
          cantidadComprada: parseInt(self.state.compra.cantidadcompra),
          preciocompra: self.state.compra.preciocompra
        }
        axios.post('http://localhost:8080/editarProductoCantidades', newProducto)
          .then(function (response) {
            self.setState({
              mostrarCompra: false,
              productos: response.data.productos,
              productosOriginales: response.data.productos,
              compra: {
                idproducto: '',
                nombre: '',
                cantidadcompra: 0,
                preciocompra: 0,
                fechacompra: moment()._d
              },
              productoEditar: {
                _id: '',
                nombre: '',
                descripcion: '',
                cantidad: 0,
                preciocompra: 0,
                precioventa: 0,
              }
            })
            self.openSwal(response.data.message, 1, "Correcto")
          })
          .catch(function (error) {
            console.log(error);
          })
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  /* eliminarProducto = () => {
    const self = this
    axios.post('http://localhost:8080/eliminarProducto', this.state.nuevoProducto)
      .then(function (response) {
        self.setState({
          mostrarNuevoProducto: false,
          productos: response.data.productos,
          productosOriginales: response.data.productos,
          nuevoProducto: {
            nombre: '',
            descripcion: '',
            cantidad: 0,
            preciocompra: 0,
            precioventa: 0,
          }
        })
        self.openSwal(response.data.message, 1, "Correcto")
      })
      .catch(function (error) {
        console.log(error);
      })
  } */
  render() {
    return (
      <div className="contentForms">
        <div className="contenButtons">
          <Button
            id="agregarProducto"
            type="primary"
            size="default"
            icon="save"
            shape="round"
            onClick={() => this.setState({ mostrarNuevoProducto: true })}
          >Agregar Nuevo Producto</Button>
        </div>
        {
          this.state.productos.length > 0 && <div className="gridFormVentaUno">
            <div className="item title">Buscar Productos Por Nombre</div>
            <div className="item">
              <Input
                style={{ width: '100%' }}
                prefix={<Icon type="search" style={{ color: '#08AD49' }} />}
                placeholder="Digite el nombre del producto"
                onChange={(ele) => {
                  let value = ele.target.value
                  const data = this.state.productosOriginales
                  const newData = data.filter((item) => {
                    const itemData = item.nombre.toUpperCase()
                    const textData = value.toUpperCase()
                    return itemData.indexOf(textData) > -1
                  })
                  if (value === "" || value === null) {
                    this.setState({
                      productos: this.state.productosOriginales
                    })
                  }
                  else {
                    this.setState({
                      productos: newData,
                    })
                  }
                }}
              />
            </div>
          </div>
        }
        {
          this.state.productos.length > 0 ? <Table
            bordered
            style={{ width: '100%', marginTop: '5px' }}
            columns={[
              {
                title: 'Cód',
                dataIndex: '_id',
                key: '_id',
              },
              {
                title: 'Nombre',
                dataIndex: 'nombre',
                key: 'nombre',
              },
              {
                title: 'Descripcion',
                dataIndex: 'descripcion',
                key: 'descripcion',
              },
              {
                title: 'Cantidad',
                dataIndex: 'cantidad',
                key: 'cantidad',
              },
              {
                title: 'Precio de compra',
                dataIndex: 'preciocompra',
                key: 'preciocompra',
              },
              {
                title: 'Precio de venta',
                dataIndex: 'precioventa',
                key: 'precioventa',
              },
              {
                title: '', dataIndex: '', key: 'x', render: (record) => <div className="itemButtons">
                  <FontAwesomeIcon title="Añadir compra de producto" size='2x' color='#5AC0DD' icon='plus-circle' name="botonAgregarCompra" id={"botonAgregarCompra"+record.key}
                    onClick={() => {
                      let indexProd = this.state.productosOriginales.findIndex(prod => prod._id == record._id)
                      if (indexProd > -1) {
                        this.setState({
                          productoEditar: this.state.productosOriginales[indexProd],
                          compra: {
                            idproducto: record._id,
                            nombre: record.nombre,
                            cantidadcompra: 0,
                            preciocompra: 0,
                            fechacompra: moment()._d
                          },
                          mostrarCompra: true
                        })
                      }
                    }}
                  />
                </div>
              },
              {
                title: '', dataIndex: '', key: 'y', render: (record) => <div className="itemButtons">
                  <FontAwesomeIcon title="Editar Producto" size='2x' color='#DEC226' icon='edit' name="botonEditarProducto" id={"botonEditarProducto"+record.key} onClick={() => {
                    let indexProd = this.state.productosOriginales.findIndex(prod => prod._id == record._id)
                    if (indexProd > -1) {
                      this.setState({
                        productoEditar: this.state.productosOriginales[indexProd],
                        mostrarEditarProducto: true
                      })
                    }
                    }}
                  />
                </div>
              },
              /* {
                title: '', dataIndex: '', key: 'z', render: (record) => <div className="itemButtons">
                  <FontAwesomeIcon title="Eliminar Producto" size='2x' color='#D9534E' icon='trash-alt' onClick={() => {
                      this.setState({
                        productoEditar: record._id
                      })
                      this.openSwal("¿Desea eliminar este producto?<br><br>La información no podrá ser recuperada posteriormente")
                    }}
                  />
                </div>
              } */
            ]}
            size="small"
            dataSource={this._renderProductos()}
            pagination={10}
          /> : <span>No se encuentran productos</span>
        }
        <Modal
          title="Agregar nuevo producto"
          visible={this.state.mostrarNuevoProducto}
          okText="Guardar producto"
          cancelText="Cancelar"
          okButtonProps={{ id: "botonGuardarNuevoProducto" }}
          cancelButtonProps={{ id: "botonCancelarNuevoProducto" }}
          onOk={() => {
            if (this.state.nuevoProducto.nombre == '') {
              this.openSwal("El nombre del producto es obligatorio", 0, "Error")
            } else {
              this.guardarNuevoProducto()
            }
          }}
          onCancel={() => {
            this.setState({
              mostrarNuevoProducto: false,
              nuevoProducto: {
                  nombre: '',
                  descripcion: '',
                  cantidad: 0,
                  preciocompra: 0,
                  precioventa: 0,
                }
            });
          }}
        >
          <FormProductos editar={false} producto={this.state.nuevoProducto} editarProducto={this.editarNuevoProducto}/>
        </Modal>
        <Modal
          title="Editar producto"
          visible={this.state.mostrarEditarProducto}
          okText="Guardar producto"
          cancelText="Cancelar"
          okButtonProps={{ id: "botonGuardarEditarProducto" }}
          cancelButtonProps={{ id: "botonCancelarEditarProducto" }}
          onOk={() => {
            if (this.state.productoEditar.nombre == '') {
              this.openSwal("El nombre del producto es obligatorio", 0, "Error")
            } else {
              this.guardarEdicionProducto()
            }
          }}
          onCancel={() => {
            this.setState({
              mostrarEditarProducto: false,
              productoEditar: {
                _id: '',
                nombre: '',
                descripcion: '',
                cantidad: 0,
                preciocompra: 0,
                precioventa: 0,
              }
            });
          }}
        >
          <FormProductos editar={true} producto={this.state.productoEditar} editarProducto={this.editarProducto}/>
        </Modal>
        <Modal
          title="Agregar nueva compra"
          visible={this.state.mostrarCompra}
          okText="Guardar Compra"
          cancelText="Cancelar"
          okButtonProps={{ id: "botonGuardarCompraProducto" }}
          cancelButtonProps={{ id: "botonCancelarCompraProducto" }}
          onOk={() => {
            if (this.state.compra.preciocompra == '' || this.state.compra.fechacompra == '' || this.state.compra.cantidadcompra == '' ) {
              this.openSwal("Todos los campos son obligatorios", 0, "Error")
            } else {
              this.guardarCompra()
            }
          }}
          onCancel={() => {
            this.setState({
              mostrarCompra: false,
              compra: {
                idproducto: '',
                nombre: '',
                cantidadcompra: 0,
                preciocompra: 0,
                fechacompra: moment()._d
              }
            });
          }}
        >
          <FormCompra editar={false} compra={this.state.compra} editarCompra={this.editarCompra}/>
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
