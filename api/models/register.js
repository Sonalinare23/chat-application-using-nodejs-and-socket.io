const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registerSchema = new Schema(
  {
    name: {
      type: String,
      required : true
    },
    Username: {
      type: String,
      required : true
    },
    email:{
        type: String,
        required : true,
        unique:true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
    password:{
        type: String,
        required : true
    },

  },
   
);

module.exports = mongoose.model('theregister', registerSchema);