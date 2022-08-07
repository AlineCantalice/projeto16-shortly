import connection from '../db/postgres.js'
import { nanoid } from 'nanoid'

export async function createShortUrl(req, res) {
  const { url } = req.body
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).send('Usuário não autenticado!!')
  }

  const token = authorization.replace('Bearer ', '')

  const {
    rows: session,
  } = await connection.query('SELECT * FROM sessions WHERE token=$1', [
    token,
  ])

  if (!session[0]) {
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
    'SELECT * FROM urls WHERE id=$1',
    [id],
  )

  if (!url[0]) {
    return res.status(404).send('ShortUrl não existe!!')
  }

  res.status(200).send(url[0])
}

export async function redirectToUrl(req, res) {
  const { shortUrl } = req.params

  const {
    rows: urlDb,
  } = await connection.query('SELECT * FROM urls WHERE "shortUrl"=$1', [
    shortUrl,
  ])

  if (!urlDb[0]) {
    return res.status(404).send('ShortUrl não existe!!')
  }

  const newCount = urlDb[0].visitCount + 1

  await connection.query('UPDATE urls SET "visitCount"=$1 WHERE id=$2', [
    newCount,
    urlDb[0].id,
  ])

  return res.redirect(urlDb[0].url)
}

export async function deleteUrl(req, res) {
  const { id } = req.params
  const { authorization } = req.headers

  if (!authorization) {
    return res.status(401).send('Usuário não autenticado!!')
  }

  const token = authorization.replace('Bearer ', '')

  const {
    rows: session,
  } = await connection.query('SELECT * FROM sessions WHERE token=$1', [
    token,
  ])

  if (!session[0]) {
    return res.status(401).send('Faça o login novamente!!')
  }

  const {
    rows: userUrl,
  } = await connection.query('SELECT * FROM urls WHERE id=$1', [id])

  if (!userUrl[0]) {
    return res.status(404).send('Essa url não existe!!!')
  }

  if (userUrl[0].userId !== session[0].userId) {
    return res.status(401).send('Você não tem permissão para excluir a url!!!')
  }

  await connection.query('DELETE FROM urls WHERE id=$1', [id])

  return res.status(204).send('Url deletada com sucesso!')
}
