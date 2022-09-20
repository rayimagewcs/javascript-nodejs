const net = require('net');
const port = 6381;

const client = net.connect({
  host: 'localhost',
  port: 6379
});

client.on('connect', () => {
  console.log('client connected to redis Server')
});

client.on('error', (err) => {
  console.log('client error', err)
});

let redisClient = null;
const proxyServer = net.createServer(recvClient => {
  redisClient = recvClient;

  recvClient.on('connect', () => {
    console.log('socket connect', port)
  });

  recvClient.on('data', (data) => {
    console.log(data)
    console.log('--------redis command--------\n')
    console.log(data.toString())
    client.write(data)
  });

  recvClient.on('error', (err) => {
    console.log('socket error', err)
  });
});

client.on('data', data => {
  console.log('redis reply: ', data.toString())
  redisClient.write(data)
});

proxyServer.on('listening', () => {
  console.log('listening')
});

proxyServer.listen(port);
