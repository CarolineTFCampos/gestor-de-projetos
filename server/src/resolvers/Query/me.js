const { getUserById, getUserId } = require('../../utils')

async function me(parent, args, ctx) {
  const userId = getUserId(ctx)
  const result = await getUserById(userId, ctx)

  return result
}

module.exports = { me }
