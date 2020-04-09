import React from 'react' 
import { parseJSON, format } from "date-fns"
import {AreaChart, Area, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts'
import RegionalGraphTooltip from './regional-graph-tooltip'

const CountryOverviewGraph = ({active_country, width, height, scale}) => {
    
    
    const filteredData = active_country.time_series.filter(t => parseInt(t.confirmed) > 0)
    const latestDay = filteredData[filteredData.length - 1]
    filteredData.forEach(t => {
      t.dateString = format(parseJSON(t.date), 'MMM dd') 
    })

    let has_tests = false
    let has_confirmed = false
    let has_hospitalized = false
    let has_deaths = false
    let has_recovered = false

    filteredData.forEach((t,i) => {
      t.dateString = format(parseJSON(t.date), 'MMM dd') 
      t.index = i
      
      if(t.tests > 0) has_tests = true
      else t.tests = null

      if(t.confirmed > 0) has_confirmed = true
      else t.confirmed = null

      if(t.hospitalized > 0) has_hospitalized = true
      else t.hospitalized = null
      
      if(t.deaths > 0) has_deaths = true
      else t.deaths = null

      if(t.recovered > 0) has_recovered = true
      else t.recovered = null

    })

    
    if(filteredData.length){
      return (
        <AreaChart width={width} height={height} data={filteredData} margin={{ bottom: 25, top: 15, right: 10, left: 10 }}>
          <XAxis 
            dataKey="index"
            name="Days"
            type="number"
            tickCount={8}
            domain = {[0, latestDay.day]}
            >
              <Label value="Days since first confirmed case" offset={-15} position="insideBottom" />
            </XAxis>
          
          <YAxis width={55} scale={scale} domain={['auto', 'auto']} interval="preserveStart" tickCount={12}/>
      
          { has_tests ? 
            <Area type="monotone" dataKey="tests" name="Tests" stroke="#218c74" fillOpacity={1} fill="#218c74" dot={false} strokeWidth={1}/>
          : <></> }
          { has_confirmed ? 
            <Area type="monotone" dataKey="confirmed" name="Confirmed" stroke="#227093" fillOpacity={1} fill="#227093" dot={false} strokeWidth={1}/>
          : <></> }
          { has_hospitalized ? 
            <Area type="monotone" dataKey="hospitalized" name="Hospitalized" stroke="#ff793f" fillOpacity={1} fill="#ff793f" dot={false} strokeWidth={1}/>
          : <></> }
          { has_deaths && has_recovered && latestDay.deaths < latestDay.recovered ?
          <Area type="monotone" dataKey="recovered" name="Recovered" stroke="#2ecc71" fillOpacity={0.9} fill="#2ecc71" dot={false} strokeWidth={1}/>
            : <></> }
          { has_deaths && has_recovered && latestDay.deaths < latestDay.recovered ?
            <Area type="monotone" dataKey="deaths" name="Deaths" stroke="#ff5252" fillOpacity={0.9} fill="#ff5252" dot={false} strokeWidth={1}/>
          : <></> }
          { has_deaths && has_recovered && latestDay.deaths > latestDay.recovered ?
            <Area type="monotone" dataKey="deaths" name="Deaths" stroke="#ff5252" fillOpacity={0.9} fill="#ff5252" dot={false} strokeWidth={1}/>
          : <></> }
          { has_deaths && has_recovered && latestDay.deaths > latestDay.recovered ?
            <Area type="monotone" dataKey="recovered" name="Recovered" stroke="#2ecc71" fillOpacity={0.9} fill="#2ecc71" dot={false} strokeWidth={1}/>
          : <></> }
          
          { has_recovered && ! has_deaths ? 
            <Area type="monotone" dataKey="recovered" name="Recovered" stroke="#2ecc71" fillOpacity={1} fill="#2ecc71" dot={false} strokeWidth={1}/>
          : <></> }
          { ! has_recovered && has_deaths ? 
            <Area type="monotone" dataKey="deaths" name="Deaths" stroke="#ff5252" fillOpacity={1} fill="#ff5252" dot={false} strokeWidth={1}/>
          : <></> }
          <Legend verticalAlign="top" iconType="square"/>
          <Tooltip content={RegionalGraphTooltip}/>
        </AreaChart>
      )
    }
    return <p className="is-size-3"><strong>No Deaths!</strong></p>
}

export default CountryOverviewGraph