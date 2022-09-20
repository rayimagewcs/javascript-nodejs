const http = require('http')

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith('/account/login')) {
    let buff = []
    req.on('data', (data) => {
      buff.push(data)
    })
    req.on('end', () => {
      const data = Buffer.concat(buff).toString()
      console.log('receive request data end, data is %j', data)
      const account = JSON.parse(data)
      return res.end(JSON.stringify({
        success: true,
        msg: 'login success, ur name is ' + account.accountname
      }))
    })
  }
})

server.listen(7010);
