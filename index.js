const unirest = require('unirest')
const fs = require('fs')
const convict = require('convict')
const chalk = require('chalk')

function error (msg) {
  console.error(chalk.red(msg))
  process.exit()
}

const config = convict({
  key: {
    doc: 'the siteleaf API key',
    format: '*',
    default: '',
    sensitive: true,
    arg: 'api_key',
    env: 'SITELEAF_API_KEY'
  },
  secret: {
    doc: 'the siteleaf API secret',
    format: '*',
    default: '',
    sensitive: true,
    arg: 'api_secret',
    env: 'SITELEAF_API_SECRET'
  },
  site: {
    doc: 'the siteleaf site id to be updated',
    format: String,
    default: '',
    arg: 'site',
    env: 'SITE_ID'
  },
  page: {
    doc: 'the siteleaf page name to be updated',
    format: String,
    default: 'index',
    arg: 'page',
    env: 'PAGE_NAME'
  },
  file: {
    doc: 'the name of the Markdown file to read',
    format: String,
    default: 'README.md',
    arg: 'file',
    env: 'MD_FILE'
  },
  publish: {
    doc: 'publish the site after updating',
    format: 'Boolean',
    default: false,
    arg: 'publish'
  }
})

config.validate()

if (config.get('key') === '') error('no api key was given')
if (config.get('secret') === '') error('no api secret was given')
if (config.get('site') === '') error('no site id was given')

const auth = Buffer.from(`${config.get('key')}:${config.get('secret')}`).toString('base64')
const findPage = unirest('GET', `https://api.siteleaf.com/v2/sites/${config.get('site')}/pages`)

findPage.query({
  'q': config.get('page')
})

findPage.headers({
  'authorization': `Basic ${auth}`
})

findPage.end(function (res) {
  if (res.error) error(res.error.message)
  if (!res.body.length || res.body.length === 0) error('index file could not be found in the given site')

  const pageRequest = unirest('PUT', `https://api.siteleaf.com/v2/pages/${res.body[0].id}`)

  pageRequest.headers({
    'authorization': `Basic ${auth}`,
    'content-type': 'application/json'
  })

  const fileName = config.get('file')
  let fileContent
  try {
    fileContent = fs.readFileSync(fileName, 'utf8')
  } catch (e) {
    error(`the given file ${fileName} could not be read`)
  }

  pageRequest.type('json')
  pageRequest.send({
    'body': fileContent
  })

  pageRequest.end(function (pageRes) {
    if (pageRes.error) error(pageRes.error.message)

    if (!config.get('publish')) {
      console.log(chalk.green(`Page "${res.body[0].basename}" successfully updated`))
    } else {
      const publishSite = unirest('GET', `https://api.siteleaf.com/v2/sites/${config.get('site')}/publish`)

      publishSite.headers({
        'authorization': `Basic ${auth}`
      })

      publishSite.end(function (publishRes) {
        if (publishRes.error) error(publishRes.error.message)

        console.log(chalk.green(`Page "${res.body[0].basename}" successfully updated and published`))
      })
    }
  })
})
