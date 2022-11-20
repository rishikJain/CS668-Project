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
        let myurl = "http://18.191.203.136:4000/api/assetMitigations"
        let object = { assetId: valueForThreat?._id }
        startLoader();
        axios.post(myurl, object ,{
            headers: {
                "Content-Type": "application/json",
            },
        }).then(response => {
            setValueForRisk(response.data.result)
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
                                    style={{ fontWeight: 'bold', backgroundColor: 'lavender' }}>Contribution
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
                                    <TableCell >{row?.contribution ? row?.contribution : 0}</TableCell>
                                    <TableCell >{Object.keys(row?.threats[0]).length!=0?
                                     Object.keys(row?.threats[0]).map((key,index)=> (
                                        <React.Fragment key={index} >
                                              <ul style={{padding : "0px 0px 0px 13px"}}>
                                                        <li style = {{fontWeight:"bold"}}>
                                                            {key}:{row?.threats[0][key]}
                                                            </li>
                                                    </ul>
                                        </React.Fragment>
                                     )): "No Threats Found"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <button className="button" onClick={handleRisk}>Go to Mitigations</button>
            </div>
            <div style={{
                    position: "absolute",
                    backgroundColor: "white",
                    height: "100vh",
                    width: "100vw",
                    top: "0px",
                    left: "0px",
                    display: loading ? "flex" : "none",
                    alignItems: "center",
                    justifyContent:"center"
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
    )

}

export default Threat