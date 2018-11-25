const { forwardTo } = require('prisma-binding')

const { auth } = require('./auth')

module.exports = {
  ...auth,

  createRole: forwardTo('db'),
  updateRole: forwardTo('db'),
  deleteRole: forwardTo('db'),

  createContributor: async (root, args, ctx, info) => {
    let result = await ctx.tw.peopleByEmail(args.data.email)
    console.log(123, {
      administrator: false,
      canAddProjects: false,
      canManagePeople: false,
      canAccessAllProjects: true,
      setProjectAdmin: false,
      'user-type': 'account',
      'first-name': args.data.name,
      'email-address': args.data.email,
      'phone-number-mobile': args.data.phone,
      address: {
        line1: args.data.address
      }
    })

    if (!result) {
      result = await ctx.tw.createPeople({
        administrator: false,
        canAddProjects: false,
        canManagePeople: false,
        canAccessAllProjects: true,
        setProjectAdmin: false,
        'user-type': 'account',
        'first-name': args.data.name,
        'last-name': '',
        'email-address': args.data.email,
        'phone-number-mobile': args.data.phone,
        address: {
          line1: args.data.address
        }
      })
    }

    return await ctx.db.mutation.createContributor({
      data: {
        ...args.data,
        twPeopleId: result.id
      }
    })
  },

  updateContributor: forwardTo('db'),
  deleteContributor: forwardTo('db'),

  createMilestone: forwardTo('db'),
  updateMilestone: forwardTo('db'),
  deleteMilestone: forwardTo('db'),

  createProjectRole: forwardTo('db'),
  updateProjectRole: forwardTo('db'),
  deleteProjectRole: forwardTo('db'),

  createProjectRoleContributor: forwardTo('db'),
  updateProjectRoleContributor: forwardTo('db'),
  deleteProjectRoleContributor: forwardTo('db'),

  createProject: async (root, args, ctx, info) => {
    const result = await ctx.tw.createProject({
      name: args.data.name,
      startDate: args.data.startAt
        .substr(0, 10)
        .split('-')
        .join(''),
      endDate: args.data.endAt
        .substr(0, 10)
        .split('-')
        .join('')
    })

    const resultTaskList = await ctx.tw.createProjectTaskList(result.id, {
      name: 'PRODUCT BACKLOG'
    })

    return await ctx.db.mutation.createProject({
      data: {
        ...args.data,
        twProjectId: result.id,
        twTaskListId: resultTaskList
      }
    })
  },
  updateProject: forwardTo('db'),
  deleteProject: forwardTo('db'),

  createFeature: async (root, args, ctx, info) => {
    const project = await ctx.db.query.project({
      where: {
        id: args.data.project.connect.id
      }
    })

    const tastId = await ctx.tw.createTaskListTask(project.twTaskListId, {
      content: args.data.name,
      description: args.data.description,
      'start-date': args.data.estimateStart
        .substr(0, 10)
        .split('-')
        .join(''),
      'due-date': args.data.estimateEnd
        .substr(0, 10)
        .split('-')
        .join(''),
      'estimated-minutes': args.data.estimateEffort
    })

    return await ctx.db.mutation.createFeature({
      data: {
        ...args.data,
        twTaskId: tastId
      }
    })
  },
  updateFeature: async (root, args, ctx, info) => {
    const feature = await ctx.db.query.feature(args)

    if (feature.twTaskId) {
      await ctx.tw.updateSubTask(feature.twTaskId, {
        content: args.data.name,
        description: args.data.description,
        'start-date': args.data.estimateStart
          .substr(0, 10)
          .split('-')
          .join(''),
        'due-date': args.data.estimateEnd
          .substr(0, 10)
          .split('-')
          .join(''),
        'estimated-minutes': args.data.estimateEffort
      })
    }

    return await ctx.db.mutation.updateFeature(args)
  },
  deleteFeature: async (root, args, ctx, info) => {
    const feature = await ctx.db.query.feature(args)

    if (feature.twTaskId) {
      await ctx.tw.deleteSubTask(feature.twTaskId)
    }

    return await ctx.db.mutation.deleteFeature(args)
  },

  createEpic: async (root, args, ctx, info) => {
    const feature = await ctx.db.query.feature({
      where: {
        id: args.data.feature.connect.id
      }
    })

    const tastId = await ctx.tw.createSubTask(feature.twTaskId, {
      content: args.data.name,
      description: args.data.description,
      'start-date': args.data.estimateStart
        .substr(0, 10)
        .split('-')
        .join(''),
      'due-date': args.data.estimateEnd
        .substr(0, 10)
        .split('-')
        .join(''),
      'estimated-minutes': args.data.estimateEffort
    })

    return await ctx.db.mutation.createEpic({
      data: {
        ...args.data,
        twTaskId: tastId
      }
    })
  },
  updateEpic: async (root, args, ctx, info) => {
    const epic = await ctx.db.query.epic(args)

    if (epic.twTaskId) {
      await ctx.tw.updateSubTask(epic.twTaskId, {
        content: args.data.name,
        description: args.data.description,
        'start-date': args.data.estimateStart
          .substr(0, 10)
          .split('-')
          .join(''),
        'due-date': args.data.estimateEnd
          .substr(0, 10)
          .split('-')
          .join(''),
        'estimated-minutes': args.data.estimateEffort
      })
    }

    return await ctx.db.mutation.updateEpic(args)
  },
  deleteEpic: async (root, args, ctx, info) => {
    const epic = await ctx.db.query.epic(args)

    if (epic.twTaskId) {
      await ctx.tw.deleteSubTask(epic.twTaskId)
    }

    return await ctx.db.mutation.deleteEpic(args)
  },

  createUserStory: async (root, args, ctx, info) => {
    const epic = await ctx.db.query.epic({
      where: {
        id: args.data.epic.connect.id
      }
    })

    const tastId = await ctx.tw.createSubTask(epic.twTaskId, {
      content: args.data.name,
      description: args.data.description,
      'start-date': args.data.estimateStart
        .substr(0, 10)
        .split('-')
        .join(''),
      'due-date': args.data.estimateEnd
        .substr(0, 10)
        .split('-')
        .join(''),
      'estimated-minutes': args.data.estimateEffort
    })

    return await ctx.db.mutation.createUserStory({
      data: {
        ...args.data,
        twTaskId: tastId
      }
    })
  },
  updateUserStory: async (root, args, ctx, info) => {
    const userStory = await ctx.db.query.userStory(args)

    if (userStory.twTaskId) {
      await ctx.tw.updateSubTask(userStory.twTaskId, {
        content: args.data.name,
        description: args.data.description,
        'start-date': args.data.estimateStart
          .substr(0, 10)
          .split('-')
          .join(''),
        'due-date': args.data.estimateEnd
          .substr(0, 10)
          .split('-')
          .join(''),
        'estimated-minutes': args.data.estimateEffort
      })
    }

    return await ctx.db.mutation.updateUserStory(args)
  },
  deleteUserStory: async (root, args, ctx, info) => {
    const userStory = await ctx.db.query.userStory(args)

    if (userStory.twTaskId) {
      await ctx.tw.deleteSubTask(userStory.twTaskId)
    }

    return await ctx.db.mutation.deleteUserStory(args)
  }
}
