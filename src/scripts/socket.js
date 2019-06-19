const socket = () => {
  var socket = io();
  socket.on('tweets', function (tweet) {
    console.log(tweet);
    var parent = document.querySelector('#tweet-container');
    console.log(parent);
    const s = `<div id="myDiv">${tweet.text} </div>`
    var htmlObject = document.createElement('div');
    htmlObject.innerHTML = s;
    parent.prepend(htmlObject);
  });
}

export { socket };