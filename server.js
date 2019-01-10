var express = require('express');
var socketIO = require('socket.io');
const http = require('http');
var path = require('path');
var bodyParser = require('body-parser');


var user = require('./routes/user');
var userType = require('./routes/specificUser');
var reqst = require('./routes/request')
var bld = require('./routes/blood')
var dnr = require('./routes/donor')


var app = express();
var server = http.createServer(app);
var io = socketIO(server);
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
//   res.header("Access-Control-Allow-Headers", "*");
//   next();
// });
 
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', user);
app.use('/api', userType);
app.use('/request', reqst);
app.use('/blood', bld);
app.use('/donor', dnr)

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newRequest', {
        from : hospitalId
    });
    socket.on('newRequest', (request) => {
        console.log('newRequest', request);
    })
    socket.on('disconnect', () => {
        console.log('User was disconnected');
    })
})


server.listen(3000, () => {
    console.log('Starting on port 3000')
})



// module.exports = {app}