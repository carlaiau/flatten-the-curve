import React from 'react' 
import SingularGraphTooltip from './graph-tooltip'
import { parseJSON, format } from "date-fns"
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts'


const CountryOverviewGraph = ({active_country, field, full_field_name, width, height, scale}) => {
    
    
    const filteredData = active_country.time_series.filter(t => parseInt(t[field]) > 0)
      
    filteredData.forEach(t => {
      t.dateString = format(parseJSON(t.date), 'MMM dd') 
    })

    // Add growth to the countryOverView too!
    const growth_label =   `${field =='confirmed' ? 'Cases' :'Deaths'} double every 3 days`
    
    const growth_rate = 1.25992105
    
    let found_for_growth = false

    if( (full_field_name == 'confirmed' && active_country.highest.confirmed >= 100) || (full_field_name == 'deaths' && active_country.highest.deaths >= 10) ){  
      filteredData.forEach( (t, i) => {
        if(found_for_growth){
          t.growth = (filteredData[i - 1].growth * growth_rate).toFixed(0)
        }
        else{
          if(t[field] >= ( field == 'confirmed' ? 100 : field == 'deaths' ? 10 : Infinity)){
            found_for_growth = true
            t.growth = t[field]
          }
          else{
            t.growth = null
          }
        }
      })
    }
    
    if(filteredData.length){
      return (
        <LineChart width={width} height={height} data={filteredData} margin={{ bottom: 25, top: 15, right: 10 }}>
          <XAxis 
            dataKey="index"
            name="Days"
            type="number"
            >
              <Label value="Days since first confirmed case" offset={-15} position="insideBottom" />
            </XAxis>
          
          <YAxis width={55} scale={scale} domain={['auto', 'auto']} interval="preserveStart" tickCount={9}/>
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
          {
            found_for_growth ?
              <Line type="monotone" stroke='#aaa' name={growth_label} dataKey='growth' strokeOpacity={0.5} dot={false} strokeWidth={3} isAnimationActive={true}/>
            : 
              <></>
          }  
          <Tooltip content={SingularGraphTooltip}/>
          <Legend verticalAlign="top" iconType="square"/>
          
        </LineChart>
      )
    }
    return <p className="is-size-3"><strong>No Deaths!</strong></p>
}

export default CountryOverviewGraph