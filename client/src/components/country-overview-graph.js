import React from 'react' 
import SingularGraphTooltip from './graph-tooltip'
import { parseJSON, format } from "date-fns"
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts'


const CountryOverviewGraph = ({active_country, width, height, scale}) => {
    
    
    const filteredData = active_country.time_series.filter(t => parseInt(t.confirmed) > 0)
    
    console.log(filteredData)
    filteredData.forEach(t => {
      t.dateString = format(parseJSON(t.date), 'MMM dd') 
    })

    
    if(filteredData.length){
      return (
        <LineChart width={width} height={height} data={filteredData} margin={{ bottom: 25, top: 15, right: 10, left: 10 }}>
          <XAxis 
            dataKey="index"
            name="Days"
            type="number"
            >
              <Label value="Days since first confirmed case" offset={-15} position="insideBottom" />
            </XAxis>
          
          <YAxis width={55} scale={scale} domain={['auto', 'auto']} interval="preserveStart" tickCount={12}/>
        
          <Line type="monotone" dataKey="confirmed" name="Confirmed" stroke="#ff793f" dot={false} strokeWidth={3}/>
          <Line type="monotone" dataKey="deaths" name="Deaths" stroke="#ff793f" dot={false} strokeWidth={3}/> 
          <Line type="monotone" dataKey="recovered" name="Recovered" stroke="#ff793f" dot={false} strokeWidth={3}/>
          <Tooltip content={SingularGraphTooltip}/>
          <Legend verticalAlign="top" iconType="square"/>
          
        </LineChart>
      )
    }
    return <p className="is-size-3"><strong>No Deaths!</strong></p>
}

export default CountryOverviewGraph