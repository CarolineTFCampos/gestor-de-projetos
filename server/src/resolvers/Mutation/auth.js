const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const auth = {
  signin: async function(parent, args, ctx) {
    // busca usuário pelo email
    const user = await ctx.db.query.user({
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

  signup: async function(parent, args, ctx) {
    // encrypt da senha
    const password = await bcrypt.hash(args.password, 10)

    // cria usuário
    const user = await ctx.db.mutation.createUser({
      data: {
        name: args.name,
        email: args.email,
        password: password
      }
    })

    // retorna usuário + token
    return {
      user,
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    }
  }
}

module.exports = { auth }
