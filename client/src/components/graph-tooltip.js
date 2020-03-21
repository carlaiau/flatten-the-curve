import React from 'react'

import styled from '@emotion/styled'
const SingularGraphTooltip = (tooltipProps)  => {

    if(! tooltipProps.hasOwnProperty('payload')  || ! tooltipProps.payload.length) return <></>

    const {value, dataKey, payload } = tooltipProps.payload[0]

    
    
    

    const TooltipBox = styled('div')`
        padding: 3px 5px !important;
        color: #fff;
        strong{
            color: #fff;
        }
        &.confirmed{
            background: #ff793f;
        }
        &.death{
            background: #ff5252;
        }
        &.historical{
            background: #227093;
        }
    
    `   
    let date = payload.dateString
    let outputString = new Intl.NumberFormat().format(value, 2)
    let customClass = 'confirmed'
    
    
    const {offset = 0} = payload
    
    switch(dataKey){
        case "confirmed":
            outputString += ' cases'
            
            break;
        case "confirmed_per_mil":
            outputString += ' cases per million'    
            break;

        case "deaths":
            outputString += ' deaths'
            customClass = 'death'            
            break;
        
            case "deaths_per_mil":
            outputString += ' deaths per million'
            customClass = 'death'
            break;
        
        case "real_deaths":
            customClass = 'historical'
            outputString += ' deaths'
            break;
        case "real_confirmed":
            customClass = 'historical'
            outputString += ' cases'
            break;
    }
        
        return (
            <TooltipBox className={`box ${customClass}`}>
                <p className="is-size-7">
                    {date ? date : ''}
                    <br/>
                    <strong>
                    {outputString}
                    </strong>
                </p>
            </TooltipBox>
        )
}
export default SingularGraphTooltip