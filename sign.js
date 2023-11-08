const jwt = require('jsonwebtoken');

const secretKey = 'my-secret-key';
const payload = {
  userId: 123,
  username: 'Typham'
};

const token = jwt.sign(payload, secretKey);
console.log(token);