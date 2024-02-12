const express = require('express');
const mongoose = require('mongoose');
const { mongoUrl } = require('../config/api');
const users = require('../models/login-model');
let router = express.Router();

mongoose.connect(mongoUrl, {}).then(()=>{
    console.log("MongoDB success");
}).catch((e)=>{
    console.log(e);
});

let loginState = {
    isLogged: false,
    loginName: "",
    isAdmin: false
}
router
.get((req, res) => {
    res.render('login');
})

router
.route('/login')
.get((req, res) => {
    res.render('login');
})
.post(async (req, res) => {

    try {
        const check = await users.findOne({name: req.body.username});
        if(!check) {
            res.send("Username not found");
        }
        if(check.name=="Shakhnur"){
            loginState={
                isLogged: true,
                isAdmin: true
            }
            res.redirect("admin")
            return;
            
        }
        if(req.body.password === check.password) {
            res.redirect("home");
        }
    } catch (error) {
        res.send("wrong Details");
    }

});

router
.route('/signup')
.get((req, res) => {
    res.render("signup");
})
.post(async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
        
    };

    const existingUser = await users.findOne({name: data.name});
    if(existingUser) {
        res.send("User already exists");
    } else {
        const userData = users.insertMany(data);
        res.render("login");
        console.log(userData);
    }

});

router
.route('/home')
.get((req, res) => {
    res.render("home");
})
.post(async (req, res) => {

    res.write("Welocome home");

});
router
.route('/')
.get((req, res) => {
    res.render("home");
})
.post(async (req, res) => {

    res.write("Welocome home");

});
module.exports = router;



router
.route('/admin')
.get((req, res) => {
    if (loginState.isAdmin) {
        res.render("admin")
    } else {
        res.send("YOU ARE NOT ADMIN!!!!")
    }
    
})
router
.route('/logout')
.post(async (req, res) => {

    loginState = {
        isLogged: false,
        loginName: "",
        isAdmin: false
    }
    res.redirect("login")
});
router
.route('/admin/deleteUser')
.post(async (req, res) => {
    const check = await users.findOne({name: req.body.deleteUsername})
    if (!check) {
        res.send("User not found");
        return;
    }
    try {
        await users.deleteOne({name: req.body.deleteUsername});
        res.send("User deleted");
        return;
    } catch (error) {
        console.log(error);
    }
    
    res.redirect('back');
});
router
.route('/profile/edit')
post(authenticateUser, async (req, res) => { 
    try { 
        const loggedInUserId = req.session.userId; 
        const { userId, newUsername, newPassword } = req.body; 
        const currentDate = new Date(); 
 
        const loggedInUser = await client.db("users").collection("users").findOne({ _id: new ObjectId(loggedInUserId) }); 
 
        if (loggedInUser && loggedInUser.admin_status === 'admin') { 
            await client.db("users").collection("users").updateOne( 
                { _id: new ObjectId(userId) }, 
                { $set: { username: newUsername, password: newPassword, update_date: currentDate } } 
            ); 
        } else { 
            await client.db("users").collection("users").updateOne( 
                { _id: new ObjectId(loggedInUserId) }, 
                { $set: { username: newUsername, password: newPassword, update_date: currentDate } } 
            ); 
        } 
 
        res.redirect('/profile'); 
    } catch (error) { 
        console.error('Error updating user profile:', error); 
        res.status(500).json({ error: 'Internal Server Error' }); 
    } 
});