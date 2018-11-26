const { forwardTo } = require('prisma-binding')

const { me } = require('./me')

module.exports = {
  me,

  role: forwardTo('db'),
  roles: forwardTo('db'),

  contributor: forwardTo('db'),
  contributors: forwardTo('db'),

  project: forwardTo('db'),
  projects: forwardTo('db'),

  epic: forwardTo('db'),
  epics: forwardTo('db'),

  userStory: forwardTo('db'),
  userStories: forwardTo('db'),

  milestone: forwardTo('db'),
  milestones: forwardTo('db'),

  release: forwardTo('db'),
  releases: forwardTo('db'),

  iteration: forwardTo('db'),
  iterations: forwardTo('db')
}
