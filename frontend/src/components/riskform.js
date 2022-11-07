
import { ThemeProvider, createMuiTheme, TextField, Select, MenuItem } from "@material-ui/core";
import React, { useState, useRef, useEffect, useContext } from "react";
import { SingleSelect } from "react-select-material-ui";
import { useNavigate } from 'react-router-dom';
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
    label: "PC"
  },
  {
    value: "NW",
    label: "NW"
  },
  {
    value: "DB",
    label: "DB"
  },
  {
    value: "SER",
    label: "Ser"
  }
];

// export const useContext = React.createContext()

const Risk = (props) => {
  const {setValue} = useContext(Context);
  const navigate = useNavigate();
  const refForDeviceType = useRef(null);
  const refForAsset = useRef('');
  const refForPriority = useRef('');
  const [asset, setAssetType] = useState('');
  const [deviceType, setDeviceType] = useState(null);
  const [priority, setPriority] = useState('');
  let [loading, setLoading] = useState(false);
  let [color, setColor] = useState(green);
  const [count, setCount] = useState(0);
  const [errorForAsset, seterrorForAsset] = useState(false)
  const [errorForPriority, seterrorForPriority] = useState(false)
  const [errorForDev, seterrorForDev] = useState(false)

  useEffect(() => {
    return () => {
      setAssetType('')
      setDeviceType('')
      setPriority('')
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
        let arr = commonForAddandSubmit()
        sendDashBoardData = { asset: arr }
      } else {
        sendDashBoardData = { asset: arrOfJsonObj }
      }
      startLoader()
      let myurl = "http://localhost:4000/api/post"
      axios.post(myurl, sendDashBoardData, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then(response => {
        setValue(response.data)
        startLoader()
        navigate("/Vulnerablities")
      })
        .catch(error => { });
    } else {
      commonForErrorPut()
    }
    notCheckingTheHandle = false
    event.preventDefault()
  }

  const startLoader = () => {
    setLoading(loading => !loading)
  }

  const commonErrors = () => {
    seterrorForDev(false)
    seterrorForAsset(false)
    seterrorForPriority(false)
    notCheckingTheHandle = false
  }

  const handleAddIterm = (event) => {
    console.log(asset, deviceType, priority)
    commonErrors()
    if (!(asset === '' || deviceType === null || priority === '')) {
      notCheckingTheHandle = true;
      commonForAddandSubmit()
      setCount(count => count + 1)
      setAssetType('')
      setPriority('')
      setDeviceType(null)
    } else {
      commonForErrorPut()
    }
    event.preventDefault();

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
            <h4>RiskManagement and Vulnerability assessment</h4>
            <div>
              <SingleSelect className="selectclass for-red--line"
                value={deviceType}
                options={optionsForDev}
                error = {errorForDev}
                label="DeviceType"
                helperText ={errorForDev?"Required":""}
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
            {/* <singleSelect /> */}
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
                label="Priority"
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
        <div style={{position:"absolute",
        backgroundColor:"white",
        height:"100vh",
        width:"100vw",
        top:"0px",
        left:"0px",
        display: loading ? "block" : "none"}}>
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
    </ThemeProvider>
  )

}

export default Risk