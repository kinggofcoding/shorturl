const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const randomGenerator = require('./utils/randomGenerator')
const fs = require('fs')
const path = require('path')
app.use(express.urlencoded({ extended: true }))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

const urlDataPath = path.join(__dirname, 'urlData.json')

app.get('/', (req, res) => {
  try {
    res.render('index')
  } catch (error) {
    res.render('error', { error: error.message })
  }
})

app.post('/shorturl', (req, res) => {
  try {
    const { url } = req.body
    const urlData = fs.existsSync(urlDataPath)
      ? JSON.parse(fs.readFileSync(urlDataPath, 'utf-8'))
      : []
    const id = idGenerator(urlData, url)
    res.render('index', { id })
  } catch (error) {
    res.render('error', { error: error.message })
  }
})

app.get('/:id', (req, res) => {
  try {
    const { id } = req.params
    const urlData = JSON.parse(fs.readFileSync(urlDataPath, 'utf-8')) || []
    if (urlData.length) {
      const data = urlData.find((data) => data.id === id)
      res.redirect(data.url)
    }
  } catch (error) {
    res.render('error', { error: error.message })
  }
})

function checkRandomId(urlData) {
  let id = randomGenerator(5)
  if (urlData.length) {
    if (urlData.some((url) => url.id === id)) {
      checkRandomId(urlData)
    }
  }
  return id
}

function idGenerator(urlData, url) {
  let id = ''
  const data = urlData.find((data) => data.url === url)
  if (data) {
    id = data.id
  } else {
    id = checkRandomId(urlData)

    urlData.push({
      id,
      url,
    })

    fs.writeFileSync(urlDataPath, JSON.stringify(urlData), 'utf-8')
  }
  return id
}

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
