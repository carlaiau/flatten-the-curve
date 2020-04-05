import React from 'react' 
import {BarChart, Bar, XAxis, YAxis, Tooltip, Label} from 'recharts'



const RegionalBarGraph = ({active_region, width, height, type}) => {
    

    if(type == 'percent'){
        /*output_data.forEach(d => {
            d.percent = (d.value / active_region.highest.total).toFixed(2)
        })*/
    }
    
    /*
    <BarChart width={width} height={height} data={output_data}
            margin={{bottom: 20 }}
        >
            <defs>
                <linearGradient id="bars" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#218c74" stopOpacity={1}/>
                <stop offset="100%" stopColor="#218c74" stopOpacity={0.33}/>
            </linearGradient>
            </defs>
            <XAxis dataKey="name" name="Age Group">
                <Label value="Age Group" position="bottom"/>
            </XAxis>
            <YAxis  interval="preserveEnd" tickCount={9}/>
            <Tooltip />
            <Bar dataKey={type == 'percent' ? "percent" : "value" } fillOpacity={1} fill="url(#bars)" name="Total Cases"/>
      </BarChart>
    */
    
    return (
        <></>

    )
    
}

export default RegionalBarGraph