import React from 'react' 
import SingularGraphTooltip from './graph-tooltip'
import { parseJSON, format } from "date-fns"
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts'


const CountryOverviewGraph = ({active_country, field, full_field_name, width, height}) => {
    
    
    const filteredData = active_country.time_series.filter(t => parseInt(t[field]) > 0)
      
    filteredData.forEach(t => {
      t.dateString = format(parseJSON(t.date), 'MMM dd') 
    })

    if(filteredData.length){
      return (
        <LineChart width={width} height={height} data={filteredData} margin={{ bottom: 25, top: 15, right: 10 }}>
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
              <Line type="monotone" dataKey="confirmed" name="Total confirmed cases" stroke="#ff793f" dot={false} strokeWidth={3}/> :
            full_field_name == 'deaths' ? 
              <Line type="monotone" dataKey="deaths" name="Total deaths" stroke="#ff5252"dot={false} strokeWidth={3}/> 
              :
            full_field_name == 'confirmed_per_mil' ? 
              <Line type="monotone" dataKey="confirmed_per_mil" name="Confirmed cases per million" stroke="#ff793f" formatter={value => value.toFixed(2)}dot={false} strokeWidth={3}/> 
              :
              <Line type="monotone" dataKey="deaths_per_mil" name="Deaths per million"stroke="#ff5252" formatter={value => value.toFixed(2)}dot={false} strokeWidth={3}/>
          }
          <Tooltip content={SingularGraphTooltip}/>
          <Legend verticalAlign="top" iconType="square"/>
          
        </LineChart>
      )
    }
    return <><p className="is-size-4">No Deaths to Graph!</p></>
}

export default CountryOverviewGraph