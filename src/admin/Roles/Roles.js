import React from 'react'
import { Switch, Route } from 'react-router-dom'

import PageNotFound from '../../components/PageNotFound'

import RolesList from './RolesList'
import RolesEdit from './RolesEdit'
import RolesCreate from './RolesCreate'

function Admin() {
  return (
    <Switch>
      <Route path="/admin/roles/create" exact={true} component={RolesCreate} />
      <Route path="/admin/roles/:id" exact={true} component={RolesEdit} />
      <Route path="/admin/roles" exact={true} component={RolesList} />
      <Route component={PageNotFound} />
    </Switch>
  )
}

export default Admin
