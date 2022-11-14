import React, { useContext, useEffect,useState } from 'react'
import Context from './context'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { green } from "@material-ui/core/colors";

/**
* @author
* @function 
**/

const Vulnerability = (props) => {
    const {setValueForThreat} = useContext(Context);
    const navigate = useNavigate();
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState(green);
    const { value } = useContext(Context)
    useEffect(() => {
        if (value === null) {
            navigate("/")
        }
    }, [value])


    const startLoader = () => {
        setLoading(loading => !loading)
      }

    const handleThreat = () => {
        let myurl = "http://18.191.203.136:4000/api/calculateRiskScore"
        let object = { assetId: value?._id }
        startLoader();
        axios.post(myurl,object, {
            headers: {
              "Content-Type": "application/json",
            },
          }).then(response => {
            setValueForThreat(response.data.result)
            startLoader()
            navigate("/threats")
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
                                    sortDirection='asc'>Asset</TableCell>
                                <TableCell
                                    style={{ fontWeight: 'bold', backgroundColor: 'lavender' }}>DeviceType</TableCell>
                                <TableCell
                                    style={{ fontWeight: 'bold', backgroundColor: 'lavender' }}>Impact</TableCell>
                                <TableCell
                                    style={{ fontWeight: 'bold', backgroundColor: 'lavender' }} >Vulnerabilities</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {value?.asset?.map((row, i) => (
                                <TableRow
                                    key={i}
                                    hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="col" sortDirection='asc'>
                                        {row.asset}
                                    </TableCell>
                                    <TableCell >{row.deviceType}</TableCell>
                                    <TableCell >{row.priority}</TableCell>
                                    <TableCell >{row.vuln.map((ro, i) => {
                                        return (<React.Fragment key={i} >
                                          <ul style={{padding : "0px 0px 0px 13px"}}>
                                                        <li style = {{fontWeight:"bold"}}>{ ro}</li>
                                                    </ul></React.Fragment>)
                                    })}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <button className="button" onClick={handleThreat}>Calculate Risk Score</button>
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

export default Vulnerability;