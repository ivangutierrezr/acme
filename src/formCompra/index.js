import React, { Component } from 'react'
import { InputNumber, DatePicker } from 'antd';
import moment from 'moment';

const dateFormat = 'DD/MM/YYYY';

export default class FormCompra extends Component {
  componentWillMount() {
  }
  render() {
    return (
      <div className="contentFormsModal">
        <div className="gridForms">
          <div className="item title">Id</div>
          <div className="item"> {this.props.compra.idproducto} </div>
          <div className="item title">Nombre</div>
          <div className="item"> {this.props.compra.nombre} </div>
          <div className="item title">Fecha de compra</div>
          <div className="item"> 
            <DatePicker
              style={{ width: '100%' }}
              value={moment(this.props.compra.fechacompra, dateFormat)}
              format={dateFormat}
              onChange={(ele) => this.props.editarCompra(1, ele._d)}
            />
          </div>
          <div className="item title">Cantidad comprada</div>
          <div className="item">
            <InputNumber
              id="cantidadCompraProducto"
              style={{ width: '100%' }}
              /* min={1} */
              value={this.props.compra.cantidadcompra}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onChange={(ele) => this.props.editarCompra(2, ele)}
            />
          </div>
          <div className="item title">Precio unitario de compra</div>
          <div className="item">
            <InputNumber
              id="precioCompraProducto"
              style={{ width: '100%' }}
              /* min={1} */
              value={this.props.compra.preciocompra}
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
              onChange={(ele) => this.props.editarCompra(3, ele)}
            />
          </div>
          
        </div>
      </div>
    )
  }
}
