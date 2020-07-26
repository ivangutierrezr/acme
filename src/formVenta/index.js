import React, { Component } from 'react'
import { Button, Input, InputNumber, Select, Modal, DatePicker } from 'antd';
const { Option } = Select;
import SweetAlert from 'sweetalert-react'
import axios from 'axios'
import moment from 'moment';

const dateFormat = 'DD/MM/YYYY';

import FormClientes from '../formClientes'

export default class FormVenta extends Component {
  state = {
    cliente: {
      _id: "",
      nombre: "",
      tipoDocumento: "",
      numeroidentificacion: "",
      fechaNacimiento: "",
      telefono: "",
      direccion: "",
      mayorista: "",
      noEncontrado: true
    },
    productos: [],
    productosVenta: [],
    descuento: 0,
    subTotalFactura: 0,
    descuentoFactura: 0,
    totalFactura: 0,
    mostrarNuevoCliente: false,
    fechafactura: moment()._d,
    fechavencimiento: "",
    nuevoCliente: {
      nombre: "",
      tipoDocumento: "",
      numeroidentificacion: "",
      fechaNacimiento: "",
      telefono: "",
      direccion: "",
      mayorista: true,
    },
    swal: {
      swalShow: false,
      swalTitle: "",
      swalMessage: "",
      swalCancel: false,
      swalHtml: true,
      swalType: "info"
    },
    nombreBoton: "Guardar nuevo producto"
  }
  componentWillMount() {
    const self = this
    axios.get('http://localhost:8080/cargarFacturas')
      .then(function (response) {
        console.log(response.data)
        self.setState({
          numerofactura: response.data.numerofactura,
          productos: response.data.productos,
        })
        let fechaHoy = moment()._d
        self.actualizarFechas(fechaHoy)
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
        let cliente = self.state.cliente
        cliente.nombre = self.state.nuevoCliente.nombre
        cliente.tipoDocumento = self.state.nuevoCliente.tipoDocumento
        cliente.numeroidentificacion = self.state.nuevoCliente.numeroidentificacion
        cliente.fechaNacimiento = self.state.nuevoCliente.fechaNacimiento
        cliente.telefono = self.state.nuevoCliente.telefono
        cliente.direccion = self.state.nuevoCliente.direccion
        cliente.mayorista = self.state.nuevoCliente.mayorista
        cliente.noEncontrado = false
        let indexC = response.data.clientes.findIndex(clienteN => clienteN.numeroidentificacion == self.state.nuevoCliente.numeroidentificacion)
        console.log(response.data.clientes[indexC]._id);
        
        cliente._id = response.data.clientes[indexC]._id
        self.setState({
          mostrarNuevoCliente: false,
          clientes: response.data.clientes,
          cliente: {
            _id: "",
            nombre: "",
            tipoDocumento: "",
            numeroidentificacion: "",
            fechaNacimiento: "",
            telefono: "",
            direccion: "",
            mayorista: "",
            noEncontrado: true
          },
          cedulacliente: cliente.numeroidentificacion
        })
        self.openSwal(response.data.message, 1, "Correcto")
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  _calcularTotales = () => {
    let subTotalFactura = 0
    let descuentoFactura = 0
    let totalFactura = 0
    for (let p = 0; p < this.state.productosVenta.length; p++) {
      const prod = this.state.productosVenta[p];
      let subTotal = parseFloat(prod.subTotal)
      console.log(subTotal)
      subTotalFactura += subTotal
    }
    descuentoFactura = subTotalFactura * parseFloat(this.state.descuento)
    totalFactura = subTotalFactura - descuentoFactura
    this.setState({
      subTotalFactura: subTotalFactura,
      descuentoFactura: descuentoFactura,
      totalFactura: totalFactura,
    })
  }
  generarFactura = () => {
    let factura = {
      fechafactura: this.state.fechafactura,
      idcliente: this.state.cliente._id,
      descuento: this.state.descuento,
      idvendedor: this.props.usuario._id,
    }
    let ventas = []
    let productos = []
    const self = this
    axios.post('http://localhost:8080/guardarFactura', factura)
      .then(function (response) {
        for (let p = 0; p < self.state.productosVenta.length; p++) {
          const producto = self.state.productosVenta[p]
          let objVenta = {
            cantidadproducto: producto.cantidad,
            precioventa: producto.precioventa,
            idproducto: producto._id,
            idfactura: response.data.idFactura._id,
          }
          ventas.push(objVenta)
          let objProducto = {
            cantidad: producto.cantidad,
            _id: producto._id
          }
          productos.push(objProducto)
          if (p == self.state.productosVenta.length-1) {
            console.log("Entró")
            axios.post('http://localhost:8080/guardarVenta', ventas)
              .then(function (respn) {
                axios.post('http://localhost:8080/actualizarProductos', productos)
                  .then(function (resp) {
                    self.setState({
                      cliente: {
                        nombre: "",
                        tipodocumento: "",
                        numeroidentificacion: "",
                        fechanacimiento: moment().subtract(18, 'years'),
                        telefono: "",
                        direccion: "",
                        mayorista: true,
                      },
                      productosVenta: [],
                      cedulacliente: "",
                      subTotalFactura: 0,
                      descuentoFactura: 0,
                      totalFactura: 0,
                    })
                    self.openSwal("Factura generada con éxito", 1, "Correcto")
                  })
                  .catch(function (error) {
                    console.log(error);
                  })
              })
              .catch(function (error) {
                console.log(error);
              })
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  buscarCliente = (valor) => {
    const self = this
    let cliente = {
      numeroidentificacion: valor
    }
    axios.post('http://localhost:8080/buscarClientePorCedula', cliente)
      .then(function (response) {
        if (response.data.codigo == 1) {
          let cliente = response.data.cliente
          let descuento = 0
          if (cliente.mayorista) {
            descuento = 0.06
          }
          cliente.noEncontrado = false
          self.setState({
            cliente: cliente,
            descuento: descuento
          })
          if (self.state.productosVenta.length > 0) {
            setTimeout(() => {
              self._calcularTotales()
            }, 10);
          }
        }
        else {
          self.openSwal("El número de documento ingresado no se encuentra en la base de datos de clientes.<br><br>¿Desea agregarlo?", 3, "Atención")
        }
      })
      .catch(function (error) {
        console.log(error);
      })
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
  actualizarFechas = (fecha) => {
    let fechavencimiento = moment(fecha).add(1, "months")._d
    let newFecha = new Date(fechavencimiento)
    let day = newFecha.getDate()
    let month = newFecha.getMonth() + 1
    let year = newFecha.getFullYear()
    if (day < 10) {
      day = "0" + day
    }
    if (month < 10) {
      month = "0" + month
    }
    let nuevaFechaVencimiento = day + "/" + month + "/" + year
    this.setState({
      fechafactura: fecha,
      fechavencimiento: nuevaFechaVencimiento
    })
  }
  render() {
    return (
      <div className="contentForms">
        <div className="contentFormVenta">
          <div className="gridFormVentaEncabezado">
            <div className="logoContainer">
              <img src="assets/logo.png" alt="" className="grayscale" />
            </div>
            <div className="gridInfoEmpresa">
              <div>
                <div className="itemInfo">ACME Corporation</div>
                <div className="itemInfo">NIT: 7956256625</div>
              </div>
              <div>
                <div className="itemInfo">Cra. 5 # 9-41</div>
                <div className="itemInfo">Tuluá, Valle del Cauca</div>
                <div className="itemInfo">Colombia</div>
              </div>
            </div>
          </div>
          <div className="gridFormVentaContainer">
            <div className="containerFormVentaCliente">
              {/* <h3>Información del cliente</h3> */}
              <div className="gridFormVentaUno">
                <div className="item title">Nùmero ID</div>
                <div className="item">
                  <Input
                    allowClear
                    placeholder="Digite el nùmero de identificaciòn del cliente"
                    type="text"
                    value={this.state.cedulacliente}
                    onChange={(ele) => this.setState({ cedulacliente: ele.target.value })}
                    onBlur={(ele) => {
                      if (ele.target.value != null && ele.target.value != "") {
                        this.buscarCliente(ele.target.value)
                      }
                      else {
                        this.setState({
                          cliente: {
                            _id: "",
                            nombre: "",
                            tipoDocumento: "",
                            numeroidentificacion: "",
                            fechaNacimiento: "",
                            telefono: "",
                            direccion: "",
                            mayorista: "",
                            noEncontrado: true
                          },
                        })
                      }
                    }}
                  />
                </div>
              </div>
              <div className="gridFormVentaUno">
                <div className="item title">Nombre completo</div>
                <div className="item">
                  {this.state.cliente.nombre}
                </div>
              </div>
              <div className="gridFormVentaCuatro">
                <div className="item title">Dirección</div>
                <div className="item">
                  {this.state.cliente.direccion}
                </div>
                <div className="item title">Teléfono</div>
                <div className="item">
                  {this.state.cliente.telefono}
                </div>
              </div>
              {
                (this.state.cliente.noEncontrado == false) && <div className="gridFormVentaUno">
                  <div className="item title">Tipo de cliente</div>
                  {
                    this.state.cliente.mayorista ? <div className="item">
                      Mayorista
                </div> : <div className="item">
                        Minorista
                </div>
                  }
                </div>
              }
            </div>
            <div style={{width: '100%'}}>
              <div className="gridFormVentaDos">
                <div className="item  title">Número de factura</div>
                <div className="item itemFactura">{this.state.numerofactura}</div>
                <div className="item  title">Fecha de facturación</div>
                <div className="item itemFactura">
                  <DatePicker
                    style={{ width: '100%' }}
                    value={moment(this.state.fechafactura, dateFormat)}
                    format={dateFormat}
                    onChange={(ele) => {
                      this.actualizarFechas(ele._d)
                    }}
                  />
                </div>
                <div className="item  title">Fecha de vencimiento</div>
                <div className="item itemFactura">
                  {this.state.fechavencimiento}
                </div>
              </div>
              <div className="totalVenta">
                <div className="gridFormVentaFull">
                  <div className="item title titleTotalVenta">Total a pagar (COP)</div>
                  <div className="valorTotalVenta">$ {this.state.totalFactura.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
                </div>
              </div>
            </div>
          </div>
          {
            this.state.productosVenta.length > 0 && <h3>Listado de productos</h3>
          }
          {
            this.state.productosVenta.length > 0 && <div className="gridFormProductos">
              <div className="item itemVenta title">Cód.</div>
              <div className="item itemVenta title">Nombre</div>
              <div className="item itemVenta title">Descripción</div>
              <div className="item itemVenta title">Cantidad</div>
              <div className="item itemVenta title">Precio Unitario</div>
              <div className="item itemVenta title">Valor</div>
            </div>
          }
          {
            this.state.productosVenta.map((prod, p) => {
              return (
              <div className="gridFormProductos" key={p}>
                <div className="item itemVenta">{prod._id}</div>
                <div className="item itemVenta">
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="Digite el nombre del producto"
                    optionFilterProp="children"
                    onChange={(ele) => {
                      let producto = this.state.productos[ele]
                      let productosVenta = this.state.productosVenta
                      productosVenta[p].nombre = producto.nombre
                      productosVenta[p]._id = producto._id
                      productosVenta[p].descripcion = producto.descripcion
                      productosVenta[p].precioventa = producto.precioventa
                      productosVenta[p].noEncontrado = false
                      this.setState({ productosVenta: productosVenta })
                    }}
                    /* onBlur={onBlur} */
                    /* onSearch={(ele) => {}} */
                    filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {
                      this.state.productos.map((item, i) => {
                        return (
                          <Option value={i} key={i}>{item.nombre}</Option>
                        )
                      })
                    }
                  </Select>
                </div>
                <div className="item itemVenta">{prod.descripcion}</div>
                <div className="item itemVenta">
                  <InputNumber
                    style={{width: '100%'}}
                    min={0}
                    value={prod.cantidad} 
                    disabled={prod.noEncontrado}
                    onChange={(ele) => {
                      let productosVenta = this.state.productosVenta
                      productosVenta[p].cantidad = ele
                      let subTotal = ele * parseFloat(prod.precioventa)
                      productosVenta[p].subTotal = subTotal
                      if (ele == null || ele == "") {
                        productosVenta[p].cantidad = 0
                        productosVenta[p].subTotal = 0
                      }
                      this.setState({ 
                        productosVenta: productosVenta,
                      })
                      this._calcularTotales()
                    }}
                  />
                </div>
                <div className="item itemVenta itemBetween"><span>$</span> <span>{prod.precioventa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></div>
                <div className="item itemVenta itemBetween"><span>$</span> <span>{prod.subTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></div>
              </div>
              )
            })
          }
          {
            this.state.productosVenta.length > 0 && <div className="gridFormProductosTotal">
              <div></div>
              <div></div>
              <div></div>
              <div className="item title">Subtotal</div>
              <div className="item itemBetween">
                <span>$</span>
                <span>{this.state.subTotalFactura.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div className="item title">Descuento</div>
              <div className="item itemBetween">
                <span>$</span>
                <span>{this.state.descuentoFactura.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
              </div>
              <div></div>
              <div></div>
              <div></div>
              <div className="item title">Total a pagar</div>
              <div className="item itemBetween">
                <span>$</span>
                <span>{this.state.totalFactura.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
              </div>
            </div>
          }
          <div className="contenButtons">
            <Button 
              type="default" 
              size="default" 
              icon="plus"
              shape="round" 
              disabled={ this.state.cliente.noEncontrado }
              onClick={() => {
                let objProducto = {
                  _id: "",
                  nombre: "",
                  descripcion: "",
                  cantidad: 0,
                  precioventa: 0,
                  subTotal: 0,
                  noEncontrado: true
                }
                let productosVenta = this.state.productosVenta
                productosVenta.push(objProducto)
                this.setState({ productosVenta: productosVenta })
              }}
            >Agregar nuevo ítem de venta</Button>
          </div>
          <div className="contenButtons">
            <Button 
              type="primary" 
              size="default" 
              icon="save"
              shape="round" 
              disabled={ this.state.cliente.noEncontrado || this.state.totalFactura == 0 }
              onClick={() => {
                this.generarFactura()
              }}
            >Generar Factura</Button>
          </div>
        </div>
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
              cedulacliente: "",
              nuevoCliente: {
                nombre: "",
                tipodocumento: "",
                numeroidentificacion: "",
                fechanacimiento: moment().subtract(18, 'years'),
                telefono: "",
                direccion: "",
                mayorista: true,
              },
              cliente: {
                _id: "",
                nombre: "",
                tipodocumento: "",
                numeroidentificacion: "",
                fechanacimiento: moment().subtract(18, 'years'),
                telefono: "",
                direccion: "",
                mayorista: "",
                noEncontrado: true,
              }
            });
          }}
        >
          <FormClientes editar={false} cliente={this.state.nuevoCliente} editarCliente={this.editarNuevoCliente} comprobarCedula={this.comprobarCedula}/>
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
                swalHtml: true,
                swalType: "info"
              }
              this.setState({
                swal: swal
              })
            }
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
                swal: swal,
                nuevoCliente: {
                  nombre: "",
                  tipodocumento: "",
                  numeroidentificacion: this.state.cedulacliente,
                  fechanacimiento: moment().subtract(18, 'years'),
                  telefono: "",
                  direccion: "",
                  mayorista: true,
                },
                mostrarNuevoCliente: true,
              })
            }
            if (this.state.swal.swalFunction === 4) {
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
                cedulacliente: "",
                cliente: {
                  _id: "",
                  nombre: "",
                  tipoDocumento: "",
                  numeroidentificacion: "",
                  fechaNacimiento: "",
                  telefono: "",
                  direccion: "",
                  mayorista: "",
                  noEncontrado: true
                },
                swal: swal
              })
            }
            if (this.state.swal.swalFunction === 4) {
              const swal = {
                swalShow: false,
                swalTitle: "",
                swalMessage: "",
                swalCancel: false,
                swalHtml: true,
                swalType: "info"
              }
              let productosVenta = this.state.productosVenta
              productosVenta[this.state.posProducto] = {
                _id: "",
                nombre: "",
                descripcion: "",
                cantidad: 0,
                precioventa: 0,
                noEncontrado: true
              }
              this.setState({
                productosVenta: productosVenta,
                swal: swal
              })
            }
          }}
        />
      </div>
    )
  }
}
