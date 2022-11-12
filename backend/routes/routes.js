const express = require('express');
const Model = require('../models/model');
const threatVulMapping = require('../models/threatVulMapping');
const threatProbMapping = require('../models/threatProbMapping');
const mitigtions = require('../models/mitigations');
const router = express.Router();
var axios = require('axios');


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

//Post Method
router.post('/post', async (req, res) => {
    const data = new Model({ asset: req.body.asset });
    var cveArr = [];
    var count = 0;

    try {
        // make a call to nist api to fetch cve list
        for (let i = 0; i < data.asset.length; i++) {
            axios.get(`https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=${data.asset[i].asset}`)
                .then(resp => {
                    for (let j = 0; j < resp.data.vulnerabilities.length; j++) {
                        cveArr.push({ key: data.asset[i].asset, value: resp.data.vulnerabilities[j].cve.id });
                    }
                    count += 1;
                })
                .catch(err => {
                    console.error(err);
                });
        }

        while (data.asset.length != count) {
            await sleep(10);
        }

        // build a dict for assetId : cve
        dict = {}
        for (let i = 0; i < cveArr.length; i++) {

            if (dict[cveArr[i]['key']] == undefined)
                dict[cveArr[i]['key']] = []

            dict[cveArr[i]['key']].push(cveArr[i]['value'])
        }


        // add vuln and id to asset array coming from req.body
        for (let i = 0; i < data.asset.length; i++) {
            data.asset[i]['vuln'] = dict[data.asset[i].asset]
            data.asset[i]['_id'] = i;
        }

        const dataToSave = await data.save();
        res.status(200).json([
            data
        ])
    }
    catch (error) {
        console.log(error.message);
        res.status(400).json({ message: error.message })
    }
})

//Get riskscore
router.post('/calculateRiskScore', async (req, res) => {
    try {
        assetId = req.body.assetId;
        if (assetId) {

            var data = await Model.findById({ '_id': assetId })

            for (let i = 0; i < data.asset.length; i++) {
                for (let j = 0; j < data.asset[i].vuln.length; j++) {
                    let threats = await threatVulMapping.find({ 'Vuln': data.asset[i].vuln[j] }, { Technique: 1, _id: 0 }).distinct('Technique');
                    data.asset[i]['threats'] = threats;
                }
            }

            for (let i = 0; i < data.asset.length; i++) {
                var sum = 0;
                if (data.asset[i].threats.length > 0) {
                    for (let k = 0; k < data.asset[i].threats.length; k++) {

                        let cveProb = await threatProbMapping.find({ 'Technique': data.asset[i].threats[k] }, { _id: 0 });
                        sum += parseFloat(cveProb[0].Probability);
                        data.asset[i]['prob'] = sum;
                    }
                } else {
                    data.asset[i]['prob'] = 0;
                }
            }

           var updatedResult = await Model.findByIdAndUpdate({'_id' : assetId}, data)

        }
        res.json({
            "score": 4,
            "mitigations": [
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
        if (assetId) {
            var data = await Model.findById({ '_id': assetId })

            for(let i=0; i<data.asset.length; i++) {
                if (data.asset[i].threats.length > 0) {

                    for( let j=0; j<data.asset[i].threats.length; j++) {
                        let mitigations = await mitigtions.find({'Technique' : data.asset[i].threats[j] },{Mitigation:1,_id:0})
                        data.asset[i]['mitigations'] = mitigations
                    }
                }
            }
           console.log(JSON.stringify(data));

            // add logic to show mitigations for asset ids based on there cve
            // recalculate risk score and send in this APIb
            // var updatedScore = 10 - 0.05 * mitigationsNumber
        }
        res.json({ score: "updatedScore" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


//Get all threat-vuln
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

//Get all threat-prob
router.get('/threatProb', async (req, res) => {
    const a = req.query.skip;
    const b = req.query.limit
    try {
        const data = await threatProbMapping.find({}).skip(a).limit(b);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


module.exports = router;