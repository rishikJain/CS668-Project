import React from 'react'
import ReactSpeedometer from "react-d3-speedometer";
import { CustomSegmentLabelPosition } from 'react-d3-speedometer';

/**
* @author
* @function speedoMeter
**/

const SpeedoMeter = (props) => {
    return (
        <div>
            <ReactSpeedometer 
            // maxSegmentLabels={0}
                 customSegmentLabels={[
                    {
                      text: "Low",
                      position: CustomSegmentLabelPosition.Outside,
                      color: "#138808",
                    },
                    {
                      text: "Medium",
                      position:CustomSegmentLabelPosition.Outside,
                      color: '#FF9933',
                    },
                    {
                        text: "High",
                        position: CustomSegmentLabelPosition.Outside,
                        color: '#EF4135',
                      },
                ]}
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
    )

}

export default SpeedoMeter