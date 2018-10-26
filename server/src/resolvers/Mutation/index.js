const { forwardTo } = require('prisma-binding')

const { auth } = require('./auth')

module.exports = {
  ...auth,

  createRole: forwardTo('db'),
  updateRole: forwardTo('db'),
  deleteRole: forwardTo('db'),

  createContributor: forwardTo('db'),
  updateContributor: forwardTo('db'),
  deleteContributor: forwardTo('db'),

  createProject: forwardTo('db'),
  updateProject: forwardTo('db'),
  deleteProject: forwardTo('db')
}
