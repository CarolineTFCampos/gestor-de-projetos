import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import PageNotFound from '../components/PageNotFound'

import Login from './Login'
import ForgotPassword from './ForgotPassword'

function RedirectToLogin() {
  return <Redirect to="/auth/login" />
}

function Auth() {
  return (
    <Switch>
      <Route path="/auth/login" exact={true} component={Login} />

      <Route
        path="/auth/forgot-password"
        exact={true}
        component={ForgotPassword}
      />

      <Route path="/auth" exact={true} component={RedirectToLogin} />
      <Route component={PageNotFound} />
    </Switch>
  )
}

export default Auth
