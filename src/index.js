import './app.css'

console.log("hello world!");
const io = require('socket.io-client');
var socket = io();
socket.on('news', function (data) {
  console.log(data);
});

let element = `
  <div class="element">
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur laudantium recusandae itaque libero velit minus ex reiciendis veniam. Eligendi modi sint delectus beatae nemo provident ratione maiores, voluptatibus a tempore!</p>
  </div>
`

document.write(element);