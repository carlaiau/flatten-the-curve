import React from 'react' 
import { parseJSON, format } from "date-fns"
import {AreaChart, Area, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts'
import RegionalGraphTooltip from './regional-graph-tooltip'


const RegionalAreaGraph = ({active_region, width, height, scale, tidy}) => {
    
    
    const filteredData = active_region.time_series.filter(t => parseInt(t.confirmed) > 0)
    
    console.log(filteredData)

    let has_tests = false
    let has_confirmed = false
    let has_hospitalized = false
    let has_deaths = false

    filteredData.forEach((t,i) => {
      t.dateString = format(parseJSON(t.date), 'MMM dd') 
      t.index = i
      
      if(t.tests > 0) has_tests = true
      else t.tests = null

      if(t.confirmed > 0) has_confirmed = true
      else t.confirmed = null
      
      if(t.deaths > 0) has_deaths = true
      else t.deaths = null

    })
    
    
    
    return (
      <AreaChart width={width} height={height} data={filteredData} margin={{ bottom: 25, top: 15, right: 10, left: 10 }}>
        <defs>
          <linearGradient id="tests" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#218c74" stopOpacity={1}/>
                <stop offset="100%" stopColor="#218c74" stopOpacity={0.25}/>
            </linearGradient>
          
          <linearGradient id="confirmed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff793f" stopOpacity={1}/>
            <stop offset="100%" stopColor="#ff793f" stopOpacity={0.25}/>
          </linearGradient>

          <linearGradient id="deaths" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff5252" stopOpacity={1}/>
            <stop offset="100%" stopColor="#ff5252" stopOpacity={0.25}/>
          </linearGradient>
        </defs>
        
        
        <XAxis 
          dataKey="index"
          name="Days"
          type="number"
          >
            <Label value="Days since first confirmed case" offset={-15} position="insideBottom" />
          </XAxis>
        
        <YAxis width={75} scale={scale} domain={['auto', 'auto']} />
        { has_tests ? 
          <Area type="monotone" dataKey="tests" name="Tests" stroke="#218c74" fillOpacity={1} fill="url(#tests)" dot={false} strokeWidth={1}/>
        : <></> }
        { has_confirmed ? 
          <Area type="monotone" dataKey="confirmed" name="Confirmed" stroke="#ff793f" fillOpacity={1} fill="url(#confirmed)" dot={false} strokeWidth={1}/>
        : <></> }
        { has_deaths ? 
          <Area type="monotone" dataKey="deaths" name="Deaths" stroke="#ff5252" fillOpacity={1} fill="url(#deaths)" dot={false} strokeWidth={1}/>
        : <></> }
       
        
        <Tooltip content={RegionalGraphTooltip}/>

        <Legend verticalAlign="top" iconType="square"/>
        
      </AreaChart>
    )
    
}

export default RegionalAreaGraph