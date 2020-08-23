const superagent = require('superagent')
const fs = require('fs').promises

module.exports = async function (key = '', secret = '', site = '', page = 'index',
  file = 'README.md', publish = false) {
  if (key === '') throw Error('no api key was given')
  if (secret === '') throw Error('no api secret was given')
  const auth = Buffer.from(`${key}:${secret}`).toString('base64')

  if (site === '') throw Error('no site id was given')

  const res = await superagent
    .get(`https://api.siteleaf.com/v2/sites/${site}/pages`)
    .query({
      q: page,
      extensions: 'markdown'
    })
    .set('authorization', `Basic ${auth}`)

  if (!res.body.length || res.body.length === 0) throw Error('index file could not be found in the given site')

  const fileContent = await fs.readFile(file, 'utf8')

  await superagent
    .post('PUT', `https://api.siteleaf.com/v2/pages/${res.body[0].id}`)
    .set('authorization', `Basic ${auth}`)
    .set('content-type', 'application/json')
    .send({
      body: fileContent
    })

  if (publish) {
    await superagent
      .post(`https://api.siteleaf.com/v2/sites/${site}/publish`)
      .set('authorization', `Basic ${auth}`)
  }

  return res.body[0].basename
}
