var bCrypt = require('bcrypt-nodejs');

module.exports = {

    comparePasswords: function (password, compareTo) {

        return bCrypt.compareSync(password, compareTo);
    },

    createHash: function (password) {
        return bCrypt.hashSync(password, bCrypt.gwnSaltSync(10), null);

    }
}
