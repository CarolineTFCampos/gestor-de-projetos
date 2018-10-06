import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import Button from 'antd/lib/button'
import Card from 'antd/lib/card'
import Form from 'antd/lib/form'
import Icon from 'antd/lib/icon'
import Input from 'antd/lib/input'
import FormItem from 'antd/lib/form/FormItem'
import AuthLayout from '../components/AuthLayout'

const SIGNIN = gql`
  mutation Signin($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      user {
        id
        name
        email
      }
      token
    }
  }
`

class Login extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }

    this.handleLogin = this.handleLogin.bind(this)
  }

  handleLogin(e) {
    e.preventDefault()

    let self = this

    this.props.form.validateFields(async function(err, values) {
      if (err) {
        return false
      }

      self.setState({
        loading: true
      })

      try {
        const result = await self.props.mutate({ variables: values })

        console.log(result)
      } catch (err) {
        alert(err.graphQLErrors[0].message)
      }

      self.setState({
        loading: false
      })
    })
  }

  render() {
    return (
      <AuthLayout>
        <h3 style={{ textAlign: 'center' }}>Code Projetos</h3>

        <Card>
          <h3 style={{ textAlign: 'center' }}>Login</h3>

          <Form onSubmit={this.handleLogin}>
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
              {this.props.form.getFieldDecorator('password', {
                rules: [{ required: true, message: 'Senha é obrigatória!' }]
              })(
                <Input
                  type="password"
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0, 0, 0, .3)' }} />
                  }
                  placeholder="Digite sua Senha"
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
                Login
              </Button>
            </FormItem>
          </Form>
          <hr />
          <Link to="/auth/forgot-password">
            <a href>Esqueci minha senha</a>
          </Link>
        </Card>
      </AuthLayout>
    )
  }
}

const withGraphql = graphql(SIGNIN)

const withForm = Form.create()

export default withGraphql(withForm(Login))
