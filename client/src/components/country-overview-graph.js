import React from 'react' 
import styled from '@emotion/styled'
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts'


const CountryOverviewGraph = ({active_country, field, full_field_name, width}) => {
    
    const filteredData = active_country.time_series.filter(t => parseInt(t[field]) > 0)
    
    const OveriewGraph = styled(LineChart)`
      .recharts-tooltip-label{
        display: none;
      }
    `


    function tooltipContent (tooltipProps) {
      /*

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
      console.log(tooltipProps.payload)
      return <div>Yo
        
      </div>
    }

    if(filteredData.length){
      return (
        <OveriewGraph width={width >= 768 ? 620 : 303} height={width >= 768 ? 372 : 250} data={filteredData} margin={{ bottom: 25, top: 15, right: 10 }}>
          <XAxis 
            dataKey="index"
            name="Days"
            type="number"
            interval="number"
            >
              <Label value="Days since first confirmed case" offset={-15} position="insideBottom" />
            </XAxis>
          
          <YAxis width={55}/>
          {
            full_field_name == 'confirmed' ? 
              <Line type="monotone" dataKey="confirmed" name="Total confirmed cases" stroke="#ff793f"/> :
            full_field_name == 'deaths' ? 
              <Line type="monotone" dataKey="deaths" name="Total deaths" stroke="#ff5252"/> 
              :
            full_field_name == 'confirmed_per_mil' ? 
              <Line type="monotone" dataKey="confirmed_per_mil" name="Confirmed cases per million" stroke="#ff793f" formatter={value => value.toFixed(2)}/> 
              :
              <Line type="monotone" dataKey="deaths_per_mil" name="Deaths per million"stroke="#ff5252" formatter={value => value.toFixed(2)}/>
          }
          <Tooltip/>
          <Legend verticalAlign="top"/>
          
        </OveriewGraph>
      )
    }
    return <><p className="is-size-4">No Results to Graph!</p></>
}

export default CountryOverviewGraph