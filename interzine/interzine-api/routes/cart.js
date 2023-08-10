const express = require("express");
const router = express.Router();
const security = require("../middleware/security");
const Cart = require("../models/cart");

router.post('/totalCost', (req,res, next)=>{
    try{
      const total= Cart.computeTotal({cart: req.body.items, menus: req.body.menus})
      res.status(201).json({total})
    } catch(err) {
        next(err)
    }
  })


module.exports=router