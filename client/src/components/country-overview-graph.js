import React from 'react' 
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts'


const CountryOverviewGraph = ({active_country, field, full_field_name, width}) => {
    
    const filteredData = active_country.time_series.filter(t => parseInt(t[field]) > 0)
    
    if(filteredData.length){
      return (
        <LineChart width={width >= 768 ? 620 : 303} height={width >= 768 ? 372 : 150} data={filteredData} margin={{ bottom: 25, top: 15 }}>
          <XAxis 
            dataKey="index"
            name="Days"
            type="number"
            scale="time">
              <Label value="Days Since First Confirmed Case" offset={-15} position="insideBottom" />
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
              <Line type="monotone" dataKey="deaths_per_mil" name="Deaths per million"stroke="#ff5252"/>
          }
          <Tooltip/>
          <Legend verticalAlign="top"/>
          
        </LineChart>
      )
    }
    return <React.Fragment><p className="is-size-4">No Results to Graph!</p></React.Fragment>
}

export default CountryOverviewGraph