const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Please enter your Name"],
        lowercase: true,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Minimum password length is 6 characters"]
    },
    age: {
        type: Number,
        required: [true, "Please enter your age"]
    },
    gender: {
        type: String,
        required: [true, "Please enter your gender"],
    },
    mobile: {
        type: Number,
        required: [true, "Please enter your mobile"],
    }
})

// fire a function before doc is saved to db
userSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next();
})

// static method to login user
userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("incorrect password");
    }
    throw Error("incorrect email ")
}

const User = mongoose.model("user", userSchema);

module.exports = User;