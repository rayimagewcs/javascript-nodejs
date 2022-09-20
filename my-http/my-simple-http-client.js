const net = require('net');

const NEWLINE = new String('\r\n');
const LOGIN_INFO = {"accountname":"master","password":"111111","Timestamp":"2022-01-10T05:25:22.301Z"};

class Header {
  constructor () {
    this.buf = Buffer.from([])
    this.headers = {}
  }
  setHeader (key, value) {
    this.headers[key] = value
    return this
  }
  build () {
    const bufs = []
    Object.keys(this.headers).forEach(key => {
      bufs.push(Buffer.from(key + ': ' + this.headers[key] + NEWLINE))
    })
    return Buffer.concat(bufs)
  }
}

const client = net.connect({
  host: 'localhost',
  port: 7010
});

client.on('error', (err) => {
  console.log('client error', err)
});

let req_num = 0

function send () {
  const headerBuilder = new Header()
    .setHeader('Host', 'localhost:7010')
    .setHeader('Connection', 'keep-alive')
    .setHeader('Content-Type', 'application/json;charset=utf-8')
    .setHeader('Accept', 'application/json, text/plain, */*');

  const body = createRequestBody();

  headerBuilder.setHeader('Content-Length', body.length); // 必须，没有报 [400 Bad Request]
  const header = headerBuilder.build();

  const requestCtx = Buffer.concat([createRequestLine(), header, Buffer.from(NEWLINE), body])
  console.log(`------------------- [SEND-${++req_num}] -------------------`)
  console.log(Buffer.from(requestCtx).toString('utf-8'))
  console.log(`------------------- [SEND-${req_num}] -------------------`)
  client.write(requestCtx)
}

client.on('data', data => {
  console.log('data: ', Buffer.from(data).toString('utf-8'));

  setTimeout(send, 3000);
})

client.on('connect', async () => {
  send()
})

/**
 * 请求行
 */
function createRequestLine () {
  return Buffer.from('POST /account/login HTTP/1.1' + NEWLINE)
}

/**
 * 请求体
 */
function createRequestBody () {
  return Buffer.concat([
    Buffer.from(JSON.stringify(LOGIN_INFO))
  ])
}
