const express = require('express')
const app = express()
const { engine } = require('express-handlebars')
const randomGenerator = require('./utils/randomGenerator') //亂碼產生器
const fs = require('fs')
const path = require('path')

//初始化設定: post數據解析,views template & path,static path
app.use(express.urlencoded({ extended: true }))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

//預設存放URL資料的路徑
const urlDataPath = path.join(__dirname, 'urlData.json')


//route處理: '/'(回傳index內容給client)
app.get('/', (req, res) => {
  try {
    res.render('index')
  } catch (error) {
    res.render('error', { error: error.message })
  }
})

// route處理: '/shorturl(產生對照url的id,回傳短網址給client)
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

// route處理: '/:id' (依照短網址上的id搜尋對照的url,重新導向該url)
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


// 確認隨機產生的亂碼不與已存在的id重複
function checkRandomId(urlData) {
  let id = randomGenerator(5)
  if (urlData.length) {
    if (urlData.some((url) => url.id === id)) {
      checkRandomId(urlData)
    }
  }
  return id
}

// 確認client傳來的url使否與現有資料有重複url，有則回傳搜尋到的url，否則產生新id並寫入檔案
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

// 伺服器啟動並監聽port:3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
