const net = require('net');
const stdin = process.openStdin();

const [username, port, receiverPort] = process.argv.slice(2)

const hostname = 'localhost';
let friendsName = null;

const server = net.createServer((socket) => {
  socket.on('data', data => {
    const received = JSON.parse(data.toString())
    if (received.message) {
      console.log(`${friendsName}: ${received.message}`)
    }
    if (received.name) {
      friendsName = received.name;
      console.log(`${friendsName} has entered a chat room`)
    }
  });

  socket.on('error', () => {
    console.log(`${friendsName} has left the chat room`)
  });
});

server.listen(port, hostname, () => {
  console.log(`Accepting connections on ${hostname}:${port}`);
});

const socket = new net.Socket();

socket.on('error', () => {
  console.log('Connection to a friend was refused retrying in 5s');
  setTimeout(() => {
    socket.connect(receiverPort);
  }, 5000);
});

socket.connect(receiverPort, () => {
  const message = JSON.stringify({ name: username })
  console.log(`Connected to a friend at ${hostname}:${receiverPort}`);
  socket.write(message)
});

stdin.addListener("data", d => {
  socket.write(JSON.stringify({ message: d.toString() }));
});