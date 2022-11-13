import React, { useContext, useEffect } from 'react'
import ReactSpeedometer from "react-d3-speedometer";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { green } from "@material-ui/core/colors";
import {
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Checkbox, Paper, Dialog,DialogActions,DialogContent,DialogTitle,DialogContentText
} from '@material-ui/core'
// import { Collapse,IconButton} from '@material-ui/core'
// import CloseIcon from '@mui/icons-material/Close';
// import { Alert } from '@mui/material';
import Context from './context';
import { useState } from 'react';

/**
* @author
* @function speedoMeter
**/

let override = {
    position: "absolute",
    top: "50%",
};

const RiskScore = (props) => {
    const { valueForRisk } = useContext(Context)
    const navigate = useNavigate();
    let [loading, setLoading] = useState(false);
    let [color, setColor] = useState(green);
    const [scorevalue, setScoreValue] = useState(valueForRisk?.score)
    const [riskCount, setRiskCount] = useState([])
    const [open, setOpen] = React.useState(false);
    useEffect(() => {
        if (valueForRisk === null) {
            navigate("/")
        }
    }, [valueForRisk])

    const handleRiskScore = () => {
        if (riskCount?.length != 0) {
            let object = { mitigationsNumber: riskCount?.length }
            console.log(object)
            let myurl = "http://localhost:4000/api/assetMitigations"
            startLoader();
            axios.post(myurl, object, {
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(response => {
                console.log(response)
                setScoreValue(response?.data?.score)
                startLoader()
            })
        } else {
            setOpen(true)
        }
    }

    const startLoader = () => {
        setLoading(loading => !loading)
    }


    return (
        <div className='main'>
            <div style={{
                display: "flex",
                flexDirection: "row", justifyContent: "space-around",
                alignItems: "center"
            }}>
                <div style={{ position: "relative", top: "50px" }}>
                    <div style={{ width: "50%", height: "50%" }}>
                        <ReactSpeedometer
                            // forceRender={true}
                            value={scorevalue}
                            maxValue={10}
                            width={500}
                            height={500}
                            ringWidth={6}
                            needleColor="blue"
                            needleTransitionDuration={4000}
                            needleTransition="easeElastic"
                            segmentColors={['#138808', '#FF9933', '#EF4135']}
                            segments={3}
                        />
                    </div>
                </div>
                <div style={{ width: "50%", height: "50%", marginRight: "40px" }}>
                    <TableContainer component={Paper}
                        style={{ maxHeight: "400px" }}>
                        <Table
                            stickyHeader
                            aria-label="sticky table"
                            size="small"
                            padding="checkbox">
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        style={{
                                            fontWeight: 'bold', backgroundColor: 'lavender',
                                            justifyContent: "center"

                                        }}>
                                        <Checkbox
                                            color="primary"
                                            checked={valueForRisk?.mitigations?.length === riskCount.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setRiskCount((prev) => {
                                                        return valueForRisk?.mitigations?.map((value, i) => {
                                                            return i
                                                        }) ?? prev
                                                    })
                                                } else {
                                                    setRiskCount([])
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell
                                        style={{ fontWeight: 'bold', backgroundColor: 'lavender' }}
                                        sortDirection='asc'>Mitigations
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {valueForRisk?.mitigations?.map((row, i) => (
                                    <TableRow
                                        key={i}
                                        hover
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell style={{
                                            justifyContent: "center",
                                        }}>
                                            <Checkbox
                                                color="primary"
                                                checked={riskCount.includes(i)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setRiskCount((prev) => { return [...prev, Number(e.target.value)] })
                                                    } else {
                                                        setRiskCount((prev) => {
                                                            const arr = [...prev]
                                                            const index = prev.indexOf(i)
                                                            if (index > -1) {
                                                                arr.splice(index, 1)
                                                                return arr
                                                            }
                                                            return prev
                                                        })
                                                    }
                                                }}
                                                value={i}
                                            />
                                        </TableCell>
                                        <TableCell >{row}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <button className="button" onClick={handleRiskScore}>Reduce Risk Score</button>
                </div>
                <div style={{
                    position: "absolute",
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
            {/* <Collapse in={open}>
                <Alert
                    severity="error"
                    action={
                        <IconButton
                            aria-label="close"
                            color="error"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                   Please Select atleast one mitigation(s) to reduce the risk score
                </Alert>
            </Collapse> */}
            <Dialog open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Warning"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Please Select atleast one mitigation(s) to reduce the risk score
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <button className="button" onClick={() => setOpen(false)}>Close</button>
                </DialogActions>
            </Dialog>

        </div>

    )

}

/**
* @author
* @function RiskScore
**/


export default RiskScore