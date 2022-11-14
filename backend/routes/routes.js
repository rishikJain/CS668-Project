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
        var totalRiskScore = 0;
        var totalimpactscore = 0;

        if (assetId) {

            var data = await Model.findById({ '_id': assetId })
            //console.log("data: " + data);
            for (let i = 0; i < data.asset.length; i++) {
                var tempdata=[]
                for (let j = 0; j < data.asset[i].vuln.length; j++) {
                    //console.log(data.asset[i])
                    let threats = await threatVulMapping.find({ 'Vuln': data.asset[i].vuln[j] }, { Technique: 1, _id: 0 });
                    //console.log('===',threats);
                    if(threats.length != 0)
                        tempdata.push(threats)
                }
                data.asset[i]['threats'] = tempdata;
            }
        
       
            for (let i = 0; i < data.asset.length; i++) {
                let threatdicts = {}
                if(data.asset[i].threats.length > 0){
                    for (let j = 0; j < data.asset[i].threats[0].length; j++) {
                        var threatvar = data.asset[i].threats[0][j]['Technique']
                        if(threatdicts[threatvar] == undefined){
                            threatdicts[threatvar] = [];
                        }
                    
                        threatdicts[threatvar].push(i);
                    }
                }
                //console.log(threatdicts)
                data.asset[i]['threats'] = [threatdicts];
            }
            var newData = data;

            for (let i = 0; i < data.asset.length; i++) {
                let newthreat = []
                if(data.asset[i].threats.length > 0){

                    for ( const key in data.asset[i].threats[0] ) {
                        var setcount = new Set(data.asset[i].threats[0][key])
                        data.asset[i].threats[0][key] = setcount.size
                        newthreat.push([key , setcount.size])
                    }
                }
                newData.asset[i]['threats123'] =  newthreat
            }

            console.log('_____threatsss', JSON.stringify(data));



        
            for (let i = 0; i < data.asset.length; i++) {
              
                if (data.asset[i].threats.length > 0) {
                    var sum=0;
                    for (let k = 0; k < data.asset[i].threats.length; k++) {
                        for ( const key in data.asset[i].threats[k] ) {
                            let cveProb = await threatProbMapping.find({ 'Technique':key }, { _id: 0, Technique: 0 });
                            data.asset[i].threats[k][key] = parseFloat(cveProb[0].Probability)*(data.asset[i].threats[k][key]);
                            sum += data.asset[i].threats[k][key];
                        }
                    } 
                    data.asset[i]['riskScore'] = sum;

                } else {
                    data.asset[i]['prob'] = 0;
                    data.asset[i]['riskScore'] = 0;
                }
                totalimpactscore += (data.asset[i].priority)
                totalRiskScore += (sum * totalimpactscore)
            }
            for(let i =0;i < data.asset.length; i ++){
                data.asset[i]['systemRiskScore'] = totalRiskScore/totalimpactscore
                data.asset[i]['contribution'] = (((data.asset[i]['riskScore'] * data.asset[i].priority) / data.asset[i]['systemRiskScore']) /totalimpactscore) * 100
            }


           console.log('___________',JSON.stringify(data));
           var updatedResult = await Model.findByIdAndUpdate({'_id' : assetId}, data)
        }
        res.json({
           result : newData
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
            // console.log(JSON.stringify(data));

            for(let i=0; i<data.asset.length; i++) {
                var mitArr = [];
                if (data.asset[i].threats.length > 0) {
                    for( let j=0; j<data.asset[i].threats.length; j++) {
                        //console.log(data.asset[i].threats[0])
                        for ( const key in data.asset[i].threats[0] ) {
                            let mitigations = await mitigtions.find({'Technique': key},{Mitigation:1,_id:0}).distinct('Mitigation');
                            mitArr.push(mitigations);
                            data.asset[i]['mitigations'] = mitArr;
                        }
                    }
                }
            }
            console.log('____',JSON.stringify(data));
        }
        res.json({ result : data })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/reduceRiskscore', async (req, res) => {
    try {

        score = req.body.score;
        mitigationsNumber = req.body.mitigationsNumber;
        if (mitigationsNumber) {
             var updatedScore = score - 0.05 * mitigationsNumber
        }
        res.json({ score: updatedScore })
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