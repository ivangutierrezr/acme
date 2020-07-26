import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import '../../node_modules/sweetalert/dist/sweetalert.css'
import SweetAlert from 'sweetalert-react'
import { Input, Tooltip, Icon, Button } from 'antd';

export default class LoginBox extends Component {
  state = {
    username: '',
    password: '',
    admin: false,
    vendedor: false,
    swal: {
      swalShow: false,
      swalTitle: "",
      swalMessage: "",
      swalCancel: false,
      swalHtml: false,
      swalType: "info"
    },
    disabledLoginButton: true,
    iconLoading: false,
  }

  openSwal = (mensaje, funcion, title='Lo Sentimos') => {
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
    if (funcion === 1 || funcion === 2) {
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
  }

  validateDisabledButton = () => {
    let username = this.state.username
    let password = this.state.password
    if (username != '' && password != '') {
      this.setState({ disabledLoginButton: false });
    }
    else {
      this.setState({ disabledLoginButton: true });
    }
  }

  enterIconLoading = () => {
    this.setState({ iconLoading: true });
    const user = {
      username: this.state.username,
      password: this.state.password
    }
    const self = this
    axios.post('http://localhost:8080/api/login', user)
      .then(function (response) {
        let redireccion = 0
        if (response.data.cargo === 1) { redireccion = 1 }
        else if (response.data.cargo === 2) { redireccion = 2 }
        switch (redireccion) {
          case 1:
            self.openSwal('Bienvenido a Acme', 1, 'Inicio de sesión exitoso')
            break;
          case 2:
            self.openSwal('Bienvenido a Acme', 2, 'Inicio de sesión exitoso')
            break;
          default:
            self.setState({ /* username: '', */ password: '' })
            self.openSwal(response.data.message, 0, 'Error')
            self.setState({ iconLoading: false });
            break;
        }
      })
      .catch(function (error) {
        self.setState({ /* username: '', */ password: '' })
        self.setState({ iconLoading: false });
        self.openSwal("La combinación de nombre de usuario y contraseña es incorrecta", 0, "Error")
      })
  }

  render() {
    return(
      <div className="login_box">
        {
          this.state.admin && <Redirect to={'/admin'}/>
        }
        {
          this.state.vendedor && <Redirect to={{ pathname: '/home'}}/>
        }
        <p className='titulo_loginbox'>Inicio de Sesión</p>
        <div className='input_login'>
          <Input
            id='username'
            value={this.state.username}
            size='large'
            placeholder="Nombre de Usuario"
            onChange={(ele) => {
              this.setState({ username: ele.target.value })
              setTimeout(() => {
                this.validateDisabledButton()
              }, 10);
            }}
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
        </div>
        <div className='input_login'>
          <Input.Password 
            id='password'
            value={this.state.password}
            size='large'
            placeholder="Contraseña"
            onChange={(ele) => {
              this.setState({ password: ele.target.value })
              setTimeout(() => {
                this.validateDisabledButton()
              }, 10);
            }}
            prefix={<Icon type='key' style={{ color: 'rgba(0,0,0,.25)' }} />}
          />
        </div>
        <Button
          id="botonLogin"
          type="primary"
          loading = { this.state.iconLoading }
          onClick = { this.enterIconLoading }
          disabled = { this.state.disabledLoginButton }
        >
          Iniciar Sesión
        </Button>
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
                swal: swal,
                admin: true
              })
            }
            if (this.state.swal.swalFunction === 2) {
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
        />
      </div>
    )
  }
}
