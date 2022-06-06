const bcrypt = require('bcryptjs');
const validator = require('validator');

const User = require('../models/user');


module.exports = {
  createUser: async function({ userInput }, req) {
    const errors = [];
    if(validator.isEmpty(userInput.name)){
        errors.push({message: 'Name can not by empty'});
    }
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: 'Password too short!' });
    }
    
    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error('User exists already!');
      throw error;
    }

    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      name: userInput.name,
      email: userInput.email,
      password: hashedPw,
      age:userInput.age
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
  
  readUser: async function({email},req) {

    if (!validator.isEmail(email)) {
        const error = new Error('Invalid email');
        throw error;
      }
    
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      const error = new Error('User not present with this email');
      throw error;
    }
    return {...existingUser._doc, _id:existingUser._id.toString()};
  },

  updateUser: async function({email,name,age}){
      if (!validator.isEmail(email)) {
        const error = new Error('Invalid email');
        throw error;
      }
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
        const error = new Error('User not present with this email');
        throw error;
      }  
      existingUser.name = name;
      existingUser.age  = age;
      const userUpdated = await existingUser.save();
      return {...userUpdated._doc, _id:userUpdated._id.toString()};
  },

  deleteUser: async function({email:email}) {
      if (!validator.isEmail(email)) {
        const error = new Error('Invalid email');
        throw error;
      }
      const existingUser = await User.findOne({ email: email });
      if (!existingUser) {
        const error = new Error('User not present with this email');
        throw error;
      }  
      await User.remove({email:email});
      return true;
  }

};
