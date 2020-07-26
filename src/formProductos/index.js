import React, { Component } from 'react'
import { Input, InputNumber } from 'antd';
const { TextArea } = Input;

export default class FormProductos extends Component {
  componentWillMount() {
  }
  render() {
    return (
      <div className="contentFormsModal">
        <div className="gridForms">
          <div className="item title">Nombre</div>
          <div className="item">
            <Input 
              id="nombreNuevoProducto"
              allowClear 
              type="text" 
              value={this.props.producto.nombre} 
              onChange={(ele) => this.props.editarProducto(1, ele.target.value)}
            />
          </div>
          <div className="item title">Descripción</div>
          <div className="item">
            <TextArea 
              id="descripcionNuevoProducto"
              autosize={{minRows: 3, maxRows: 5}}
              value={this.props.producto.descripcion} 
              onChange={(ele) => this.props.editarProducto(2, ele.target.value)}
            />
          </div>
        </div>
        {
          this.props.editar && <div className="gridForms">
            <div className="item title">Precio de Venta</div>
            <div className="item">
              <InputNumber
                id="precioNuevoProducto"
                style={{ width: '100%' }}
                /* min={1} */
                value={this.props.producto.precioventa}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                onChange={(ele) => this.props.editarProducto(3, ele)}
              />
            </div>
          </div>
        }
      </div>
    )
  }
}
