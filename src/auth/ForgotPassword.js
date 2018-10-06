import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Button from 'antd/lib/button'
import Card from 'antd/lib/card'
import Form from 'antd/lib/form'
import Icon from 'antd/lib/icon'
import Input from 'antd/lib/input'
import FormItem from 'antd/lib/form/FormItem'
import AuthLayout from '../components/AuthLayout'

class ForgotPassword extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }

    this.handleForgotPassword = this.handleForgotPassword.bind(this)
  }

  handleForgotPassword(e) {
    e.preventDefault()

    let self = this

    this.props.form.validateFields(function(err, values) {
      if (err) {
        return false
      }

      self.setState({
        loading: true
      })

      // TODO: implementar metodo de login
      // TODO: redirecionar para tela de admin
    })
  }

  render() {
    return (
      <AuthLayout>
        <h3 style={{ textAlign: 'center' }}>Code Projetos</h3>

        <Card>
          <h3 style={{ textAlign: 'center' }}>Recuperar Senha</h3>

          <Form onSubmit={this.handleForgotPassword}>
            <FormItem>
              {this.props.form.getFieldDecorator('email', {
                rules: [{ required: true, message: 'E-mail é obrigatório!' }]
              })(
                <Input
                  type="user"
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0, 0, 0, .3)' }} />
                  }
                  placeholder="Digite seu e-mail"
                />
              )}
            </FormItem>

            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                loading={this.state.loading}
                block={true}
              >
                Recuperar
              </Button>
            </FormItem>
          </Form>
          <hr />
          <Link to="/auth/login">
            <a href>Ir ao login</a>
          </Link>
        </Card>
      </AuthLayout>
    )
  }
}

export default Form.create()(ForgotPassword)
