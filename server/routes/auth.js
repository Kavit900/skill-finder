const express = require('express');
const validator = require('validator');

const router = new express.Router();
const db = require('../database/database');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(5);
const jwt = require('jsonwebtoken');

/**
 * Validate the sign up form
 * 
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips and a global message for the whole form.
 */
function validateSignupForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';
    
    if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
        isFormValid = false;
        errors.email = 'Please provide a correct email address.';
    }
    
    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
        isFormValid = false;
        errors.password = 'Password must have at least 8 characters.';
    }
    
    if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
        isFormValid = false;
        errors.name = 'Please provide your name';
    }
    
    if (!isFormValid) {
        message = 'Check the form for errors.';
    }
    
    return {
        success: isFormValid,
        message,
        errors
    };
}

/**
 * Validate the login form
 * 
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
    const errors = {};
    let isFormValid = true;
    let message = '';
    
    if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
        isFormValid = false;
        errors.email = 'Please provide your email address';
    }
    
    if (!payload || typeof payload.password !== 'string' || payload.password.trim().length ===0) {
        isFormValid = false;
        errors.password = 'Please provide your password';
    }
    
    if (!isFormValid) {
        message = 'Check the form for errors';
    }
    
    return {
      success: isFormValid,
      message,
      errors
    };
}

/**
 * Method that creates a new user and saves it in the database
 * 
 * @param {object} payload - the HTTP body message
 * @param {object} res     - the result json that we send based on success or fail
 * @returns {object} The result of create user. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */ 
function createUser(payload, res) {
    let password = bcrypt.hashSync(payload.password, salt);
    let query = "INSERT INTO users (name, password, email, phone) VALUES ('" + payload.name + "', '" + password + "', '" + payload.email + "', '" + payload.phone + "')";

    db.query(query).spread(function(result, metadata){
        return res.status(200).json({
            success: true,
            message: 'You have successfully signed up! Now you should be able to log in.'
        });
    }).catch(function(err){
        return res.status(500).json({
           success: false,
           message: err
        });
    });
}

/**
 * Method that creates a new user and saves it in the database
 * 
 * @param {object} payload - the HTTP body message
 * @param {object} res     - the result json that we send based on success or fail
 * @returns {object} The result of login. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */ 
function logInUser(payload, res) {
    let submittedPassword = payload.password;
    let query = "SELECT * FROM users WHERE email='" + payload.email + "'";
    
    let successFlag = true;
    let errorMessage = '';
    
    db.query(query).spread(function(result, metadata) {
       if (result.length > 0) {
           let userData = result[0];
           let isVerified = bcrypt.compareSync(submittedPassword, userData.password);
           if (isVerified) {
               delete userData.password;
               // User authenticated, send a web token also
               let tokenUser = jwt.sign(userData, process.env.SECRET, {
                   expiresIn: 60*60*24
               })
               successFlag = true;
               return res.status(200).json({
                  success: successFlag,
                  userData: userData,
                  token: tokenUser
               });
           } else {
               successFlag = false;
               errorMessage = 'Incorrect Password';
           }
       } 
    }).catch(function(err){
       return res.status(500).json({
           success: false,
           message: err
       })
    });
} 

router.post('/signup', (req, res) => {
   const validationResult = validateSignupForm(req.body);
   if (!validationResult.success) {
       return res.status(400).json({
          success: false,
          message: validationResult.message,
          errors: validationResult.errors
       });
   }
   
   createUser(req.body, res);
});

router.post('/login', (req, res) => {
   const validationResult = validateLoginForm(req.body);
   if (!validationResult.success) {
       return res.status(400).json({
          success: false,
          message: validationResult.message,
          errors: validationResult.errors
       });
   }
   
   logInUser(req.body, res);
});

module.exports = router;