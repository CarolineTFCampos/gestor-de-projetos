import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import AdminLayout from '../components/AdminLayout'
import PageNotFound from '../components/PageNotFound'

import Home from './Home'
import Roles from './Roles/Roles'
import Project from './Project/Project'
import Projects from './Projects/Projects'
import Contributors from './Contributors/Contributors'

function RedirectToHome() {
  return <Redirect to="/admin/home" />
}

function Admin() {
  return (
    <AdminLayout hasFooter={true}>
      <Switch>
        <Route path="/admin/home" exact={true} component={Home} />
        <Route path="/admin/roles" component={Roles} />
        <Route path="/admin/projects" component={Projects} />
        <Route path="/admin/project/:id" component={Project} />
        <Route path="/admin/contributors" component={Contributors} />
        <Route path="/admin" exact={true} component={RedirectToHome} />
        <Route component={PageNotFound} />
      </Switch>
    </AdminLayout>
  )
}

export default Admin
