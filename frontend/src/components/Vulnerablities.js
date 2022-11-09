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
let override = {
    position: "absolute",
    top: "50%",
  };


const Vulnerability = (props) => {
    const {setValueForRisk} = useContext(Context);
    const navigate = useNavigate();
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState(green);
    const { value } = useContext(Context)
    console.log(value)
    useEffect(() => {
        if (value === null) {
            navigate("/")
        }
    }, [value])


    const startLoader = () => {
        setLoading(loading => !loading)
      }

    const handleRisk = () => {
        let myurl = "http://localhost:4000/api/calculateRiskScore"
        startLoader();
        axios.post(myurl, {
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
                //height:"500px",
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
                                    style={{ fontWeight: 'bold', backgroundColor: 'lavender' }}>Priority</TableCell>
                                <TableCell
                                    style={{ fontWeight: 'bold', backgroundColor: 'lavender' }} >Vulnerabilities</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {value?.map((row, i) => (
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
                                    <TableCell >{row.vulnerability.map((ro, i) => {
                                        return (<React.Fragment key={i} >
                                            {Boolean(i) && <span>,</span>}
                                            <span>{ro}</span> </React.Fragment>)
                                    })}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <button className="button" onClick={handleRisk}>Calculate Risk Score</button>
                <div style={{
                    position: "absolute",
                    backgroundColor: "white",
                    height: "100vh",
                    width: "100vw",
                    top: "0px",
                    left: "0px",
                    display: loading ? "block" : "none"
                }}>
                    <ClipLoader
                        color={color}
                        loading={loading}
                        cssOverride={override}
                        size={50}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            </div>
        </div>
    )
}

export default Vulnerability;