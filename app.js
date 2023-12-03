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
  res.render('index')
})

app.post('/shorturl', (req, res) => {
  const { url } = req.body
  const urlData = fs.existsSync(urlDataPath) ? JSON.parse(fs.readFileSync(urlDataPath, 'utf-8')) : []
  const id = checkRandomId(urlData)

  urlData.push({
    id,
    url,
  })

  fs.writeFileSync(urlDataPath, JSON.stringify(urlData), 'utf-8')

  res.render('index', { id })
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
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
