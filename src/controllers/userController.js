import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import connection from '../db/postgres.js'

export async function signUp(req, res) {
  const user = req.body

  const passwordHash = bcrypt.hashSync(user.password, 10)

  const {
    rows: existEmail,
  } = await connection.query('SELECT * FROM users WHERE email=$1', [user.email])

  if (existEmail[0]) {
    return res.status(409).send('email já cadastrado')
  }

  await connection.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
    [user.name, user.email, passwordHash],
  )

  res.sendStatus(201)
}

export async function signIn(req, res) {
  const user = req.body

  const {
    rows: userDb,
  } = await connection.query('SELECT * FROM users WHERE email=$1', [user.email])

  if (userDb[0] && bcrypt.compareSync(user.password, userDb[0].password)) {
    const token = uuid()

    await connection.query(
      'INSERT INTO sessions ("userId", token) VALUES ($1, $2)',
      [userDb[0].id, token],
    )

    return res.status(200).send(token)
  } else {
    return res.status(401).send('E-mail ou senha incorretos!!')
  }
}
