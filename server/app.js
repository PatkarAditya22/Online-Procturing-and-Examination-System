const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {errorHandler} = require('./handlers/error');
const router = require('./routes');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const neatCsv = require('neat-csv');
const stream = require('./ws/stream.js');
const http = require("http");
const socket = require("socket.io");
const app = express();
const server = http.Server(app);
const io = socket(server);
io.of("/stream").on("connection", stream);

dotenv.config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


console.log("here");
app.get('/', function (req, res) {
  res.send("Hi Hacker");
});


mongoose.set('debug', true);
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URI, {
	keepAlive: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
});
const filePath = path.join(__dirname, 'users.csv');
fs.readFile(filePath, async (error, data) => {
  if (error) {
    return console.log('error reading file');
  }
  const parsedData = await neatCsv(data);
  
  console.log(parsedData['email']);
});

/*fs.readFile('users.csv', async (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(await neatCsv(data))
})
*/
// Routes
app.use('/api', router);



/*var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
	  user: 'dscvjti@gmail.com',
	  pass: ''
	}
  });
  
  var mailOptions = {
	from: 'dscvjtigmail.com',
	to: 'mantrypalak@gmail.com',
	subject: 'Sending Email using Node.js',
	text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
	if (error) {
	  console.log(error);
	} else {
	  console.log('Email sent: ' + info.response);
	}
  });
  */
//app.use(errorHandler);

app.listen(process.env.PORT || 8081, () => {
    console.log(`Server is starting on port ${process.env.PORT}`);
});