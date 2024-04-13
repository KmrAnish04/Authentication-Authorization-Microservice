const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const Scheme = mongoose.Schema;
const UserSchema = new Scheme({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});



// Before the user information is saved in the database, this function will be called, you will get the plain text password, hash it, and store it.
UserSchema.pre(
    'save',
    async function(next){
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    }
);


// make sure that the user trying to log in has the correct credentials
UserSchema.methods.isValidPassword = async function(password){
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
}


const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;