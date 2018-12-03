import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import PageNotFound from '../components/PageNotFound'

import Login from './Login'

function RedirectToLogin() {
  return <Redirect to="/auth/login" />
}

function Auth() {
  return (
    <Switch>
      <Route path="/auth/login" exact={true} component={Login} />

      <Route path="/auth" exact={true} component={RedirectToLogin} />
      <Route component={PageNotFound} />
    </Switch>
  )
}

export default Auth
