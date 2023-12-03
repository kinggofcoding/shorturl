const BASE_CHAR = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const CHAR_COUNT = 62

module.exports = (resultLength) => {
  let result = ""

  for (let i = 0; i < resultLength; i++) {
    //產生亂數 Index
    const randomIndex = Math.floor(Math.random() * CHAR_COUNT)
    //依照亂數Index取出字元
    const randomChar = BASE_CHAR[randomIndex]
    //將取出字元組合在一起
    result += randomChar
  }
  
  return result
}