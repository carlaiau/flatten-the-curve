import React, { useContext } from 'react'
import {GlobalStateContext} from "../context/GlobalContextProvider"
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts'
import CumulativeGraphTooltip from "../components/cumulative-graph-tooltip"

const CumulativeGraph = ({
    max_count = 40, 
    height, // height of the graph itself
    width, // Width of the graph itself
    countries_to_graph = [], 
    field = 'confirmed', 
    max_days = 30, 
    growth = 1.33, 
    scale="log",
    case_start

}) => {

    const {cumulative_confirmed, cumulative_deaths} = useContext(GlobalStateContext)
    
    // Array of Objects 
    const ready_to_graph = [];

    const all_possible_countries = (
        field == 'confirmed' ? cumulative_confirmed[case_start].filter(c => c) : 
        cumulative_deaths[case_start].filter(c => c) 
    ).slice(0, max_count)
    

    all_possible_countries
        .filter(c => countries_to_graph.includes(c.country_name))
        
        .forEach((c) => {
            c.time_series.forEach(time => {
            if(ready_to_graph.length <= parseInt(time.num_day)){
                ready_to_graph[time.num_day] = {
                    num_day: time.num_day,
                    [c.country_name]: time[field]
                }
            }
            else ready_to_graph[time.num_day][c.country_name] = time[field]

        })
        
    })


    // This is to ensure that colors do not change as the number of countries gets added / removed
    let color_definitions = {}
    const colors= [
        "#b33939", "#e84118", "#2c2c54", "#218c74", "#4cd137",
        "#33d9b2", "#34ace0", "#ffda79", "#706fd3", "#474787", 
        "#ff793f", "#cd6133", "#40407a", "#227093", "#ffb142", 
        "#ccae62", "#cc8e35", "#ff5252", "#8c7ae6", "#f6e58d", 
        "#30336b", "#95afc0", "#e1b12c", "#40739e", "#ff7979",
        "#7ed6df", "#686de0", "#ffbe76", "#e056fd", "#f9ca24",
        "#eb4d4b", "#22a6b3", "#4834d4", "#f0932b", "#be2edd",
        "#ED4C67", "#FFC312", "#FDA7DF", "#C4E538", "#12CBC4", 
        "#B53471", "#F79F1F", "#D980FA", "#A3CB38", "#1289A7", 
        "#833471", "#EE5A24", "#9980FA", "#009432", "#0652DD", 
        "#6F1E51", "#EA2027", "#5758BB", "#006266", "#1B1464",
    ]
    all_possible_countries.forEach( (c, i) => {
        color_definitions[c.country_name] = colors[i]
    })
    
    

    

    // Make one big array of objects 
    if(countries_to_graph.length > 0){
        for(let i = 0; i < max_days; i++){
            if(i == 0){
                if(typeof ready_to_graph[i] != 'undefined')
                    ready_to_graph[i].growth = case_start
            }
            else if(typeof ready_to_graph[i] != 'undefined')
                ready_to_graph[i].growth = (ready_to_graph[i - 1].growth * growth).toFixed(0)
             
        }
    }
    else{
        ready_to_graph.push({})
        for(let i = 0; i < max_days; i++){
            ready_to_graph[0].num_day = i
        }
    }


    if(countries_to_graph.length == 0) return (
        <>
            <LineChart width={width} height={height}  margin={{right: 20}}>
                <Tooltip/>
                <Legend align="right" verticalAlign="middle" layout="vertical" iconType="square"/>
            </LineChart>
        </>
    )

    return (

        <>
            <LineChart width={width} height={height} data={ready_to_graph}>
                
                <YAxis width={55} type="number" scale={scale} domain={['auto', 'auto']} interval="preserveStart" tickCount={9}/>
                <XAxis dataKey="num_day" name="Days" type="number" interval="number" tickCount={0}/>
                {Object.keys(ready_to_graph[0]).filter(key => key != 'num_day' && key != 'growth').map( (key, i) => {
                    return <Line type="monotone" stroke={color_definitions[key]} key={key} dataKey={key} dot={false} strokeWidth={3} isAnimationActive={false}/>
                })}
                {
                    countries_to_graph.length > 0 ? (
                        <Line type="monotone" stroke='#aaa' name={`${((growth - 1) * 100).toFixed(0)}% Daily Growth`} 
                            dataKey="growth" strokeOpacity={0.25} dot={false} strokeWidth={3} isAnimationActive={false}/>
                    ): <></>
                }
                
                <Tooltip content={CumulativeGraphTooltip}/>
                <Legend align="right" verticalAlign="middle" layout="vertical" iconType="square"/>
            
            </LineChart>
        </>
    )
}

export default CumulativeGraph