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
