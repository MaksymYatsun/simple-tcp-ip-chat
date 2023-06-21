const stdin = process.openStdin();
const net = require('net');

const [username, port, reciverPort] = process.argv.slice(2)

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
  console.log(`Accepting conections on ${hostname}:${port}`);

  const socket = new net.Socket();

  socket.on('error', () => {
    console.log('Conection to a friend was refusd retrying in 5s');
    setTimeout(() => {
      socket.connect(reciverPort);
    }, 5000);
  });

  socket.connect(reciverPort, () => {
    console.log(`Conected to a friend ${hostname}:${reciverPort}`);
    socket.write(`${username} has entered the chat room`);
  });

  stdin.addListener("data", d => {
    socket.write(`${username}: ${d}`);
  });
});