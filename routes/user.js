const router=require('express').Router();

router.get('/testuser',(req,res)=>{
    //res.send("user test successful");
    res.json("username not valid")
})

module.exports =router