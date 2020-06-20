const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { pool } = require('../models/dbConfig')
const passport = require('passport');


router.get('/', (req, res) => {
    res.render('index')
})

router.get('/users/register', (req, res) => {
    res.render('register')
})

router.get('/users/login',(req, res) => {
    res.render('login')
})

router.get("/users/logout", (req, res) => {
    req.logout();
    res.render("index", { message: "You have logged out successfully" });
})

router.post('/users/register', async (req, res) => {
    let {name, email, password, password2 } = req.body;
    const errors = [];
    console.log({
        name,
        email,
        password,
        password2
    });

    if (!name || !email || !password || !password2) {
        errors.push({ message: "Please enter all fields" });
    }
    
    if (password.length < 6) {
       errors.push({ message: "Password must be a least 6 characters long" });
    }
    
     if (password !== password2) {
       errors.push({ message: "Passwords do not match" });
    }

    if (errors.length > 0) {
        res.render("register", { errors, name, email, password, password2 });
    } else {
        let hashedPassword = await bcrypt.hash(password, 4)
        console.log(hashedPassword);

        pool.query(
            `SELECT * FROM users
            WHERE email=$1`,[email],(err, result)=>{
                if(err){
                    console.log(err);
                }
                console.log(result.rows);

                if(result.rows.length > 0){
                    return res.render("register", {
                        message: "Email Already Registered"
                    });
                } else {
                    pool.query(
                        `INSERT INTO users (name, email, password)
                        VALUES ($1, $2, $3)
                        RETURNING id, password`,
                        [name, email, hashedPassword],
                        (err, results)=>{
                            if(err){
                                throw err;
                            }
                            console.log(results.rows);
                            req.flash("success_msg", "You are now registered. Please log in");
                            res.redirect("/users/login");              
                        }
                    )
                }
            }
            
        )
    }
})

router.post('/users/login', passport.authenticate("local", {
    successRedirect: "/author",
    failureRedirect: "/users/login",
    failureFlash: true
}))
  

module.exports = router