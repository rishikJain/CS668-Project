import React, { useContext, useEffect, useState } from 'react'
import Context from './context'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { green } from "@material-ui/core/colors";

/**
* @author
* @function Threat
**/


const Threat = (props) => {
    const { setValueForRisk } = useContext(Context);
    const navigate = useNavigate();
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState(green);
    const { valueForThreat } = useContext(Context)
    useEffect(() => {
        if (valueForThreat === null) {
            navigate("/")
        }
    }, [valueForThreat])

    const startLoader = () => {
        setLoading(loading => !loading)
    }

    const handleRisk = () => {
        let myurl = "http://18.191.203.136:4000/api/calculateRiskScore"
        let object = { assetId: valueForThreat?._id }
        startLoader();
        axios.post(myurl, object ,{
            headers: {
                "Content-Type": "application/json",
            },
        }).then(response => {
            setValueForRisk(response.data)
            startLoader()
            navigate("/riskscore")
        })
    }

    return (
        <div className='main'>
            <div style={{
                top: "50%",
                position: "absolute",
                width: "800px",
                transform: "translate(-50%,-50%)",
                left: "50%"
            }}>
                <TableContainer component={Paper}
                    style={{ maxHeight: "400px" }}>
                    <Table sx={{ minWidth: 20 }}
                        stickyHeader
                        aria-label="sticky table"
                        size="small"
                        padding="checkbox">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{ fontWeight: 'bold', backgroundColor: 'lavender' }}
                                    sortDirection='asc'>Assets</TableCell>
                                <TableCell
                                    style={{ fontWeight: 'bold', backgroundColor: 'lavender' }}>Risk Score
                                </TableCell>
                                <TableCell
                                    style={{ fontWeight: 'bold', backgroundColor: 'lavender' }}>Threats 
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {valueForThreat?.asset?.map((row, i) => (
                                <TableRow
                                    key={i}
                                    hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="col" sortDirection='asc'>
                                        {row.asset}
                                    </TableCell>
                                    <TableCell >{row?.riskScore ? row?.riskScore : 0}</TableCell>
                                    <TableCell >{row?.threats ? row?.threats?.map((ro, i) => {
                                        return (<React.Fragment key={i} >
                                            {Boolean(i) && <span>,</span>}
                                            <span>{ro}</span> </React.Fragment>)
                                    }) : "No Threats available for this asset"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <button className="button" onClick={handleRisk}>Go to Mitigations</button>
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    display: loading ? "block" : "none"
                }}>
                    <ClipLoader
                        color={color}
                        loading={loading}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            </div>
        </div>
    )

}

export default Threat