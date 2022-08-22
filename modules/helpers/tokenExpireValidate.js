module.exports = {
  isTokenExpired(token) {
    const date = Date.parse(new Date())
    const dateToken = Date.parse(token.createdAt)
    if (token.liveTime * 60000 + dateToken < date) return true
    return false
  }
}