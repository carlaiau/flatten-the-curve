import React from 'react'
import styled from '@emotion/styled'
const CumulativeGraphTooltip = (tooltipProps)  => {

    if(! tooltipProps.payload.length) return <></>

    const {label, payload } = tooltipProps


    const TooltipBox = styled('div')`
        padding: 5px 7px !important;
        color: #555;
        strong{
            color: #000
        }
        li{
            display: inline-block;
            float: none;
        }
    
    `

    const tidy = new Intl.NumberFormat()
      
    if(!payload.length)
        return <></>
    return (
        <TooltipBox className={`box`}>
            <p className="is-size-7">
                Day {label}
            </p>
            <table>
                <tbody>
            {payload.map(c => {
                return (
                <tr className="is-size-7" key={c.dataKey}>
                    <th style={{color: c.stroke}}>{c.dataKey}</th>
                    <th style={{paddingLeft: '2px', textAlign: 'right'}}>{tidy.format(c.value, 2)}</th>
                </tr>
            )})}       
            </tbody>         
            </table>
        </TooltipBox>
    )
}
export default CumulativeGraphTooltip