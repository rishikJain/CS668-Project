
import { ThemeProvider, createMuiTheme, TextField, Select, MenuItem } from "@material-ui/core";
import React, { useState, useRef, useEffect, useContext } from "react";
import { SingleSelect } from "react-select-material-ui";
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@material-ui/core'
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import { blue, green } from "@material-ui/core/colors";
import Context from "./context";
/**
* @author
* @function risk
**/

const theme = createMuiTheme({});



// const defaultValues = {
//   multipleSelect: [1],
//   singleSelect: 1

// };

let override = {
  position: "absolute",
  top: "50%",
};

// const overrid: CSSProperties = {

// }
let arrOfJsonObj = [];
let data = [];
let notCheckingTheHandle = false;
let sendDashBoardData = {}

const optionsForDev = [
  {
    value: "PC",
    label: "Laptop/Personal computer"
  },
  {
    value: "NW",
    label: "Network"
  },
  {
    value: "DB",
    label: "Data Base"
  },
  {
    value: "SER",
    label: "Server"
  }
];

// export const useContext = React.createContext()

const Risk = (props) => {
  const { setValue } = useContext(Context);
  const navigate = useNavigate();
  const [asset, setAssetType] = useState('');
  const [deviceType, setDeviceType] = useState(null);
  const [priority, setPriority] = useState('');
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState(green);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false)
  const [openForSub,setopenForSub] = useState(false)
  const [submit,setSubmit] = useState(true)
  const [errorForAsset, seterrorForAsset] = useState(false)
  const [errorForPriority, seterrorForPriority] = useState(false)
  const [errorForDev, seterrorForDev] = useState(false)

  useEffect(() => {
    return () => {
      setAssetType('')
      setDeviceType('')
      setPriority('')
      setOpen(false)
      setSubmit(true)
      setopenForSub(false)
      arrOfJsonObj = []
      // <Context.Provider></
    }
  }, [])

  const commonForAddandSubmit = () => {
    let object = { asset, deviceType, priority }
    arrOfJsonObj.push(object)
    return arrOfJsonObj
  }


  const handleSub = (event) => {
    commonErrors()
    if (!(asset === '' || deviceType === null || priority === '') || arrOfJsonObj.length != 0) {
      if (!notCheckingTheHandle && asset && deviceType && priority) {
        setopenForSub(true)
      } else {
        setOpen(true)
        setSubmit(false)
        sendDashBoardData = { asset: arrOfJsonObj }
      }
    } else {
      setSubmit(true)
      setopenForSub(true)
    }
    event.preventDefault()
  }

  const sendData = () => {
    setOpen(false)
    startLoader()
      let myurl = "http://18.191.203.136:4000/api/post"
      axios.post(myurl, sendDashBoardData, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then(response => {
        setValue(response.data[0])
        startLoader()
        navigate("/Vulnerablities")
      })
        .catch(error => { });
  }

  const startLoader = () => {
    setLoading(loading => !loading)
  }

  const commonErrors = () => {
    seterrorForDev(false)
    seterrorForAsset(false)
    seterrorForPriority(false)
  }

  const handleAddIterm = (event) => {
    commonErrors()
    if (!(asset === '' || deviceType === null || priority === '')) {
      notCheckingTheHandle = true;
      commonForAddandSubmit()
      setCount(count => count + 1)
      setSubmit(true)
      setOpen(true)
    } else {
      commonForErrorPut()
    }
    event.preventDefault();

  }

  const handleClose = () => {
    setOpen(false)
    if (submit === true) {
      setAssetType('')
      setPriority('')
      setDeviceType(null)
    }
  }

  const handleCloseForSub = () => {
    setopenForSub(false)
  }

  const commonForErrorPut = () => {
    if (asset === '') {
      seterrorForAsset(true)
    } if (priority === '') {
      seterrorForPriority(true)
    } if (deviceType === null) {
      seterrorForDev(true)
    }
  }


  return (
    <ThemeProvider theme={theme}>
      <div className="main">
        <form className="form">
          <div className="container">
            <h4>Risk Management and Vulnerability assessment</h4>
            <div>
              <SingleSelect className="selectclass for-red--line"
                value={deviceType}
                options={optionsForDev}
                error={errorForDev}
                label="DeviceType"
                helperText={errorForDev ? "Required" : ""}
                onChange={value => {
                  setDeviceType(value);
                  seterrorForDev(!(Boolean(value)))
                }}
                SelectProps={{
                  isClearable: true,
                  isSearchable: true
                }}
              />
            </div>
            <div className="margin-set">
              <TextField className="selectclass"
                value={asset}
                label="Asset"
                error={errorForAsset}
                helperText={errorForAsset ? 'Required' : ''}
                variant="standard"
                type="text"
                onChange={(event) => {
                  setAssetType(event.target.value)
                  seterrorForAsset(!(Boolean(event.target.value)))
                }}
              // inputRef={refForAsset}
              />
            </div>
            <div className="margin-set">
              <TextField className="selectclass"
                value={priority}
                inputProps={{ min: 0 }}
                label="Impact"
                error={errorForPriority}
                helperText={errorForPriority ? 'Required' : ''}
                vvariant="standard"
                type="number"
                // inputRef={refForPriority}
                onChange={event => {
                  setPriority(event.target.value)
                  seterrorForPriority(!(Boolean(event.target.value)))

                }}
                onKeyPress={(event) => {
                  if (event?.key === '-' || event?.key === '+') {
                    event.preventDefault();
                  }
                }} />
            </div>
            <div>
              <button onClick={handleAddIterm} className="button">AddItem</button>
              <button onClick={handleSub} className="button">submit</button>
            </div>
          </div>
        </form>
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
        <Dialog open={open}
          fullWidth={true}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            {"Information"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              { submit? "Added Items are" + count : "You added " + count + " item(s).Do you want to send it?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
             {submit === false ? 
              <div>
                <button className="button" onClick={sendData}>Yes</button> 
                                 <button className="button" onClick={handleClose}>No</button>
                </div>
                                :<button className="button" onClick={handleClose}>Close</button>} 
          </DialogActions>
        </Dialog>
        <Dialog open={openForSub}
          fullWidth={true}
          onClose={handleCloseForSub}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            {"Warning"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please add atleast one item(s) before submit the form.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <button className="button" onClick={handleCloseForSub}>Close</button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  )

}

export default Risk