const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);

const POST = process.env.PORT || 5000;
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
var cors = require('cors');

// DATACONFIG
// mongoose.connect('mongodb://localhost:27017/ApiExpress', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect(
  'mongodb+srv://admin:admin@cluster0-xmui4.mongodb.net/ApiExpress',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on('error', (error) => {
  console.log(error);
});
db.once('open', () => console.log('Connected to dataBase '));

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.io = io;

// STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')));

// ROUTERS
app.use('/users', require('./routers/users'));
app.use('/cvd', require('./routers/cong_van_den'));
app.use('/upload', require('./routers/upload'));
app.use('/cvdi', require('./routers/cong_van_di'));

server.listen(POST, () => console.log('Api start on port: ', POST));

io.on('connection', (socket) => {
  console.log(socket.id + ': connected');
});
