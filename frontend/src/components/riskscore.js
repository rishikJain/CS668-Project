import React from 'react'
import ReactSpeedometer from "react-d3-speedometer";
import { CustomSegmentLabelPosition } from 'react-d3-speedometer';

/**
* @author
* @function speedoMeter
**/

const RiskScore  = (props) => {
    return (
        <div style={{display:"flex",flexDirection:"row",width:"100%",height:"100%",justifyContent:"space-around"}}>
            <div style={{width:"50%",height:"50%"}}>
            <ReactSpeedometer 
                // fluidWidth ={true}
                value={473}
                width={500}
                height ={500}
                ringWidth ={6}
                needleColor="blue"
                needleTransitionDuration={4000}
                needleTransition="easeElastic"
                segmentColors={['#138808','#FF9933','#EF4135']}
                segments={3}
                />
            </div>
                <div style={{width:"50%",height:"50%"}}>
                    <h1>dsfdsfsdvfsdfsdfdsfds
                        fbdsjfdsgfdhjfdshdshfg
                        dsfhjdfdshjfdsfdsjfhdskj</h1>
                </div>
        </div>
    )

}

/**
* @author
* @function RiskScore
**/


 export default RiskScore