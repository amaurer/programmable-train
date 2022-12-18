module.exports = {
  sleep : ms => new Promise(res => {
    setTimeout(res, ms)
  }),
  percent(part, total){
    // (40 / 200) * 1000 = 20.0%
    return Math.round(10000 * (part / total)) / 10
  }
}