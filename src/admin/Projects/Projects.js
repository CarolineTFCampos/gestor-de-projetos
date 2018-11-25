import React from 'react'
import { Switch, Route } from 'react-router-dom'

import PageNotFound from '../../components/PageNotFound'

import ProjectsList from './ProjectsList'
import ProjectsEdit from './ProjectsEdit'
import ProjectsCreate from './ProjectsCreate'

function Projects() {
  return (
    <Switch>
      <Route
        path="/admin/projects/create"
        exact={true}
        component={ProjectsCreate}
      />
      <Route path="/admin/projects/:id" exact={true} component={ProjectsEdit} />
      <Route path="/admin/projects" exact={true} component={ProjectsList} />
      <Route component={PageNotFound} />
    </Switch>
  )
}

export default Projects
