const socket = () => {
  console.log('duude');
  var socket = io();
  socket.on('tweets', function (tweet) {
    console.log(tweet);
  });
}

export { socket };