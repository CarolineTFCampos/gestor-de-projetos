const jwt = require('jsonwebtoken')

async function getUserById(userId, ctx) {
  const user = await ctx.prisma.query.user({
    where: {
      id: userId
    }
  })

  if (!user) {
    throw new AuthError()
  }

  return user
}

function getUserId(ctx) {
  const authorization = ctx.request.get('Authorization')

  if (authorization) {
    const token = authorization.replace('Bearer ', '')

    const payload = jwt.verify(token, process.env.APP_SECRET)

    return payload.userId
  }

  throw new AuthError()
}

class AuthError extends Error {
  constructor() {
    super('Não autorizado')
  }
}

module.exports = {
  getUserById,
  getUserId,
  AuthError
}
