import urlSchema from '../schemas/urlSchema.js'

async function validateUrl(req, res, next) {
  const validation = urlSchema.validate(req.body, { abortEarly: false })

  if (validation.error) {
    return res.status(422).send(validation.error.details)
  }

  next()
}

export default validateUrl
