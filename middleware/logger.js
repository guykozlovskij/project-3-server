function logger(req, res, next) {

  console.log(`Incoming Request ${req.method} for URL ${req.url} ${Date.now()}`)
  console.log(` Body: ${req.body}`)
  next()
}
export default logger