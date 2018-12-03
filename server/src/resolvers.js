const moment = require('moment')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { forwardTo } = require('prisma-binding')

const { getUserById, getUserId } = require('./utils')

module.exports = {
  ProjectRoleContributor: {
    effort: async function(root, args, ctx, info) {
      const result = await ctx.teamwork.getTimeEntriesByProject(
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
    status: async function(root, args, ctx, info) {
      const result = await ctx.teamwork.task(root.twTaskId)

      return result && result.boardColumn ? result.boardColumn.name : 'Aberta'
    },
    effort: async function(root, args, ctx, info) {
      const result = await ctx.teamwork.getTimeEntriesByProject(
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

  Query: {
    me: async function(parent, args, ctx, info) {
      const userId = getUserId(ctx)
      const result = await getUserById(userId, ctx)

      return result
    },

    role: forwardTo('prisma'),
    roles: forwardTo('prisma'),

    contributor: forwardTo('prisma'),
    contributors: forwardTo('prisma'),

    project: forwardTo('prisma'),
    projects: forwardTo('prisma'),

    epic: forwardTo('prisma'),
    epics: forwardTo('prisma'),

    userStory: forwardTo('prisma'),
    userStories: forwardTo('prisma'),

    milestone: forwardTo('prisma'),
    milestones: forwardTo('prisma'),

    resource: forwardTo('prisma'),
    resources: forwardTo('prisma'),

    release: forwardTo('prisma'),
    releases: forwardTo('prisma'),

    iteration: forwardTo('prisma'),
    iterations: forwardTo('prisma'),

    risk: forwardTo('prisma'),
    risks: forwardTo('prisma')
  },

  Mutation: {
    signin: async function(parent, args, ctx) {
      // busca usuário pelo email
      const user = await ctx.prisma.query.user({
        where: {
          email: args.email
        }
      })

      // se não encontrar usuário pelo e-mail retorna erro
      if (!user) {
        throw new Error('E-mail e/ou senha não encontrado.')
      }

      // compara a senha para verificar se é válida
      const valid = await bcrypt.compare(args.password, user.password)

      // se a senha tiver errada retorna erro
      if (!valid) {
        throw new Error('E-mail e/ou senha não encontrado.')
      }

      // retorna usuário + token
      return {
        user,
        token: jwt.sign({ userId: user.id }, process.env.APP_SECRET)
      }
    },

    // signup: async function(parent, args, ctx) {
    //   // encrypt da senha
    //   const password = await bcrypt.hash(args.password, 10)

    //   // cria usuário
    //   const user = await ctx.prisma.mutation.createUser({
    //     data: {
    //       name: args.name,
    //       email: args.email,
    //       password: password
    //     }
    //   })

    //   // retorna usuário + token
    //   return {
    //     user,
    //     token: jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    //   }
    // },

    createRisk: forwardTo('prisma'),
    updateRisk: forwardTo('prisma'),
    deleteRisk: forwardTo('prisma'),

    createRole: forwardTo('prisma'),
    updateRole: forwardTo('prisma'),
    deleteRole: forwardTo('prisma'),

    createRelease: forwardTo('prisma'),
    updateRelease: forwardTo('prisma'),
    deleteRelease: forwardTo('prisma'),

    createIteration: forwardTo('prisma'),
    updateIteration: forwardTo('prisma'),
    deleteIteration: forwardTo('prisma'),

    createMilestone: forwardTo('prisma'),
    updateMilestone: forwardTo('prisma'),
    deleteMilestone: forwardTo('prisma'),

    createResource: forwardTo('prisma'),
    updateResource: forwardTo('prisma'),
    deleteResource: forwardTo('prisma'),

    createProjectRole: forwardTo('prisma'),
    updateProjectRole: forwardTo('prisma'),
    deleteProjectRole: forwardTo('prisma'),

    createProjectRoleContributor: forwardTo('prisma'),
    updateProjectRoleContributor: forwardTo('prisma'),
    deleteProjectRoleContributor: forwardTo('prisma'),

    createContributor: async (root, args, ctx, info) => {
      let result = await ctx.teamwork.peopleByEmail(args.data.email)

      if (!result) {
        result = await ctx.teamwork.createPeople({
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

      return await ctx.prisma.mutation.createContributor({
        data: {
          ...args.data,
          twPeopleId: result.id
        }
      })
    },
    updateContributor: forwardTo('prisma'),
    deleteContributor: forwardTo('prisma'),

    createProject: async (root, args, ctx, info) => {
      const result = await ctx.teamwork.createProject({
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

      const resultTaskList = await ctx.teamwork.createProjectTaskList(
        result.id,
        {
          name: 'PRODUCT BACKLOG'
        }
      )

      return await ctx.prisma.mutation.createProject({
        data: {
          ...args.data,
          twProjectId: result.id,
          twTaskListId: resultTaskList
        }
      })
    },
    updateProject: forwardTo('prisma'),
    deleteProject: forwardTo('prisma'),

    createEpic: async (root, args, ctx, info) => {
      const project = await ctx.prisma.query.project({
        where: {
          id: args.data.project.connect.id
        }
      })

      const tastId = await ctx.teamwork.createTaskListTask(
        project.twTaskListId,
        {
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
        }
      )

      return await ctx.prisma.mutation.createEpic({
        data: {
          ...args.data,
          twTaskId: tastId
        }
      })
    },
    updateEpic: async (root, args, ctx, info) => {
      const epic = await ctx.prisma.query.epic(args)

      if (epic.twTaskId) {
        await ctx.teamwork.updateSubTask(epic.twTaskId, {
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

      return await ctx.prisma.mutation.updateEpic(args)
    },
    deleteEpic: async (root, args, ctx, info) => {
      const epic = await ctx.prisma.query.epic(args)

      if (epic.twTaskId) {
        await ctx.teamwork.deleteSubTask(epic.twTaskId)
      }

      return await ctx.prisma.mutation.deleteEpic(args)
    },

    createUserStory: async (root, args, ctx, info) => {
      const epic = await ctx.prisma.query.epic({
        where: {
          id: args.data.epic.connect.id
        }
      })

      const tastId = await ctx.teamwork.createSubTask(epic.twTaskId, {
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

      return await ctx.prisma.mutation.createUserStory({
        data: {
          ...args.data,
          twTaskId: tastId
        }
      })
    },
    updateUserStory: async (root, args, ctx, info) => {
      const userStory = await ctx.prisma.query.userStory(args)

      if (userStory.twTaskId) {
        await ctx.teamwork.updateSubTask(userStory.twTaskId, {
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

      return await ctx.prisma.mutation.updateUserStory(args)
    },
    deleteUserStory: async (root, args, ctx, info) => {
      const userStory = await ctx.prisma.query.userStory(args)

      if (userStory.twTaskId) {
        await ctx.teamwork.deleteSubTask(userStory.twTaskId)
      }

      return await ctx.prisma.mutation.deleteUserStory(args)
    }
  }
}
