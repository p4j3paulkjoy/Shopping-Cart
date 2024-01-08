const router=require('express').Router();

router.get('testuer',(req,res)=>{
    res.send("user test successful");
})

module.exports=router  