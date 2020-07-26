import React, { Component } from 'react'
import { Button, Input, InputNumber, Select, DatePicker, Radio } from 'antd';
const { Option } = Select;
import moment from 'moment';

const dateFormat = 'DD/MM/YYYY';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class FormClientes extends Component {
  state = {
    classContent: 'contentFormsModal'
  }
  componentWillMount() {
    /* if (this.props.editar == true) {
      this.setState({
        classContent: 'contentFormsModal'
      })
    } */
  }
  render() {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    return (
      <div className={this.state.classContent}>
        <div className="gridForms">
          <div className="item title">Nombre completo</div>
          <div className="item">
            <Input 
              allowClear 
              type="text" 
              value={this.props.cliente.nombre} 
              onChange={(ele) => this.props.editarCliente(1, ele.target.value)}
            />
          </div>
          <div className="item title">Tipo de documento</div>
          <div className="item">
            <Select
              showSearch
              style={{ width: '100%' }}
              value={this.props.cliente.tipodocumento} 
              placeholder="Selecccione una opción"
              optionFilterProp="children"
              onChange={(ele) => this.props.editarCliente(2, ele)}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="C.C">C.C</Option>
              <Option value="NIT">NIT</Option>
              <Option value="C.E">C.E</Option>
            </Select>
          </div>
          <div className="item title">Número de identificación</div>
          <div className="item">
            <InputNumber
              style={{width: '100%'}}
              value={this.props.cliente.numeroidentificacion} 
              onChange={(ele) => this.props.editarCliente(3, ele)}
              onBlur={(ele) => this.props.comprobarCedula(ele.target.value)}
              disabled={this.props.editar}
            />
          </div>
          <div className="item title">Fecha de nacimiento</div>
          <div className="item">
            <DatePicker 
              style={{width: '100%'}}
              value={moment(this.props.cliente.fechanacimiento, dateFormat)} 
              format={dateFormat}
              onChange={(ele) => this.props.editarCliente(4, ele._d)}
            />
          </div>
          <div className="item title">Teléfono</div>
          <div className="item">
            <InputNumber
              style={{width: '100%'}}
              value={this.props.cliente.telefono} 
              onChange={(ele) => this.props.editarCliente(5, ele)}
            />
          </div>
          <div className="item title">Dirección</div>
          <div className="item">
            <Input 
              allowClear 
              type="text" 
              value={this.props.cliente.direccion} 
              onChange={(ele) => this.props.editarCliente(6, ele.target.value)}
            />
          </div>
          <div className="item title">Tipo de cliente</div>
          <div className="item">
            <Radio.Group 
              onChange={this.onChange} 
              value={this.props.cliente.mayorista} 
              onChange={(ele) => this.props.editarCliente(7, ele.target.value)}>
                <Radio style={radioStyle} value={true}>
                  Mayorista
                </Radio>
                <Radio style={radioStyle} value={false}>
                  Minorista
                </Radio>
            </Radio.Group>
          </div>
        </div>
        {/* {
          this.props.editar == false && <div className="contenButtons">
            <Button
              type="primary"
              size="default"
              icon="save"
              shape="round"
              onClick={() => this.props.funcionGuardar()}
              disabled={
                this.props.cliente.nombre == '' ||
                this.props.cliente.tipodocumento == '' ||
                this.props.cliente.numeroidentificacion == '' ||
                this.props.cliente.direccion == '' ||
                this.props.cliente.telefono == ''
              }
            >Guardar Cliente</Button>
          </div>
        } */}
      </div>
    )
  }
}
