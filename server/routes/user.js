const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const newMember = require('../model/newMember');
const { encryptObject, decryptObject } = require('../ecrypt');
require('dotenv').config();

router.post('/add-card', async (req, res) => {
    const { Card } = req.body;
    const token = req.header('auth-token');

    if (!token || !Card) {
        return res.status(400).send({ status: 'error', msg: 'Please fill in all details' });
    }
    try {
        // Token verification
        const user = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch initial user card details and decrypt if any
        const userM = await newMember.findById({ _id: user._id }, { Card: 1 }).lean();
        if (userM.Card) {
            // Decrypt card details
            let decrypted_Card = decryptObject(userM.Card, process.env.CRIPTO_DIGIT);
            decrypted_Card.push(Card);

            // Encrypt card details and update the user document
            const encrypted_Card = encryptObject(decrypted_Card, process.env.CRIPTO_DIGIT);
            await newMember.updateOne({ _id: user._id }, { Card: encrypted_Card });

            return res.status(200).send({ status: 'ok', msg: 'Success', card_details: decrypted_Card });
        }

        // Encrypt card details and update the user document
        const encrypted_Card = encryptObject([Card], process.env.CRIPTO_DIGIT);
        await newMember.updateOne({ _id: user._id }, { Card: encrypted_Card });

        return res.status(200).send({ status: 'ok', msg: 'Success', card_details: [Card] });
    } catch (e) {
        console.error(e);
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).send({ status: 'error', msg: 'Token verification failed' });
        }
        return res.status(500).send({ status: 'error', msg: 'An error occurred' });
    }
});

module.exports = router;
