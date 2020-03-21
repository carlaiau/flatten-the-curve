import React from 'react'
import { parseJSON, format } from "date-fns"
import styled from '@emotion/styled'
const SingularGraphTooltip = (tooltipProps)  => {

    if(! tooltipProps.payload.length) return <></>

    const {value, dataKey, payload } = tooltipProps.payload[0]


    const date = format(parseJSON(payload.date), 'dd MMM')

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
        /*
        This outputs this:
          0:
          stroke: "#ff793f"
          strokeWidth: 1
          fill: "#fff"
          dataKey: "confirmed"
          unit: undefined
          formatter: undefined
          name: "Total confirmed cases"
          color: "#ff793f"
          value: 63
          type: undefined
          payload: {date: "2020-03-06T11:00:00.000Z", confirmed: 63, confirmed_per_mil: 2.5207694396637628, deaths: 2, deaths_per_mil: 0.08002442665599248, …}
       */
        let outputString = new Intl.NumberFormat().format(value, 2)
        let customClass = 'confirmed'
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
            case "real_confirms":
                customClass = 'historical'
                outputString += ' cases'
                break;
      }
        
        return (
            <TooltipBox className={`box ${customClass}`}>
                <p className="is-size-7">
                    {date}
                    <br/>
                    <strong>
                    {outputString}
                    </strong>
                </p>
            </TooltipBox>
        )
}
export default SingularGraphTooltip