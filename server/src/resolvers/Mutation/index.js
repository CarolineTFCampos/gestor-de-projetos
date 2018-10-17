const { forwardTo } = require('prisma-binding')

const { auth } = require('./auth')

module.exports = {
  ...auth,

  createRole: forwardTo('db'),
  updateRole: forwardTo('db'),
  deleteRole: forwardTo('db')
}
