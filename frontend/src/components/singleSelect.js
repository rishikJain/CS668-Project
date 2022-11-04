import React from 'react'
import { MultipleSelect, SingleSelect } from "react-select-material-ui";
/**
* @author
* @function singleSelect
**/

const singleSelect = React.forwardRef((props, ref) => {

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
    return (
        <div>
            <SingleSelect className="selectclass"
                options={optionsForDev}
                // error ={true}
                // inputRef={refForDeviceType}
                label="DeviceType"
                // onChange={value => {
                //     setDeviceType(value);
                // }}
                SelectProps={{
                    // isClearable: true,
                    isSearchable: true
                }}
            />
        </div>
    )

})

export default singleSelect