import React from 'react' 
import {BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Label, CartesianGrid} from 'recharts'



const RegionalBarGraph = ({active_region, width, height, type}) => {
    
    const ages = active_region.highest.ages
    
    const data = []
    const combined_under_10 = {
        name: '0 - 9',
        value: 0
    }
    const combined_teen = {
        name: '10 to 19',
        value: 0
    }

    Object.keys(ages).forEach( key => {
        const clean_name = key.replace("_", "").replace(/_/g, " ")

        if(
            clean_name != "1" && 
            clean_name != "1 to 4" && 
            clean_name != "5 to 9" &&
            clean_name != "10 to 14" &&
            clean_name != "15 to 19"
            ){
            data.push({
                name: clean_name,
                value: ages[key]
            })
        }
        else if(clean_name == "10 to 14" || clean_name == "15 to 19"){
            combined_teen.value += ages[key]
        }
        else{
            combined_under_10.value += ages[key]
        }
    })

    const output_data = [
        combined_under_10,
        combined_teen,
        ... data
    ]

    if(type == 'percent'){
        output_data.forEach(d => {
            d.percent = (d.value / active_region.highest.total).toFixed(2)
        })
    }
    
    
    return (
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

    )
    
}

export default RegionalBarGraph