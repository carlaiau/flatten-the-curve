import React, { useContext } from 'react'
import {GlobalStateContext} from "../context/GlobalContextProvider"
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts'

const CumulativeGraph = ({countries_to_graph = [], field = 'confirmed', max_days = 30, daily_increase = 1.333, growth_label="33% daily Increase", scale="log"}) => {
    const {cumulative_confirmed, cumulative_deaths} = useContext(GlobalStateContext)
    
    const ready_to_graph = [];
    (field == 'confirmed' ? cumulative_confirmed : cumulative_deaths).filter(c => countries_to_graph.includes(c.country_name)).forEach((c) => {
        
        c[field].forEach(time => {
            if(ready_to_graph.length <= parseInt(time.num_day)){
                ready_to_graph[time.num_day] = {
                    num_day: time.num_day,
                    [c.country_name]: time[field]
                }
            }
            else ready_to_graph[time.num_day][c.country_name] = time[field]

        })
        
    })

    const colors= [
        "#218c74",
        "#34ace0",
        "#2c2c54",
        "#33d9b2",
        "#b33939",
        "#ffda79",
        "#706fd3",
        "#474787",
        "#ff793f",
        "#cd6133",
        "#40407a",
        "#227093",
        "#ffb142",
        "#ccae62",
        "#cc8e35",
        "#ff5252"
        
    ]

    // Make one big array of objects 
    if(countries_to_graph.length > 1){
        for(let i = 0; i < max_days; i++){
            if(i == 0) ready_to_graph[i][growth_label] = field == 'confirmed' ? 100: 10
            else ready_to_graph[i][growth_label] = (ready_to_graph[i - 1][growth_label] * daily_increase).toFixed(0)
        }
    }


    if(countries_to_graph.length == 0) return (
        <>
            <LineChart width={1000} height={500} margin={{right: 20}}>
                <Tooltip/>
                <Legend align="right" verticalAlign="middle" layout="vertical" iconType="square"/>
            </LineChart>
        </>
    )

    return (

        <>
            <LineChart width={1000} height={500} data={ready_to_graph} margin={{right: 20}}>
                
                <YAxis width={55} type="number" scale={scale} domain={['auto', 'auto']} interval="preserveStart" tickCount={9}/>
                <XAxis dataKey="num_day" name="Days" type="number" interval="number" tickCount={0}/>
                {Object.keys(ready_to_graph[0]).filter(key => key != 'num_day' && key != growth_label).map( (key, i) => {
                    return <Line type="monotone" stroke={colors[i]} dataKey={key} dot={false} strokeWidth={3}/>
                })}
                {
                    countries_to_graph.length > 1 ? (
                        <Line type="monotone" stroke='#aaa' dataKey={growth_label} strokeOpacity={0.25} dot={false} strokeWidth={3}/>
                    ): <></>
                }
                
                <Tooltip/>
                <Legend align="right" verticalAlign="middle" layout="vertical" iconType="square"/>
            
            </LineChart>
        </>
    )
}

export default CumulativeGraph