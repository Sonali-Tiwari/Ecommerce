const Product = require('../model/Product');
const cloudinary = require('../config/cloudinary');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    }  catch(error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch(error) {
        res.status(500).json({ message: error.message });
    }   
};
    


// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category,stock } = req.body;
        let imageUrl = '';
        if(req.file){
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            imageUrl
        });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try{
        const product = await Product.findById(req.params.id);
        if(product) {
            await product.deleteOne();
            res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    }
        catch(error) {
            res.status(500).json({ message: error.message });
        }
    };

    const updateProduct = async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(404).json({ message: 'Product not found' });

            const { name, description, price, category, stock } = req.body;
            if (name) product.name = name;
            if (description) product.description = description;
            if (price) product.price = price;
            if (category) product.category = category;
            if (stock) product.stock = stock;

            if (req.file) {
                const result = await cloudinary.uploader.upload(req.file.path);
                product.imageUrl = result.secure_url;
            }

            const updated = await product.save();
            res.status(200).json(updated);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    module.exports = {
        getProducts,
        getProductById,
        createProduct,
        updateProduct,
        deleteProduct,
    };