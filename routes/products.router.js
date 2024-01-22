// routes/products.router.js

import express from 'express';
const router = express.Router();

import mongoose from 'mongoose';
import Products from '../schemas/products.schema.js';

router.post('/products', async (req, res) => {
    const {title, content, author, password} = req.body;

    if (!title || !content || !author || !password) {
        return res.status(400).json({ errorMessage: '데이터 형식이 올바르지 않습니다.' });
    }

    const createProduct = await Products.create({
        title: title,
        content: content,
        author: author,
        password: password,
    });

    return res.status(201).json({ message: '판매 상품을 등록하였습니다.' });
})

router.get('/products', async (req, res) => {
    const products = await Products.find({}, { content: 0, password: 0 })
    .sort({ createdAt: -1 });
    if(products.length === 0) {
        res.status(400).json({
            "message" : "상품 목록 조회 실패",
        })
    } else { 
        res.status(200).json({"data" : products});
    }
})

router.get('/products/:productId', async (req, res) => {
    const { productId } = req.params;
    const product = await Products.findById(productId, { password: 0 });

    if (!product) {
        res.status(400).json({
            "message": "상품 조회에 실패하였습니다.",
        });
    } else {
        res.status(200).json({ "data": product });
    }
});

router.put('/products/:productId', async (req, res) => {
    const {title, content, password, status} = req.body;
    const {productId} = req.params;
    const existsProducts = await Products.findById(productId);
    
    if (!productId || !title || !content || !password || !status) {
        return res.status(400).json({ "message": "데이터 형식이 올바르지 않습니다." });
    }
    if(!existsProducts) {
        return res.status(404).json({"message": "상품 조회에 실패하였습니다."})
    }
    if(password !== existsProducts.password) {
        return res.status(401).json({"message": "상품을 수정할 권한이 존재하지 않습니다." })
    }

    await Products.updateOne(
        { _id: productId },
        {
            $set: {
                title: title,
                content: content,
                status: status
            }
        }
    );

    res.json({ "message": "상품을 수정하였습니다." });

})

router.delete('/products/:productId', async (req, res) => {
    const { productId } = req.params;
    const { password } = req.body;
 
    const existsProducts = await Products.findById(productId);
    if (!productId || !password) {
        return res.status(400).json({ "message": "데이터 형식이 올바르지 않습니다." });
    }
    if(!existsProducts) {
        return res.status(404).json({"message": "상품 조회에 실패하였습니다."})
    }
    if(password !== existsProducts.password) {
        return res.status(401).json({"message": "상품을 삭제할 권한이 존재하지 않습니다." })
    }
    if(existsProducts && password === existsProducts.password) {
        await Products.deleteOne({ _id: productId});
    }

    res.json({"message": "상품을 삭제하였습니다."});
})

export default router;