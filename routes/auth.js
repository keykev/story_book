const express = require('express')
const router = express.Router()
const passport = require('passport')


//GET   auth with google
router.get('/google',passport.authenticate('google',{ scope: ['profile'] }))


//GET   auth with google callback
router.get('/google/callback',passport.authenticate('google',{failureRedirect: '/'}),(req, res) => {
    res.redirect('/dashboard')
})


//GET   logout
router.get('/logout',(req,res) => {
    req.logout()
    res.redirect('/')   
})


module.exports = router






