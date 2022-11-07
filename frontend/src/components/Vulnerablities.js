import React, { useContext, useEffect } from 'react'
import Context from './context'
import { useTable } from 'react-table'
// import {Table} from '@mui/material';
// import TableCell from '@mui/material/TableCell';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core'
import { styled } from '@material-ui/styles'
import { ThemeProvider } from '@material-ui/core'
import { useNavigate } from 'react-router-dom';

/**
* @author
* @function 
**/

// const theme = createTheme({
//     palette: {
//       primary: {
//         // Purple and green play nicely together.
//         main: purple[500],
//       },
//       secondary: {
//         // This is green.A700 as hex.
//         main: '#11cb5f',
//       },
//     },
//   });

// const useStyles = makeStyles((theme) => ({
//     table: {
//         minWidth: 20,
//     },
//     tableContainer : {
//         borderRadius:25,
//         margin:'10px 10px',
//         maxWidth:300,
//     },
//     tableheader : {
//         fontWeight:'bold',
//         backgroundColor:theme.palette.primary.dark,

//     }
// }))


const Vulnerability = (props) => {
    const navigate = useNavigate();
    const { value } = useContext(Context)
    useEffect(() => {
        if (value === null) {
            console.log(value)
            navigate("/")
        }
    }, [value])

    const handleRisk =() => {
        navigate("/riskscore")
    }
    return (
        <div className='main'>
            <div style = {{top: "50%",
    position: "absolute",
    width:"800px",
    //height:"500px",
    transform:"translate(-50%,-50%)",
    left: "50%"}}>
                <TableContainer component={Paper} 
                style = {{maxHeight:"400px"}}>
                    <Table sx={{minWidth: 20}}  
                       stickyHeader 
                       aria-label="sticky table" 
                       size="small" 
                       padding="checkbox">
                        <TableHead>
                            <TableRow>
                                <TableCell 
                                style={{ fontWeight: 'bold',backgroundColor:'lavender'}} 
                                sortDirection='asc'>Asset</TableCell>
                                <TableCell 
                                style={{ fontWeight: 'bold',backgroundColor:'lavender'}}>DeviceType</TableCell>
                                <TableCell 
                                style={{ fontWeight: 'bold',backgroundColor:'lavender'}}>Priority</TableCell>
                                <TableCell 
                                style={{ fontWeight: 'bold',backgroundColor:'lavender'}} >Vulnerabilities</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {value?.map((row, i) => (
                                <TableRow
                                    key = {i}
                                    hover
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="col" sortDirection='asc'>
                                        {row.asset}
                                    </TableCell>
                                    <TableCell >{row.deviceType}</TableCell>
                                    <TableCell >{row.priority}</TableCell>
                                    <TableCell >{row.vulnerability.map((ro,i) => {
                                        return (<React.Fragment key = {i} >
                                            {Boolean(i) && <span>,</span>}
                                            <span>{ro}</span> </React.Fragment>)
                                    })}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <button className="button" onClick={handleRisk}>Calculate Risk Score</button>
            </div>
        </div>
    )
}

export default Vulnerability;