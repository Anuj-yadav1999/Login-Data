const express = require('express');
const router = new express.Router();
const { pool } = require('../models/dbConfig')

router.get('/author', (req, res) => {
    try{
        pool.query(
            `SELECT * FROM author`, (err, results) => {
                if(err){
                    console.log(err);
                }
                res.render('authors/Index', { 
                    result: results.rows 
                });
            }
        )
    } catch(err){
        console.log(err);
    }
});

router.post('/author', (req, res) => {
    const { name, age, address} = req.body;
    try{
        pool.query(
            `INSERT INTO author (name, age, address)
            VALUES ($1, $2, $3)
            RETURNING name, age, address`,
            [name, age, address],
            (err, result) => {
                if(err){
                    console.log(err);
                }
                res.redirect('/author');
            }
        )
    } catch(err){
        console.log(err);
    }
});

router.get('/author/new', (req, res) => {
    res.render('authors/new');
})

router.get('/author/edit/:id', (req, res) => {
    try{
        pool.query(
            `SELECT * FROM author WHERE id=${req.params.id}`, (err, results) => {
                if(err){
                    console.log(err);
                }
                res.render('authors/edit', author=results.rows[0]);
            }
        )
    } catch(err){
        console.log(err);
    }
});

router.put('/author/edit/:id', (req, res) => {
    const { name, age, address} = req.body;
    try {
        pool.query(
            `UPDATE author SET name=$1, age=$2, address=$3 WHERE id=${req.params.id}`,
            [name, age, address],
            (err, results) => {
                if(err){
                    console.log(err);
                }
                res.redirect('/author');
            }
        )
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;