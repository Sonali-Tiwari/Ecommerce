const Order=require('../model/Order');

const sendEmail = require('../utils/sendEmail');

//create Order
const createOrder = async (req, res) => {
   
    try{
         const{items,totalAmount,address,paymentId}=req.body;
         if(!items || items.length===0 || !totalAmount || !address){
            return res.status(400).json({message:'No order items'});
         }
        else{
            const order=new Order({
                user:req.user._id,
                items,
                totalAmount,
                address,
                paymentId,
            });
            await order.save();
          const message = `Dear ${req.user.name},\n\nYour order has been successfully created. Here are the details:\n\nOrder ID: ${order._id}\nTotal Amount: ${totalAmount}\nShipping Address: ${address}\n\nThank you for shopping with us!\n\nBest regards,\nYour Company Name`;

            // Send email notification to the user
         await sendEmail(req.user.email, 'Order Confirmation', message);
         res.status(200).json({ message: 'Order created successfully and email sent', order });
           
        }
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const myOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.product', 'name price');
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }     
};
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email');   
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const{status}=req.body;
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = status;
            await order.save();
            res.status(200).json({ message: 'Order status updated successfully', order });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = { createOrder, myOrders, getOrders ,updateOrderStatus};