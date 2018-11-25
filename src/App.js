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

const client = new ApolloClient({
  // uri: 'http://localhost:4000' // local
  uri: 'http://10.0.0.190:4000' // ip
  // uri: 'https://us1.prisma.sh/carolineedecampos-881f88/gestor-de-projetos/dev' // server
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
