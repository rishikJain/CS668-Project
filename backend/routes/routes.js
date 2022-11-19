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
            // console.log("data: " + data);

            for (let i = 0; i < data.asset.length; i++) {
                //var tempdata = []
                var val = []
                for (let j = 0; j < data.asset[i].vuln.length; j++) {
                    //let threats = await threatVulMapping.find({ 'Vuln': data.asset[i].vuln[j] }, { Technique: 1, _id: 0 });
                    val.push(data.asset[i].vuln[j])

                    //if (threats.length != 0)
                    //    tempdata.push(threats)
                }
                let threats  = await threatVulMapping.find({ 'Vuln' : { $in : val}});
                
                var dictThreats = []
                for(let j=0;j<threats.length;j++){
                    dictThreats.push(threats[j]['Technique'])
                }
                //console.log('\nthreat: ', new Set(dictThreats))
                data.asset[i]['threats'] = [dictThreats];
            }

            //console.log(">> JSON data: " + JSON.stringify(data));

            let threatdicts = {}
            for (let i = 0; i < data.asset.length; i++) {
                    for (let j = 0; j < data.asset[i].threats[0].length; j++) {
                        
                        var threatvar = data.asset[i].threats[0][j]
                        if (threatdicts[threatvar] == undefined) {
                            threatdicts[threatvar] = new Set();
                        }

                        if(!threatdicts[threatvar].has(i)){
                            threatdicts[threatvar].add(i);
                        }
                    }
                    //console.log('\nthreat: ', threatdicts)
            }

            let newthreat = []
            for (const key in threatdicts) {
                let sizelist = threatdicts[key].size
                threatdicts[key] = sizelist
                newthreat.push([key, sizelist])
            }

            for (let i = 0; i < data.asset.length; i++) {
                data.asset[i]['threats'] = [threatdicts];
                //data.asset[i]['threats123'] = newthreat
            }
           
            for (let j=0; j<data.asset.length; j++){
                if (data.asset[j].threats.length > 0) {
                var newDict = {};
                var sum = 0;                    
                    for (const key in data.asset[j].threats[0]){
                        let cveProb = await threatProbMapping.find({ 'Technique': key }, { _id: 0, Technique: 0 });
                        console.log(j,'--key--',key,'---value---' ,data.asset[j].threats[0][key] ,'---prob----', parseFloat(cveProb[0].Probability)*data.asset[j].threats[0][key]);
                        // data.asset[0].threats[0][key] = parseFloat(cveProb[0].Probability)*data.asset[j].threats[0][key];
                        newDict[key] = parseFloat(cveProb[0].Probability)*data.asset[j].threats[0][key]
                        sum += data.asset[j].threats[0][key];
                    }
                    data.asset[j]['likeliness'] = [newDict];
                    data.asset[j]['riskScore'] = sum;
                } else {
                    data.asset[j]['prob'] = 0;
                    data.asset[j]['riskScore'] = 0;
                }
                totalimpactscore += (data.asset[j].priority)
                totalRiskScore += (sum * (data.asset[j].priority))
            }

            for (let i = 0; i < data.asset.length; i++) {
                data.asset[i]['systemRiskScore'] = totalRiskScore / totalimpactscore
                data.asset[i]['contribution'] = (((data.asset[i]['riskScore'] * data.asset[i].priority) / data.asset[i]['systemRiskScore']) / totalimpactscore) * 100
            }


            // console.log('___________', JSON.stringify(data));
            var updatedResult = await Model.findByIdAndUpdate({ '_id': assetId }, data)
        }
        res.json({
            result: data
        })
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

//Get riskscore
router.post('/assetMitigations', async (req, res) => {
    try {
        assetId = req.body.assetId;
        if (assetId) {
            var data = await Model.findById({ '_id': assetId })
            //console.log(JSON.stringify(data));

            for (let i = 0; i < data.asset.length; i++) {
                var mitArr = [];
                if (data.asset[i].threats.length > 0) {
                    for (let j = 0; j < data.asset[i].threats.length; j++) {
                        for (const key in data.asset[i].threats[0]) {
                            let mitigations = await mitigtions.find({ 'Technique': key }).distinct('Mitigation');
                            //console.log('--mitigations--', mitigations);
                            for (let k = 0; k < mitigations.length; k++) {
                                mitArr.push(mitigations[k]);
                            }
                            const uniqueMitigations = Array.from(new Set(mitArr))
                            data.asset[i]['mitigations'] = uniqueMitigations;
                        }
                    }
                }
            }


            var sysThreatsArr = [];
            var score = '';

            for ( let i=0; i<data.asset.length; i++){
                    score = data.asset[i].systemRiskScore;

                    for (var key in data.asset[i].threats[0] ){
                        sysThreatsArr.push([ key , parseFloat(data.asset[i].threats[0][key].toFixed(2))])
                    }
            }
            const sortedThreatsData = sysThreatsArr.sort((a, b) => b[1] - a[1])

            let mitigationsSortedArr = [];
            let arrThreatMap = []
            for (let i=0; i<sortedThreatsData.length; i++){
                let mitigationsElement = await mitigtions.find({ 'Technique': sortedThreatsData[i][0] }, { Mitigation: 1, _id: 0 }).distinct('Mitigation');
                arrThreatMap.push({key : sortedThreatsData[i][0],value :mitigationsElement});

                if(mitigationsElement.length > 0) {
                        for(let k=0; k<mitigationsElement.length; k++){
                            mitigationsSortedArr.push(mitigationsElement[k]);
                    }
                }
            }
            for(let k=0; k<data.asset.length; k++){
                data.asset[k]['arrayThreatMap'] = arrThreatMap
            }
            console.log('--updated data--',JSON.stringify(data));
            var updatedResult = await Model.findByIdAndUpdate({ '_id': assetId }, data)
            let uniq  = [... new Set(mitigationsSortedArr)];

            res.json({ result:{
                mitigations : uniq,
                systemRiskScore : score
            } })

        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/reduceRiskscore', async (req, res) => {
    try {

        let assetId = req.body.assetId;
        let mitigations = req.body.mitigations;
        console.log('--params--', mitigations);

        let data = await Model.findById({ '_id': assetId });
        let systemRiskScore = data.asset[0].systemRiskScore;
        let techArr = [];
        for(let i=0; i<mitigations.length; i++){
            for(let k=0; k<data.asset[0].arrayThreatMap.length; k++){
                if (data.asset[0].arrayThreatMap[k].value.includes(mitigations[i])){
                    techArr.push(data.asset[0].arrayThreatMap[k].key);
                }
            }            
        }
        let getUniq = [... new Set(techArr)];
        let finalArr = []
        let sum =0;
        for ( let i=0; i<getUniq.length; i++){
            let cveProb = await threatProbMapping.find({ 'Technique': getUniq[i] }, { _id: 0, Technique: 0 });
            let reducedProb = cveProb[0].Probability - 0.05;
            if(reducedProb > 0){
                finalArr.push(reducedProb);
            }
        }
        finalArr.forEach(e => {
            sum += e;
        })
        res.json({ score: systemRiskScore - sum })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
})



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