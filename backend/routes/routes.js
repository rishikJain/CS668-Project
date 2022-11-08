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
                "vulnerability":["CVE-2016-6627","CVE-2022-29581"],
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

//Get riskscore
router.post('/calculateRiskScore', async (req, res) => {
    try {
        assetId = req.body.assetId;
        if (assetId){
        // add logic to calculate risk score based on assetIds then send risk score.
        // calculate with help of formula for selected assetids
        } 
        res.json({ 
            "score" : 4,
            "mitigations" : [
                "Disable or Remove Feature or Program",
                "User Training",
                "Privileged Account Management",
                "Code Signing",
                "Password Policies",
                "Multi-factor Authentication",
                "Restrict File and Directory Permissions",
                "Disable or Remove Feature or Program",
                "User Training",
                "Privileged Account Management",
                "Code Signing",
                "Password Policies",
                "Multi-factor Authentication",
                "Restrict File and Directory Permissions",
                "Disable or Remove Feature or Program",
                "User Training",
                "Privileged Account Management",
                "Code Signing",
                "Password Policies",
                "Multi-factor Authentication",
                "Restrict File and Directory Permissions",
                "Disable or Remove Feature or Program",
                "User Training",
                "Privileged Account Management",
                "Code Signing",
                "Password Policies",
                "Multi-factor Authentication",
                "Restrict File and Directory Permissions"
            ]
        })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get riskscore
router.post('/assetMitigations', async (req, res) => {
    try {
        assetId = req.body.assetId;
        if (assetId){
        // add logic to show mitigations for asset ids based on there cve
        // recalculate risk score and send in this APIb
        } 
        res.json({ score : 4 })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
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