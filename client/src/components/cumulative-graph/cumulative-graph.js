import React, { useContext } from 'react'
import {GlobalStateContext} from "../../context/GlobalContextProvider"
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts'
import CumulativeGraphTooltip from "./cumulative-graph-tooltip"

const CumulativeGraph = ({
    type_of_area = 'country',
    areas = [],
    max_area_count = 40, 
    show_all_areas = false,
    height, 
    width, 
    areas_to_graph = [], 
    field = 'confirmed', 
    max_days = 40, 
    growth = {
        label: "Doubles every 3 days",
        value: 1.25992105
    }, 
    scale="log",
    accumulateFrom

}) => {

    const {cumulative_confirmed, cumulative_deaths} = useContext(GlobalStateContext)
    
    // Array of Objects 
    const ready_to_graph = [];
    const limit = show_all_areas ? 1000 : max_area_count

    let all_possible_areas = []
    if(type_of_area == 'country'){
        all_possible_areas = (
            field == 'confirmed' ? cumulative_confirmed[accumulateFrom].filter(c => c) : 
            cumulative_deaths[accumulateFrom].filter(c => c) 
        ).slice(0,  limit )
            
    }
    else if(type_of_area == 'state'){
        all_possible_areas = (
            field == 'confirmed' ? 
                areas.confirmed[accumulateFrom].filter(c => c) : 
                areas.deaths[accumulateFrom].filter( c => c )
            )
            .slice(0, limit)
    }
    
    all_possible_areas
        .filter(c => areas_to_graph.includes(c.name))
        
        .forEach((c) => {
            c.time_series.forEach(time => {
            if(ready_to_graph.length <= parseInt(time.num_day)){
                ready_to_graph[time.num_day] = {
                    num_day: time.num_day,
                    [c.name]: time[field]
                }
            }
            else ready_to_graph[time.num_day][c.name] = time[field]

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
    all_possible_areas.forEach( (c, i) => {
        color_definitions[c.name] = colors[i]
    })
    
    

    

    // Make one big array of objects 
    if(areas_to_graph.length > 0){
        for(let i = 0; i < max_days; i++){
            if(i == 0){
                if(typeof ready_to_graph[i] != 'undefined')
                    ready_to_graph[i][growth.label] = accumulateFrom
            }
            else if(typeof ready_to_graph[i] != 'undefined')
                ready_to_graph[i][growth.label] = (ready_to_graph[i - 1][growth.label] * growth.value).toFixed(0)
             
        }
    }
    else{
        ready_to_graph.push({})
        for(let i = 0; i < max_days; i++){
            ready_to_graph[0].num_day = i
        }
    }


    if(areas_to_graph.length == 0) return (
        <>
            <LineChart width={width} height={height}  margin={{right: 20}}>
                <Tooltip/>
                <Legend align="right" verticalAlign="middle" layout="vertical" iconType="square"/>
            </LineChart>
        </>
    )

    return (
        ready_to_graph.length ?
        <>
            <LineChart width={width} height={height} data={ready_to_graph} margin={{bottom: 20}}>
                
                <YAxis width={55} type="number" scale={scale} domain={['auto', 'auto']} interval="preserveStart" tickCount={9}/>
                <XAxis dataKey="num_day" name="Days" type="number" interval="number" tickCount={0}>
                    <Label value={`Days since ${accumulateFrom}th ${field == 'confirmed' ? 'case': 'death'}`} offset={5} position="bottom" />
                </XAxis>
                {Object.keys(ready_to_graph[0])
                    .filter(key => key != 'num_day' && key != growth.label)
                    .map( (key, i) => {
                        return <Line 
                            type="monotone" 
                            stroke={color_definitions[key]} 
                            key={key} 
                            dataKey={key} 
                            dot={false} 
                            strokeWidth={3} 
                            isAnimationActive={false}
                            />
                    })
                }

                {
                    areas_to_graph.length > 0 ? (
                        <Line type="monotone" stroke='#aaa' 
                            dataKey={growth.label} strokeOpacity={0.25} dot={false} strokeWidth={3} isAnimationActive={false}/>
                    ): <></>
                }
                
                <Tooltip content={CumulativeGraphTooltip}/>
                <Legend align="right" verticalAlign="middle" layout="vertical" iconType="square"/>
            
            </LineChart>

            {Object.keys(ready_to_graph[0]).filter(key => key == 'China').length == 1 ?
                <p className="is-size-7" style={{marginTop: '10px'}}>
                    China's days have been capped to {max_days} days for presentation purposes. Without capping all other countries are bunched to the left on the X-axis.
                </p>
                :
                <></>
            }
        </>
        :
        <></>
    )
}

export default CumulativeGraph