const bcrypt = require('bcryptjs')

module.exports = [
    {
        username: 'admin',
        password: bcrypt.hashSync('imtheboss', 10),
    },
    {
        username: 'bob',
        password: bcrypt.hashSync('pass', 10),
    },
    {
        username: 'jane',
        password: bcrypt.hashSync('qwert', 10),
    },
]