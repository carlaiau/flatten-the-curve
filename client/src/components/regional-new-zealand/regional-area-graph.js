import React from 'react' 
import { parseJSON, format } from "date-fns"
import {AreaChart, Area, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts'
import RegionalGraphTooltip from '../regional-graph-tooltip'


const RegionalAreaGraph = ({active_region, width, height, scale}) => {
    
    
    const filteredData = active_region.time_series.filter(t => parseInt(t.total) > 0)
    
    console.log(filteredData)
    filteredData.forEach((t,i) => {
      t.dateString = format(parseJSON(t.dateObject), 'MMM dd') 
      t.index = i
    })
    
    
    
    return (
      <AreaChart width={width} height={height} data={filteredData} margin={{ bottom: 25, top: 15, right: 10, left: 10 }}>
        <defs>
          <linearGradient id="confirmed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff5252" stopOpacity={1}/>
            <stop offset="100%" stopColor="#ff5252" stopOpacity={0.25}/>
          </linearGradient>
          <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff793f" stopOpacity={1}/>
            <stop offset="95%" stopColor="#ff793f" stopOpacity={0.25}/>
          </linearGradient>
        </defs>
        
        
        <XAxis 
          dataKey="index"
          name="Days"
          type="number"
          tickCount={8}
          domain = {[0, active_region.time_series[active_region.time_series.length - 1].day]}
          >
            <Label value="Days since first confirmed case" offset={-15} position="insideBottom" />
          </XAxis>
        
        <YAxis width={55} scale={scale} domain={['auto', 'auto']} interval="preserveStart" tickCount={9}/>
        
        <Area type="monotone" dataKey="total" name="Total" stroke="#ff793f" fillOpacity={1} fill="url(#total)" dot={false} strokeWidth={1}/>
        <Area type="monotone" dataKey="confirmed" name=" Confirmed" stroke="#ff5252" fillOpacity={1} fill="url(#confirmed)" dot={false} strokeWidth={1}/>
        <Tooltip content={RegionalGraphTooltip}/>
        <Legend verticalAlign="top" iconType="square"/>
        
      </AreaChart>
    )
    
}

export default RegionalAreaGraph