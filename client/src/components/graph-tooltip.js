import React from 'react'
import { parseJSON, format, add } from "date-fns"
import styled from '@emotion/styled'
const SingularGraphTooltip = (tooltipProps)  => {

    if(! tooltipProps.payload.length) return <></>

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
    let date = ''
    let outputString = new Intl.NumberFormat().format(value, 2)
    let customClass = 'confirmed'

    
    const {offset = 0} = payload
    
    switch(dataKey){
        case "confirmed":
            outputString += ' cases'
            date = offset != 0 ? format(add(parseJSON(payload.date), {days: offset}) ,'MMM dd') : format(parseJSON(payload.date),'MMM dd') 
            break;
        case "confirmed_per_mil":
            outputString += ' cases per million'
            date = format(parseJSON(payload.date), 'MMM dd')
            break;
        case "deaths":
            outputString += ' deaths'
            customClass = 'death'
            date = offset != 0 ? format( add(parseJSON(payload.date), {days: offset}), 'MMM dd'): format(parseJSON(payload.date), 'MMM dd')
            break;
        case "deaths_per_mil":
            outputString += ' deaths per million'
            customClass = 'death'
            date = format(parseJSON(payload.date), 'MMM dd')
            break;
        
        case "real_deaths":
            customClass = 'historical'
            outputString += ' deaths'
            date = format(parseJSON(payload.date), 'MMM dd')
            break;
        case "real_confirmed":
            customClass = 'historical'
            date = format(parseJSON(payload.date), 'MMM dd')
            outputString += ' cases'
            break;
    }
        
        return (
            <TooltipBox className={`box ${customClass}`}>
                <p className="is-size-7">
                    {date.length ? date : ''}
                    <br/>
                    <strong>
                    {outputString}
                    </strong>
                </p>
            </TooltipBox>
        )
}
export default SingularGraphTooltip