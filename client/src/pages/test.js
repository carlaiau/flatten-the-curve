import React, { useContext } from 'react'
import {GlobalStateContext} from "../context/GlobalContextProvider"

import SingularGraphTooltip from '../components/graph-tooltip'
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend, Label} from 'recharts'




const TestPage = () => {
    const {cumulative_confirmed, cumulative_deaths} = useContext(GlobalStateContext)
    
    //cumulative_confirmed.forEach()
    return (
        <>
            <LineChart width={620} height={372} data={cumulative_confirmed} margin={{ bottom: 25, top: 15, right: 10 }}>
            <XAxis 
                dataKey="index"
                name="Days"
                type="number"
                interval="number"
                >
                <Label value="Days since first confirmed case" offset={-15} position="insideBottom" />
                </XAxis>
            
            <YAxis width={55}/>
            <Line type="monotone" dataKey="confirmed" name="Total confirmed cases" stroke="#ff793f"/> :
            
            <Tooltip/>
            <Legend verticalAlign="top"/>
            
            </LineChart>

            <h1>cumulative_confirmed</h1>
            <pre>{JSON.stringify(cumulative_confirmed, null, 2)}</pre>

            <h1>cumulative Deaths</h1>
            <pre>{JSON.stringify(cumulative_deaths, null, 2)}</pre>



            
        </>
    )
}

export default TestPage