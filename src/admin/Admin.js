import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import AdminLayout from '../components/AdminLayout'
import PageNotFound from '../components/PageNotFound'

import Roles from './Roles/Roles'
import Project from './Project/Project'
import Projects from './Projects/Projects'
import Allocation from './Allocation/Allocation'
import Contributors from './Contributors/Contributors'

function RedirectToHome() {
  return <Redirect to="/admin/projects" />
}

function RedirectToAuth() {
  return <Redirect to="/auth" />
}

function Admin() {
  if (!localStorage.getItem('gestor__token')) {
    return <RedirectToAuth />
  }

  return (
    <AdminLayout hasFooter={true}>
      <Switch>
        <Route path="/admin/roles" component={Roles} />
        <Route path="/admin/projects" component={Projects} />
        <Route path="/admin/project/:id" component={Project} />
        <Route path="/admin/contributors/crud" component={Contributors} />
        <Route path="/admin/contributors/allocation" component={Allocation} />
        <Route path="/admin" exact={true} component={RedirectToHome} />
        <Route component={PageNotFound} />
      </Switch>
    </AdminLayout>
  )
}

export default Admin
