
const express = require('express');
const { findOne } = require("../models/register");

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
//const jwt = require('jsonwebtoken');
const router = express.Router()
const registerModel = require('../models/register');



router.post('/', async (req, res, next) => {

    //Registration logic start
    const { name, Username, email, password,confirmPassword} = req.body;
    console.log(name, Username, email, password,confirmPassword);
        
    if(name !== "" && Username !== "" && email !== "" && password !== "" && confirmPassword !== ""){

        //checking password and confirm password
        if(password === confirmPassword){

            //check if user already exist and validate in database
            const oldUser = await registerModel.findOne({email});

            if(!oldUser){
                 // encrypt user password usin bcrypt method
                encryptedPassword = await bcrypt.hash(password, 10);
                
                //create user in database
                const user = registerModel({
                    name,
                    Username,
                    email : email.toLowerCase(), // convert email into lowercase
                    password : encryptedPassword,
                    // confirmpassword : encryptedPassword+
                });

                const u1 = await user.save();
            
                //return new user 
                res.status(201).json({
                    message : 'User Registered Successfully!',
                    u1
                });
            } else {
                
                return res.status(403).send("User alredy exist!")
            }

           
        }
        else{
            //response for password and confirm password not match
            res.status(401).send("Password not match!")
        }

    } else {
        res.status(400).send("All input field is required!");
    }
    
    //Registration logic end
});

// router.post('/', async (req, res, next) => {

//     //Registration logic start
//     try{
//         //get password and confirm password for matching
//         const password = req.body.password;
//         const confirmPassword = req.body.confirmPassword;

//         //checking password and confirm password
//         if(password === confirmPassword){

//             // get user input
//             const { name, Username, email, password,confirmPassword} = req.body;
//             console.log(name, Username, email, password,confirmPassword)

//             //validate user input
//             if(!(name && Username && email && password && confirmPassword)){
//                 res.status(400).send("All input field is required!");
//             }

//             //check if user already exist and validate in database
//             const oldUser = await userRegister.findOne({email});
//             if(oldUser){
//                 return res.status(403).send("User alredy exist!")
//             }

//             // encrypt user password usin bcrypt method
//             encryptedPassword = await bcrypt.hash(password, 10);
            
//             //create us0er in database
//             const user = userRegister({
//                 name,
//                 Username,
//                 email : email.toLowerCase(), // convert email into lowercase
//                 password : encryptedPassword,
//                 // confirmpassword : encryptedPassword+
//             });

//             //const u1 = await user.save();
//             // create jwt token
//             //const token = jwt.sign(
//               //  {
//                 //    user_id : user._id, email
//                // },
//                // process.env.TOKEN_KEY,
//                // {
//                  //   expiresIn: "2h",
//                // }
//             //);
            
//             //save user token
//           //  user.token = token;
            
//             //return new user 
//             res.status(201).json({
//                 message : 'User Registered Successfully!',
//                 user
//             });
//         }
//         else{
//             //response for password and confirm password not match
//             res.status(401).send("Password not match!")
//         }
//     }
//     catch(err){
//         res.status(400).send('Invalid inputs')
//         console.log(err);
//     }
//     //Registration logic end
// });

module.exports = router