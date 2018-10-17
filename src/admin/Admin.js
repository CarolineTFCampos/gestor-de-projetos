import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import PageNotFound from '../components/PageNotFound'

import Home from './Home'
import Roles from './Roles/Roles'

function RedirectToHome() {
  return <Redirect to="/admin/home" />
}

function Admin() {
  return (
    <Switch>
      <Route path="/admin/home" exact={true} component={Home} />
      <Route path="/admin/roles" component={Roles} />
      <Route path="/admin" exact={true} component={RedirectToHome} />
      <Route component={PageNotFound} />
    </Switch>
  )
}

export default Admin
