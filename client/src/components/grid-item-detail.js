import React from "react"

import {LineChart, Line, XAxis, YAxis, Tooltip, Legend} from 'recharts'

const GridItemDetail = ({ active, compare, width, tidy, closeFn }) => {
        
    const time_series = compare.time_series.filter( time => time.confirmed_per_mil >= active.highest.confirmed_per_mil )
    
    // Rememner to use these for plotting the real data on the set
    const prev_series = compare.time_series.filter( time => time.confirmed_per_mil < active.highest.confirmed_per_mil )

    const deltas = [] 
    let previous_confirmed = 0
    let previous_deaths = 0
    
    
    time_series.forEach( (time, i) => {
    if(i === 0){
        previous_confirmed = time.confirmed_per_mil
        previous_deaths = time.deaths_per_mil  
    }
    else{
        deltas.push({
        index: i,
        confirmed: ( time.confirmed_per_mil - previous_confirmed ) / previous_confirmed,
        deaths: ( time.deaths_per_mil - previous_deaths ) / previous_deaths,
        death_ratio: time.deaths / time.confirmed
        })
        previous_confirmed = time.confirmed_per_mil
        previous_deaths = time.deaths_per_mil
    }
    })

    
    const forecast = []
    forecast.push({
        day: 0,
        confirmed: active.highest.confirmed,
        deaths: active.highest.deaths | 0
    })
    
    
        
    deltas.forEach( (delta, day) => {
        if(day === 0){
            previous_confirmed = forecast[0].confirmed
            previous_deaths = forecast[0].deaths
        }
        else{
            const confirmed = previous_confirmed * (1 + delta.confirmed)
            let deaths = 0
        if(! previous_deaths){ // If death doesn't exist yet, trigger at this point
            const projected_deaths = delta.death_ratio * previous_confirmed
            if(projected_deaths > 0) 
            deaths = projected_deaths
        }
        else 
            deaths = previous_deaths * (1 + delta.deaths)
        
        forecast.push({
            day, 
            confirmed: parseInt(confirmed.toFixed(0)), 
            deaths: parseInt(deaths.toFixed(0)) 
        })
        previous_confirmed = confirmed
        previous_deaths = deaths
        
        }
    })
    
    return (
    <div className="column is-full expanded-country">
        <div className="box is-info">
            <button class="modal-close is-large has-background-newt" aria-label="close" onClick={closeFn}></button>
            <div className="columns">
                <div className="column is-third">
                    <p className="is-size-3 has-text-white title" style={{marginTop: '50px'}}>
                        {active.country_name}
                    </p>
                    <p className="is-size-5 subtitle has-text-white">
                        Projection based on historical data from {compare.country_name}
                    </p>
                    <p className="is-size-6 has-text-white" style={{marginBottom: '10px'}}>
                        This is calculated using the daily growth of confirmed cases and deaths on a per million basis in {compare.country_name} {}
                        since {compare.country_name} reached the same confirmed case count as {active.country_name}.
                    </p>
                    <div className="columns is-hidden" style={{marginTop: '10px'}}>
                        <div className="column">
                            <button className="button is-dark has-text-white ">
                                Switch to tables
                            </button>
                            <button className="button is-white ">
                                More Info
                            </button>
                        </div>
                    </div>
                </div>
                <div className='column is-third'>
                    <p className="is-size-5 has-text-white" 
                        style={{marginBottom: '10px', textAlign: 'center'}}
                    >
                        Forecasted next {time_series.length - 2} days
                    </p>
                    <div style={{
                        background: '#fff',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        padding: '5px'
                     }}
                    >
                        <LineChart data={forecast} width={width >= 768 ? 565 : 280} height={width >= 768 ? 300: 150} syncId="projection">
                            <XAxis dataKey="day"/>
                            <YAxis width={50}/>
                            <Line type="monotone" dataKey="confirmed" name="Total confirmed cases" stroke="#ff793f" />
                            <Tooltip/>
                            <Legend verticalAlign="top"/>
                        </LineChart>
                    </div>
                    <div style={{
                        background: '#fff', 
                        borderRadius: '4px',
                        padding: '5px'
                        }}
                    >
                        <LineChart data={forecast} width={width >= 768 ? 565 : 280} height={width >= 768 ? 300: 150} syncId="projection">
                            <XAxis dataKey="day"/>
                            <YAxis width={50}/>
                            <Line type="monotone" dataKey="deaths" name="Total deaths" stroke="#ff5252"/>
                            <Tooltip/>
                            <Legend verticalAlign="top"/>
                        </LineChart>
                    </div>

                    <table className="table is-narrow is-hidden" style={{marginTop: '10px'}}>
                        <tbody>
                        <tr>
                            <th>Days</th>
                            <th>Confirmed</th>
                            <th>Deaths</th>
                        </tr>
                        {
                            forecast.map( (time, i) => (
                            <tr key={i}>
                                <td>{i}</td>
                                <td>{tidy(time.confirmed)}</td>
                                <td>{time.deaths ? tidy(time.deaths): 0}</td>
                            </tr>
                            )
                        )}
                        </tbody>
                    </table>
                    
                </div>
            
                <div className={`column is-third`}>
                    <p className="is-size-5 has-text-white" style={{marginBottom: '10px', textAlign: 'center'}}>
                        Previous {time_series.length - 1} days of data from {compare.country_name}
                    </p>
                    <div style={{
                        background: '#fff',
                        padding: '5px',
                        borderRadius: '4px',
                        marginBottom: '20px'
                        }}
                    >   
                        <LineChart data={time_series} width={width >= 768 ? 565 : 280} height={width >= 768 ? 300: 150} syncId="progression">
                            <YAxis width={50}/>
                            <Line type="monotone" dataKey="confirmed_per_mil" name="Confirmed per million" stroke="#ff793f" formatter={value => value.toFixed(2)}/>
                            <Tooltip/>
                            <Legend verticalAlign="top"/>
                        </LineChart>
                    </div>
                    <div style={{
                        background: '#fff',
                        padding: '5px',
                        borderRadius: '4px'}}
                    >
                        <LineChart data={time_series} width={width >= 768 ? 565 : 280} height={width >= 768 ? 300: 150} syncId="progression">
                            <YAxis width={50}/>
                            <Line type="monotone" dataKey="deaths_per_mil" name="Deaths per million" stroke="#ff5252" formatter={value => value.toFixed(2)}/>
                            <Tooltip/>
                            <Legend verticalAlign="top"/>
                        </LineChart>
                    </div>
                    <table className="table is-narrow is-hidden" style={{marginTop: '10px'}}>
                        <thead> 
                        <tr>
                            <th></th><th colSpan="2">Per Million</th><th colSpan="2">Daily Change</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Days Ago</td><td>Confirmed</td><td>Deaths</td><td>Confirmed</td><td>Deaths</td>
                        </tr>
                        {
                            time_series.map( (time, i) => (
                            <tr key={i}>
                                <td>{time_series.length - (i + 1) }</td>
                                <td>{time.confirmed_per_mil.toFixed(2)}</td>
                                <td>{time.deaths_per_mil ? time.deaths_per_mil.toFixed(2): 0}</td>
                                <td>{i !== 0 && deltas[i - 1] && deltas[i - 1].confirmed ? (deltas[i -1].confirmed * 100).toFixed(2) : 0}%</td>
                                <td>{i !== 0 && deltas[i - 1] && deltas[i - 1].deaths ? deltas[i - 1].deaths === Infinity ? '--' : (deltas[i - 1].deaths * 100).toFixed(2): 0}%</td>
                            </tr>
                            )
                        )}
                        </tbody>
                    </table>
                     
                </div>    
                    
                                
            </div>
        </div>
    </div>
    )
}

export default GridItemDetail