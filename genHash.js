const bcrypt = require('bcryptjs');
const password = '1234';
const hash = bcrypt.hashSync(password, 12);
console.log(hash);
