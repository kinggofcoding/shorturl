const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const urlData = require('./public/urlData.json') || []
const randomGenerator = require('./utils/randomGenerator')
const fs = require('fs')

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))



app.get('/', (req, res) => {
    res.render('index')
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
})