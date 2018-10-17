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
import message from 'antd/lib/message'

import AuthLayout from '../components/AuthLayout'

/**
 * Componente responsável por exibir a interface de login
 * e executar metodos de autenticação
 */
class Login extends Component {
  constructor(props) {
    // Passa as props para a classe pai Component
    super(props)

    // Inicia estado do componente
    this.state = {
      // Responsavel por não exibir loader no botao de login ao iniciar a aplicaçao
      loading: false
    }

    // Força a referencia do this para a classe Login
    this.handleLogin = this.handleLogin.bind(this)
  }

  /**
   * Responsavel por:
   *  realizar as validaçoes de campos
   *  enviar a requisição de autenticaçao para o backend
   *  salvar token de usuário
   *  redirecionar para tela principal
   *
   * @param event Evento gerado pelo formulário referente a ação de submit
   */
  handleLogin(event) {
    // Garente que o evento não se propague para que a requisição não seja enviado diretamente ao backend
    event.preventDefault()

    // Armazena referência ao componente Login
    const self = this

    // Válida informações do formulário
    // https://ant.design/components/form/#components-form-demo-normal-login
    this.props.form.validateFields(async function(err, values) {
      // Quando tiver algum erro não continua a execução do login
      if (err) {
        // Retorna falso para que o processo seja finalizado
        return false
      }

      // Altera o estado do componente
      self.setState({
        // Responsável por exibir loader no botao de login
        loading: true
      })

      try {
        // Executa a mutation que foi injetada como prop pelo graphql
        // passa como parâmetro os campos do formulário { email: '', password: '' }
        const result = await self.props.mutate({
          variables: values
        })

        // TODO: Salva token do usuário no localStorage
        localStorage.setItem('gestor__token', result.data.signin.token)

        // TODO: Redireciona o usuário para tela principal
        self.props.history.push('/admin')

        // TODO: DELETAR
        console.log(result)
      } catch (err) {
        // Mensagem de erro do graphql
        const error = err.graphQLErrors[0].message

        // Exibe a mensagem de erro por 10 segundos
        message.error(error, 10)
      }

      // Altera o estado do componente
      self.setState({
        // Responsável por NÃO exibir loader no botao de login
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

          {/* https://ant.design/components/form/#API */}
          <Form onSubmit={this.handleLogin}>
            <FormItem>
              {this.props.form.getFieldDecorator('email', {
                rules: [
                  { required: true, message: 'E-mail é obrigatório!' },
                  {
                    type: 'email',
                    message: 'E-mail inválido!'
                  }
                ]
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

// Contem o script para realizar o login, retornar usuario e token de autenticação
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

const withGraphql = graphql(SIGNIN)

const withForm = Form.create()

export default withGraphql(withForm(Login))
