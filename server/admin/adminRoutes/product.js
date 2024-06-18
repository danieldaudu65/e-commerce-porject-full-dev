const express = require('express');
const router = express.Router();
const products = require('../model/products');


// endpoint to add products to the database
router.post('/addproduct', async (req, res) => {

    try {
        // distructioning what we need from the body
        const { name, image, newproductPrice, oldproductPrice } = req.body

        // find all product to determine the next id

        let productid = await products.find({});
        let id;

        // get the last produxt in the array and add up to the array the next product
        if (productid.length > 0) {
            let last_product_array = productid.slice(-1)
            let last_product = last_product_array[0];
            id = last_product.id + 1;
        }
        else {
            id = 1
        }

        const product = new products({
            id: id,
            name,
            image,
            newproductPrice,
            oldproductPrice
        });

        // save the products
        await product.save();
   
        console.log("Saved", product);
        res.status(200).send({ Success: true, name })
    }

    // check the error and catch it in the console
    catch (error) {
        console.error(`Error saving product: ${error}`);
        res.status(500).send({ Success: false, error: 'Error Saving Products' })
    }
})


//  endpoint to delete a  products from database
router.post('/removeproduct', async (req, res) => {
    try {
        //  what to recieve from the body
        const { id } = req.body
        const deletedproducts = await products.findOneAndDelete({ id })

        //  if product passed by the body isnt in the database
        if (!deletedproducts) {
            return res.status(400).send({ success: false, error: 'Product not found' })
        }  

        res.status(200).send({ Success: 'Product Removed', deletedproducts })

    }
    catch (error) {
        console.error(`Error deleting product: ${error}`);
        res.status(500).send({ Success: false, error: 'Error deleting Products' })
    }
})

router.get('/all_product', async (req, res) => {
    try {
        const all_products = await products.find({});

        if (!all_products.length === 0) {
            res.status(400).send({ status: 'fail', msg: 'No products available in the database' })
        }

        res.status(200).send({ status: true, msg: `there are ${all_products.length} products available`, all_products })
    }

    catch (error) {
        console.log('Error fetching products', error);
        res.status(500).send({ error: 'Internal server error' });

    }
})



  

module.exports = router