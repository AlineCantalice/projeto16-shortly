import connection from '../db/postgres.js'
import { nanoid } from 'nanoid'

export async function createShortUrl(req, res) {
  const { url } = req.body
  const { authorization } = req.headers

  const token = authorization.split(' ')

  const {
    rows: session,
  } = await connection.query('SELECT * FROM session WHERE token=$1', [token[1]])

  if (!authorization || !session[0]) {
    return res.status(401).send('Faça o login novamente!!')
  }

  const {
    rows: existUrl,
  } = await connection.query('SELECT * FROM urls WHERE url=$1', [url])

  if (existUrl[0]) {
    const body = {
      shortUrl: existUrl[0].shortUrl,
    }

    return res.status(201).send(body)
  }

  const shortUrl = nanoid(10)

  await connection.query(
    'INSERT INTO urls ("userId", url, "shortUrl") VALUES ($1, $2, $3)',
    [session[0].userId, url, shortUrl],
  )

  const body = {
    shortUrl: shortUrl,
  }

  return res.status(201).send(body)
}

export async function getUrlById(req, res) {
  const { id } = req.params

  const { rows: url } = await connection.query(
    'SELECT id, "shortUrl", url FROM urls WHERE id=$1',
    [id],
  )

  if (!url[0]) {
    return res.status(404).send('ShortUrl não existe!!')
  }

  res.status(200).send(url[0])
}
