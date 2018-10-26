import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import PageNotFound from '../components/PageNotFound'

import Home from './Home'
import Roles from './Roles/Roles'
import Contributors from './Contributors/Contributors'
import Projects from './Projects/Projects'

function RedirectToHome() {
  return <Redirect to="/admin/home" />
}

function Admin() {
  return (
    <Switch>
      <Route path="/admin/home" exact={true} component={Home} />
      <Route path="/admin/roles" component={Roles} />
      <Route path="/admin/contributors" component={Contributors} />
      <Route path="/admin/projects" component={Projects} />
      <Route path="/admin" exact={true} component={RedirectToHome} />
      <Route component={PageNotFound} />
    </Switch>
  )
}

export default Admin
