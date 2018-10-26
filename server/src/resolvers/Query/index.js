const { forwardTo } = require('prisma-binding')

const { me } = require('./me')

module.exports = {
  me,

  role: forwardTo('db'),
  roles: forwardTo('db'),

  contributor: forwardTo('db'),
  contributors: forwardTo('db'),

  project: forwardTo('db'),
  projects: forwardTo('db')
}
