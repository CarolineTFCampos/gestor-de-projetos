const moment = require('moment')

const Query = require('./Query')
const Mutation = require('./Mutation')

module.exports = {
  ProjectRoleContributor: {
    effort: async function(root, args, ctx, info) {
      const result = await ctx.tw.getTimeEntriesByProject(
        root.projectRole.project.twProjectId
      )

      const data = result
        .filter(function(timeEntrie) {
          return timeEntrie['person-id'] === root.contributor.twPeopleId
        })
        .reduce(
          function(prev, current) {
            return {
              hours: prev.hours + parseInt(current.hours),
              minutes: prev.minutes + parseInt(current.minutes)
            }
          },
          { hours: 0, minutes: 0 }
        )

      const now = moment()
      const then = moment()
        .add(data.hours, 'hours')
        .add(data.minutes, 'minutes')

      return then.diff(now, 'minutes')
    }
  },
  UserStory: {
    effort: async function(root, args, ctx, info) {
      const result = await ctx.tw.getTimeEntriesByProject(
        root.epic.project.twProjectId
      )

      const data = result
        .filter(function(timeEntrie) {
          return timeEntrie['todo-item-id'] === root.twTaskId
        })
        .reduce(
          function(prev, current) {
            return {
              hours: prev.hours + parseInt(current.hours),
              minutes: prev.minutes + parseInt(current.minutes)
            }
          },
          { hours: 0, minutes: 0 }
        )

      const now = moment()
      const then = moment()
        .add(data.hours, 'hours')
        .add(data.minutes, 'minutes')

      return then.diff(now, 'minutes')
    }
  },
  Query,
  Mutation
}
