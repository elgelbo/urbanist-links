const socket = () => {
  var socket = io();
  socket.on('tweets', function (tweet) {
    console.log(tweet);
    var parent = document.querySelector('#tweet-container');
    const s = `<div id="myDiv">${tweet.body} </div>`
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = s;
    parent.prepend(htmlObject);
  });
}

export { socket };