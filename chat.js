const stdin = process.openStdin();
const net = require('net');

const [username, port, receiverPort] = process.argv.slice(2)

const hostname = 'localhost';

const server = net.createServer((socket) => {
  socket.on('data', data => {
    console.log(data.toString());
  });

  socket.on('error', () => {
    console.log('Your friend has left the chat room')
  });
});

server.listen(port, hostname, () => {
  console.log(`Accepting connections on ${hostname}:${port}`);

  const socket = new net.Socket();

  socket.on('error', () => {
    console.log('Connection to a friend was refused retrying in 5s');
    setTimeout(() => {
      socket.connect(receiverPort);
    }, 5000);
  });

  socket.connect(receiverPort, () => {
    console.log(`Connected to a friend ${hostname}:${receiverPort}`);
    socket.write(`${username} has entered the chat room`);
  });

  stdin.addListener("data", d => {
    socket.write(`${username}: ${d}`);
  });
});