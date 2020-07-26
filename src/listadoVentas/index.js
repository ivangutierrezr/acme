import React, { Component } from 'react'
import axios from 'axios'
import { Table, Button, DatePicker, Input, Icon } from 'antd';

import moment from 'moment';

const dateFormat = 'DD/MM/YYYY';

export default class ListadoVentas extends Component {
  state = {
    ventas: [],
    ventasOriginales: [],
    fechaInicial: moment().subtract(1, "months"),
    fechaFinal: moment()
  }
  componentWillMount() {
    const self = this
    axios.get('http://localhost:8080/cargarVentas')
      .then(function (response) {
        console.log(response.data.ventas)
        self.setState({
          ventas: response.data.ventas,
          ventasOriginales: response.data.ventas,
        })
        self.organizarTabla()
      })
      .catch(function (error) {
        console.log(error);
      })
  }
  _renderVentas = () => {
    let data = []
    for (let p = 0; p < this.state.ventas.length; p++) {
      const venta = this.state.ventas[p];
      let newFecha = new Date(venta.fechafactura)
      let day = newFecha.getDate()
      if (day < 10) {
        day = "0" + day
      }
      let month = newFecha.getMonth() + 1
      if (month < 10) {
        month = "0" + month
      }
      let year = newFecha.getFullYear()
      let fechafactura = day + "/" + month + "/" + year
      let subtotalventa = parseFloat(venta.precioventa) * parseInt(venta.cantidadproducto)
      let descuento = subtotalventa * parseFloat(venta.descuento)
      let totalventa = subtotalventa - descuento
      subtotalventa = subtotalventa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      descuento = descuento.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      totalventa = totalventa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      let precioventa = venta.precioventa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      let objVenta = {
        key: p,
        factura: venta.factura,
        idproducto: venta.idproducto,
        producto: venta.nombre,
        fechafactura: venta.fechafactura,
        fechafacturatext: fechafactura,
        precioventa: '$ ' + precioventa,
        subtotalventa: '$ ' + subtotalventa,
        descuento: '$ ' + descuento,
        totalventa: '$ ' + totalventa,
        cantidad: venta.cantidadproducto,
      }
      data.push(objVenta)
    }
    return data
  }
  _renderResumenVentas = () => {
    let data = []
    let subtotales = 0
    let descuentos = 0
    let totales = 0
    for (let p = 0; p < this.state.ventas.length; p++) {
      const venta = this.state.ventas[p];
      let indexVenta = data.findIndex(dato => dato.idproducto == venta.idproducto)
      let cantidad = parseInt(venta.cantidadproducto)
      let subtotalventa = parseFloat(venta.precioventa) * parseInt(venta.cantidadproducto)
      let descuento = subtotalventa * parseFloat(venta.descuento)
      let totalventa = subtotalventa - descuento
      if (indexVenta == -1) {
        let objVenta = {
          idproducto: venta.idproducto,
          producto: venta.nombre,
          subtotalventa: subtotalventa,
          descuento: descuento,
          totalventa: totalventa,
          cantidad: cantidad,
        }
        data.push(objVenta)
      }
      else {
        let cantidadT = parseFloat(data[indexVenta].cantidad) + cantidad
        let descuentoT = parseFloat(data[indexVenta].descuento) + descuento
        let totalventaT = parseFloat(data[indexVenta].totalventa) + totalventa
        let subtotalventaT = parseFloat(data[indexVenta].subtotalventa) + subtotalventa
        data[indexVenta].cantidad = cantidadT
        data[indexVenta].descuento = descuentoT
        data[indexVenta].totalventa = totalventaT
        data[indexVenta].subtotalventa = subtotalventaT
      }
      subtotales += subtotalventa
      descuentos += descuento
      totales += totalventa
    }
    for (let p = 0; p < data.length; p++) {
      let descuento = data[p].descuento
      let totalventa = data[p].totalventa
      let subtotalventa = data[p].subtotalventa
      data[p].key = 't'+p
      data[p].descuento = '$' + (descuento.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
      data[p].totalventa = '$' + (totalventa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
      data[p].subtotalventa = '$' + (subtotalventa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
    }
    subtotales = '$' + (subtotales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
    descuentos = '$' + (descuentos.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
    totales = '$' + (totales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','))
    data.push({
      key: "t"+data.length,
      idproducto: "",
      producto: "TOTALES",
      subtotalventa: subtotales,
      descuento: descuentos,
      totalventa: totales,
      cantidad: "",
    })
    return data
  }
  organizarTabla = () =>{
    let ventas = []
    for (let v = 0; v < this.state.ventasOriginales.length; v++) {
      const venta = this.state.ventasOriginales[v];
      let fechaBien = moment(venta.fechafactura).isBetween(this.state.fechaInicial, this.state.fechaFinal)
      if (fechaBien) {
        ventas.push(venta)
      }
    }
    this.setState({
      ventas: ventas
    })
  }
  render() {
    return (
      <div className="contentForms">
        {
          this.state.ventasOriginales.length > 0 && <h3>Rango de fechas para generar informe</h3>
        }
        {
          this.state.ventasOriginales.length > 0 && <div className="gridSearch">
            <div className="item title">Fecha Inicio</div>
            <div className="item">
              <DatePicker
                style={{ width: '100%' }}
                value={moment(this.state.fechaInicial, dateFormat)}
                format={dateFormat}
                onChange={(ele) => {
                  var date1 = moment(ele._d);
                  var date2 = moment(this.state.fechaFinal);
                  var diff = date2.diff(date1);
                  if (diff > 0) {
                    this.setState({ fechaInicial: ele._d })
                  } else {
                    this.setState({ fechaInicial: moment().subtract(1, "months") })
                    this.props.openSwal("La fecha inicial no puede ser mayor a la final", 0, "Error")
                  }
                }}
              />
            </div>
            <div className="item title">Fecha Final</div>
            <div className="item">
              <DatePicker
                style={{ width: '100%' }}
                value={moment(this.state.fechaFinal, dateFormat)}
                format={dateFormat}
                onChange={(ele) => {
                  var date1 = moment(this.state.fechaInicial);
                  var date2 = moment(ele._d);
                  var diff = date2.diff(date1);
                  if (diff > 0) {
                    this.setState({ fechaFinal: ele._d })
                  } else {
                    this.setState({ fechaFinal: moment() })
                    this.props.openSwal("La fecha final no puede ser menor a la inicial", 0, "Error")
                  }
                }}
              />
            </div>
            <div className="item">
              <Button type="primary" icon="search" onClick={() => this.organizarTabla()}/>
              </div>
          </div>
        }
        {
          this.state.ventasOriginales.length > 0 && <h3>Filtrar por producto</h3>
        }
        {
          this.state.ventasOriginales.length > 0 && <div className="gridFormVentaUno">
            <div className="item title">Buscar Producto Por Nombre</div>
            <div className="item">
              <Input
                style={{ width: '100%' }}
                prefix={<Icon type="search" style={{ color: '#08AD49' }} />}
                placeholder="Digite el nombre del producto"
                onChange={(ele) => {
                  let value = ele.target.value
                  const data = this.state.ventasOriginales
                  const newData = data.filter((item) => {
                    const itemData = item.producto.toUpperCase()
                    const textData = value.toUpperCase()
                    return itemData.indexOf(textData) > -1
                  })
                  if (value === "" || value === null) {
                    this.setState({
                      ventas: this.state.ventasOriginales
                    })
                  }
                  else {
                    this.setState({
                      ventas: newData,
                    })
                  }
                }}
              />
            </div>
          </div>
        }
        {
          this.state.ventas.length > 0 ? <Table
            title={() => { 'Listado de ventas del periodo' }}
            bordered
            style={{ width: '100%', marginTop: '5px' }}
            columns={[
              {
                title: 'Factura',
                dataIndex: 'factura',
                key: 'factura',
                fixed: 'left',
                width: 100
              },
              {
                title: 'Id producto',
                dataIndex: 'idproducto',
                key: 'idproducto',
                fixed: 'left',
                width: 100
              },
              {
                title: 'Nombre producto',
                dataIndex: 'producto',
                key: 'producto',
                fixed: 'left',
                width: 200
              },
              {
                title: 'Fecha de venta',
                dataIndex: 'fechafacturatext',
                key: 'fechafacturatext',
              },
              {
                title: 'Precio de venta',
                dataIndex: 'precioventa',
                key: 'precioventa',
                className: 'column-money'
              },
              {
                title: 'Cantidad',
                dataIndex: 'cantidad',
                key: 'cantidad',
              },
              {
                title: 'Subtotal venta',
                dataIndex: 'subtotalventa',
                key: 'subtotalventa',
                className: 'column-money'
              },
              {
                title: 'Descuento',
                dataIndex: 'descuento',
                key: 'descuento',
                className: 'column-money'
              },
              {
                title: 'Total venta',
                dataIndex: 'totalventa',
                key: 'totalventa',
                className: 'column-money'
              }
            ]}
            size="small"
            dataSource={this._renderVentas()}
            pagination={8}
            scroll={{ x: 1000 }}
          /> : <span>No se encuentran ventas</span>
        }
        {
          this.state.ventas.length > 0 && <Table
            title={() => {'Resumen de ventas'}}
            bordered
            style={{ width: '100%', marginTop: '5px' }}
            columns={[
              {
                title: 'Id producto',
                dataIndex: 'idproducto',
                key: 'idproducto',
                fixed: 'left',
                width: 100
              },
              {
                title: 'Nombre producto',
                dataIndex: 'producto',
                key: 'producto',
                fixed: 'left',
                width: 200,
              },
              {
                title: 'Cantidad',
                dataIndex: 'cantidad',
                key: 'cantidad',
              },
              {
                title: 'Subtotal venta',
                dataIndex: 'subtotalventa',
                key: 'subtotalventa',
                className: 'column-money'
              },
              {
                title: 'Descuento',
                dataIndex: 'descuento',
                key: 'descuento',
                className: 'column-money'
              },
              {
                title: 'Total venta',
                dataIndex: 'totalventa',
                key: 'totalventa',
                className: 'column-money'
              }
            ]}
            size="small"
            dataSource={this._renderResumenVentas()}
            pagination={8}
            scroll={{ x: 1000 }}
          />
        }
      </div>
    )
  }
}
