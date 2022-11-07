const express = require('express');
const Model = require('../models/model');
const threatVulMapping = require('../models/threadVulMapping')
const router = express.Router();

//Post Method
router.post('/post', async (req, res) => {
    const data = new Model({
        asset: req.body.asset
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json([
            {
                "id" : 1,
                "asset": "desktop",
                "deviceType": "PC",
                "priority": 1,
                "vulnerability":["CVE-2022-40617","CVE-2022-29581"],
            },
            {   
                "id" : 2,
                "asset": "desktop2",
                "deviceType": "NETWORK",
                "priority": 2,
                "vulnerability":["CVE-2022-1055","CVE-2022-20698","CVE-2021-44420"],
            },
            {
                "id" : 3,
                "asset": "desktop",
                "deviceType": "PC",
                "priority": 1,
                "vulnerability":["CVE-2022-40617","CVE-2022-29581"],
            },
            {   
                "id" : 4,
                "asset": "desktop2",
                "deviceType": "NETWORK",
                "priority": 2,
                "vulnerability":["CVE-2022-1055","CVE-2022-20698","CVE-2021-44420"],
            },
            {
                "id" : 5,
                "asset": "desktop",
                "deviceType": "PC",
                "priority": 1,
                "vulnerability":["CVE-2022-40617","CVE-2022-29581"],
            },
            {   
                "id" : 6,
                "asset": "desktop2",
                "deviceType": "NETWORK",
                "priority": 2,
                "vulnerability":["CVE-2022-1055","CVE-2022-20698","CVE-2021-44420"],
            },
            {   
                "id" : 7,
                "asset": "desktop2",
                "deviceType": "NETWORK",
                "priority": 2,
                "vulnerability":["CVE-2022-1055","CVE-2022-20698","CVE-2021-44420"],
            },
            {
                "id" : 8,
                "asset": "desktop",
                "deviceType": "PC",
                "priority": 1,
                "vulnerability":["CVE-2022-40617","CVE-2022-29581"],
            },
            {   
                "id" : 9,
                "asset": "desktop2",
                "deviceType": "NETWORK",
                "priority": 2,
                "vulnerability":["CVE-2022-1055","CVE-2022-20698","CVE-2021-44420"],
            },
            {
                "id" : 10,
                "asset": "desktop",
                "deviceType": "PC",
                "priority": 1,
                "vulnerability":["CVE-2022-40617","CVE-2022-29581"],
            },
            {   
                "id" : 11,
                "asset": "desktop2",
                "deviceType": "NETWORK",
                "priority": 2,
                "vulnerability":["CVE-2022-1055","CVE-2022-20698","CVE-2021-44420"],
            },
            {
                "id" : 12,
                "asset": "desktop",
                "deviceType": "PC",
                "priority": 1,
                "vulnerability":["CVE-2022-40617","CVE-2022-29581"],
            },
            {   
                "id" : 13,
                "asset": "desktop2",
                "deviceType": "NETWORK",
                "priority": 2,
                "vulnerability":["CVE-2022-1055","CVE-2022-20698","CVE-2021-44420"],
            },
            {
                "id" : 14,
                "asset": "desktop",
                "deviceType": "PC",
                "priority": 1,
                "vulnerability":["CVE-2022-40617","CVE-2022-29581"],
            },
            {   
                "id" : 15,
                "asset": "desktop2",
                "deviceType": "NETWORK",
                "priority": 2,
                "vulnerability":["CVE-2022-1055","CVE-2022-20698","CVE-2021-44420"],
            },
            {   
                "id" : 16,
                "asset": "desktop2",
                "deviceType": "NETWORK",
                "priority": 2,
                "vulnerability":["CVE-2022-1055","CVE-2022-20698","CVE-2021-44420"],
            },
            {
                "id" : 17,
                "asset": "desktop",
                "deviceType": "PC",
                "priority": 1,
                "vulnerability":["CVE-2022-40617","CVE-2022-29581"],
            },
            {   
                "id" : 18,
                "asset": "desktop2",
                "deviceType": "NETWORK",
                "priority": 2,
                "vulnerability":["CVE-2022-1055","CVE-2022-20698","CVE-2021-44420"],
            },
            {
                "id" : 19,
                "asset": "desktop",
                "deviceType": "PC",
                "priority": 1,
                "vulnerability":["CVE-2022-40617","CVE-2022-29581"],
            },
            {   
                "id" : 20,
                "asset": "desktop2",
                "deviceType": "NETWORK",
                "priority": 2,
                "vulnerability":["CVE-2022-1055","CVE-2022-20698","CVE-2021-44420"],
            }
        ])
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all assets
router.get('/getAll', async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get assets by ID 
router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update assets by ID 
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete assets by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all assets
router.get('/getAllVul', async (req, res) => {
    const a = req.query.skip;
    const b = req.query.limit
    try {
        const data = await threatVulMapping.find({}).skip(a).limit(b);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


module.exports = router;