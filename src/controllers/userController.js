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

    return res.status(200).send(`Bearer ${token}`)
  } else {
    return res.status(401).send('E-mail ou senha incorretos!!')
  }
}

export async function getUserData(req, res) {
  /*const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).send('Usuário não autenticado!!')
  }

  const token = authorization.split(' ')

  const {
    rows: session,
  } = await connection.query('SELECT * FROM sessions WHERE token=$1', [
    token[1],
  ])

  if (!session[0]) {
    return res.status(401).send('Usuário não autorizado!!')
  }

  const {
    rows: user,
  } = await connection.query('SELECT * FROM users WHERE id=$1', [
    session[0].userId,
  ])

  if (!user[0]) {
    return res.status(404).send('Usuário inválido!!')
  }

  const { rows: data } = await connection.query(
    'SELECT u.id, u.name, COUNT(ur."visitCount") AS "visitCount" FROM users u JOIN urls ur ON u.id=ur."userId" GROUP BY u.id', [user.id]
  )

  console.log(data)

  const {
    rows: urls,
  } = await connection.query(
    'SELECT id, "shortUrl", url, "visitCount" FROM urls WHERE "userId"=$1',
    [user[0].id],
  )

  const body = {
    id: user[0].id,
    name: user[0].name,
    //visitCount: data[0].visitCount,
    shortenedUrls: urls,
  }

  return res.status(200).send(body)*/
}

export async function getRanking(req, res) {
  const { rows: ranking } = await connection.query(
    'SELECT users.id, users.name, COUNT(urls."userId") AS "linksCount", COUNT(urls."visitCount") AS "visitCount" FROM users JOIN urls ON users.id=urls."userId" GROUP BY users.id ORDER BY "visitCount" LIMIT 10',
  )

  res.status(200).send(ranking)
}
