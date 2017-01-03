var bCrypt = require('bcrypt-nodejs');

module.exports = {

    comparePasswords: function (password, hash) {
        return bCrypt.compareSync(password, hash);
    },

    createHash: function (password) {
        return bCrypt.hashSync(password);
    }
}
