import React from 'react'

import styled from '@emotion/styled'
const SingularGraphTooltip = (tooltipProps)  => {

    if(! tooltipProps.hasOwnProperty('payload')) return <></>

    if(! tooltipProps.payload || tooltipProps.payload.length == 0) return <></>

    const {value, dataKey, payload } = tooltipProps.payload[0]    
    
    let growth = 0
    
    tooltipProps.payload.forEach(p => {
        if(p.dataKey == 'growth') growth = p.value
    })
    
    

    
    
    

    const TooltipBox = styled('div')`
        padding: 3px 5px !important;
        color: #fff;
        p{
            color: #fff;
        }
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
        &.growth{
            background: #fff;
            p{
                color: #4a4a4a
            }
            strong{
                color: #333;
            }
        }
    
    `   
    let date = payload.dateString
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
        case "real_confirmed":
            customClass = 'historical'
            outputString += ' cases'
            break;
    }
        
        return (
            <>
                <TooltipBox className={`box ${customClass}`}>
                    <p className="is-size-7">
                        {date ? date : ''}
                        <br/>
                        <strong>
                        {outputString}
                        </strong>
                    </p>
                </TooltipBox>
                { 
                    growth ?
                    <TooltipBox className={`box growth`}>
                        <p className="is-size-7">
                            Cumulative<br/>
                            Growth
                            <br/>
                            <strong>
                            {new Intl.NumberFormat().format(growth, 2)}
                            </strong>
                        </p>
                    </TooltipBox>
                    : <></>
                }

                { 
                    growth  & growth > value ?
                    <TooltipBox className={`box has-background-dark`}>
                        <p className="is-size-7">
                            Below by
                            <br/>
                            <strong>
                            {new Intl.NumberFormat().format(growth - value, 2)}
                            </strong>
                        </p>
                    </TooltipBox>
                    : <></>
                }
                { 
                    growth  & growth < value ?
                    <TooltipBox className={`box has-background-newt`}>
                        <p className="is-size-7">
                            Above by<br/>
                            <strong>
                            {new Intl.NumberFormat().format(value - growth, 2)}
                            </strong>
                        </p>
                    </TooltipBox>
                    : <></>
                }
            </>
        )
}
export default SingularGraphTooltip