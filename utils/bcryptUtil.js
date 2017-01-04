var bCrypt = require('bcrypt-nodejs');

module.exports = {

    comparePasswords: function (password, hash) {
        return bCrypt.compareSync(password, hash);
    },

    createHash: function (password) {
        // Generate a salt
        var salt = bCrypt.genSaltSync(10);
        return bCrypt.hashSync(password, salt);

    }
}
