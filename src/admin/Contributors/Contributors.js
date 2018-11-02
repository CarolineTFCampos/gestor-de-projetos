import React from 'react'
import { Switch, Route } from 'react-router-dom'

import PageNotFound from '../../components/PageNotFound'

import ContributorsList from './ContributorsList'
import ContributorsEdit from './ContributorsEdit'
import ContributorsCreate from './ContributorsCreate'

function Contributors() {
  return (
    <Switch>
      <Route
        path="/admin/contributors/create"
        exact={true}
        component={ContributorsCreate}
      />
      <Route
        path="/admin/contributors/:id"
        exact={true}
        component={ContributorsEdit}
      />
      <Route
        path="/admin/contributors"
        exact={true}
        component={ContributorsList}
      />
      <Route component={PageNotFound} />
    </Switch>
  )
}

export default Contributors
