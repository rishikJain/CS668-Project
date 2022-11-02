import { useForm } from "react-hook-form";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import React, { useState } from "react";
import { MultipleSelect, SingleSelect } from "react-select-material-ui";
import ButtonResult from "./ButtonResult";

/**
* @author
* @function risk
**/

const theme = createMuiTheme({});

const defaultValues = {
  multipleSelect: [1],
  singleSelect: 1
};

const optionsForDev = [
    {
      value: 1,
      label: "PC"
    },
    {
      value: 2,
      label: "NW"
    },
    {
        value: 3,
        label: "DB"
    },
    {
        value: 4,
        label: "Ser"
    }
  ];

const options1 = [
  {
    value: 1,
    label: "Computers"
  },
  {
    value: 2,
    label: "Routers"
  },
  {
    value: 3,
    label: "Switches"
  },
  {
    value: 4,
    label: "Printers"
  }
];

 const Risk = (props) => {
  const { handleSubmit, reset, register, setValue } = useForm();
  const [data, setData] = useState(null);

  React.useEffect(() => {
    register("multipleSelect");
    register("singleSelect");
    setValue("multipleSelect", defaultValues.multipleSelect);
  }, [register, setValue]);


  return(
    <ThemeProvider theme={theme}>
      <div className="main">
      <form onSubmit={handleSubmit(data => setData(data))} className="form">
         <div className="container">
            <h2>RiskManagement and Vulnerability assessment</h2>
            <div>
      <SingleSelect
        name="singleSelect"
        options={optionsForDev}
        label="DeviceType"
        onChange={value => {
          setValue("singleSelect", value);
        }}
        defaultValue={defaultValues.singleSelect}
        SelectProps={{
          isCreatable: true,
          isClearable: true,
          isSearchable: true
        }}
      />
            </div>
            <div>
      <MultipleSelect
        name="multipleSelect"
        options={options1}
        label="Assets"
        onChange={value => {
          setValue("multipleSelect", value);
        }}
        defaultValues={defaultValues.multipleSelect}
        SelectProps={{
          isCreatable: true,
          isClearable: true,
          isSearchable: true
        }}
      />
           </div>
           <ButtonResult {...{ data, reset, defaultValues }} />
         </div>
       </form>
      </div>
    </ThemeProvider> 
   )

 }

 export default Risk