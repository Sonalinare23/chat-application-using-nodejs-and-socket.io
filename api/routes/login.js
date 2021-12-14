
const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerModel = require('../models/register');
const cookieParser = require("cookie-parser");

router.use(cookieParser());

const authorization = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.sendStatus(403);
    }
    try {
      const data = jwt.verify(token, "TOKEN_KEY");
      req.Username = data.Username;
      return next();
    } catch {
      return res.sendStatus(403);
    }
  };

router.post('/', async(req, res, next) => {
    try{
        const { email, password, Username } = req.body;

        //validate user input
        if(!(email && password)) {
            res.status(400).send('All input field is required!');
        }
        else{     
                //validate if user exist in database
                const user = await registerModel.findOne({ email });

                if (user && (await bcrypt.compare(password, user.password))) {

                    //create login token
                    const token = jwt.sign(
                        {
                           Username: Username
                        },
                        process.env.TOKEN_KEY,
                        {
                            expiresIn:"2h",
                        }
                    );
                    res.cookie('access_token', token)
                    res.render('chat')
             }
                else
                {
                    res.status(400).send("Error! \nYour Email-ID is not exist! Please register!")
                }
            }

    } 
    catch(err){
        console.log(err)
    }
})

router.get('/verify', async (req, res) => {
    const token = req.cookies.access_token;
    if(!token){
        res.render('index')
    }
    try {
        const data = jwt.verify(token, process.env.TOKEN_KEY);
        const Username = data.Username
        res.json(Username);
    } catch (error) {
       
    }
})

module.exports = router