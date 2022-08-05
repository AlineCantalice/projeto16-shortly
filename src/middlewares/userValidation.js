import userSchema from '../schemas/userSchema.js'

async function validateUser(req, res, next) {
  const validation = userSchema.validate(req.body, { abortEarly: false })

  if (validation.error) {
    return res.status(422).send(validation.error.details)
  }

  next()
}

export default validateUser
