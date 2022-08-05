import loginSchema from '../schemas/loginSchema.js'

async function validateLogin(req, res, next) {
  const validation = loginSchema.validate(req.body, { abortEarly: false })

  if (validation.error) {
    return res.status(422).send(validation.error.details)
  }

  next()
}

export default validateLogin
