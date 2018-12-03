import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

import moment from 'moment'
import 'moment/locale/pt-br'

import 'antd/dist/antd.css'

import Auth from './auth/Auth'
import Admin from './admin/Admin'
import PageNotFound from './components/PageNotFound'

moment.locale('pt-br')

// cria cliente apollo
const client = new ApolloClient({
  // url da api
  // uri: 'http://localhost:4000', // local
  uri: 'http://192.168.1.12:4000', // ip

  // método executado toda vez que o apollo realizar uma requisição para api
  request: function(operation) {
    // pega o token do usuário armazenado do navegador
    const token = localStorage.getItem('gestor__token')

    // se tiver o token adiciona ele na requisição para que a api possa válidar
    if (token) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
    }
  },

  // método executado toda vez que o apollo recebe um erro
  onError: function(err) {
    // se o erro for de Não autorizado o token do usuário é removido e ele é redirecionado para o login
    if (err.graphQLErrors[0].message === 'Não autorizado') {
      localStorage.removeItem('gestor__token')
      window.location = '/auth'
    }
  }
})

function RedirectToAuth() {
  return <Redirect to="/auth" />
}

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Switch>
            <Route path="/admin" component={Admin} />
            <Route path="/auth" component={Auth} />
            <Route path="/" exact={true} component={RedirectToAuth} />
            <Route component={PageNotFound} />
          </Switch>
        </BrowserRouter>
      </ApolloProvider>
    )
  }
}

export default App
