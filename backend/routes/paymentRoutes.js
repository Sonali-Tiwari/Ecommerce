const express =require("express");
const {createdOrder,verifyPayment}=require('../controllers/paymentControllers');
const router=express.Router();

router.post("/order",createdOrder);
router.post("/verify",verifyPayment);

module.exports=router;