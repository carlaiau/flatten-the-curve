import React from "react"

import {LineChart, Line, XAxis, YAxis, Tooltip, Legend} from 'recharts'

const GridItemDetail = ({ active, compare, width, details_open, closeFn, detailsFn }) => {
        
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
                <div className="column is-one-third">
                    <p className="is-size-3 has-text-white title country-title">
                        {active.country_name}
                    </p>
                    <p className="is-size-5 subtitle has-text-white">
                        Forecast based on historical data from 
                    </p>
                    <p className="is-size-4 has-text-white title country-title">
                        {compare.country_name}
                    </p>
                    <p className="is-size-6 has-text-white" style={{marginBottom: '10px'}}>
                        Calculated using the daily growth of confirmed cases and deaths on a per million basis in {compare.country_name} {}
                        since {compare.country_name} reached the a similar case count to {active.country_name}.
                    </p>
                    { details_open ? 
                        <React.Fragment>
                            
                            <p className="is-size-6 has-text-white" style={{marginBottom: '10px'}}>
                                If {active.country_name} currently has 0 deaths, we use the {compare.country_name} number of deaths to confirmed case ratio to 
                                estimate when {active.country_name} will encounter the first death. 
                                Once forecasted death has occured the projected deaths grow based on the {compare.country_name} observed death rate.
                            </p>
                            <p className="is-size-6 has-text-white" style={{marginBottom: '10px'}}>
                                This forecast is not meant to reflect the futre of {active.country_name}, merely an indication of what is possible.
                                If there are flaws with this naive approach please reach out to us so we can ensure it is done correctly.
                            </p>
                        </React.Fragment>
                    :
                        <button className="button is-white is-outlined is-size-7" onClick={detailsFn}>Expand Method</button>
                    }
                </div>
                <div className='column is-one-third'>
                    <p className="is-size-5 has-text-white" 
                        style={{marginBottom: '10px', textAlign: 'center'}}
                    >
                        Forecast for next {time_series.length - 2} days
                    </p>
                    <div style={{
                        background: '#fff',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        padding: '5px'
                     }}
                    >
                        <LineChart data={forecast} width={width >= 768 ? 391 : 280} height={width >= 768 ? 200: 150} syncId="projection">
                            <YAxis width={60}/>
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
                        <LineChart data={forecast} width={width >= 768 ? 391 : 280} height={width >= 768 ? 200: 150} syncId="projection">
                            <YAxis width={60}/>
                            <Line type="monotone" dataKey="deaths" name="Total deaths" stroke="#ff5252"/>
                            <Tooltip/>
                            <Legend verticalAlign="top"/>
                        </LineChart>
                    </div>
                </div>
            
                <div className={`column is-one-third`}>
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
                        <LineChart data={time_series} width={width >= 768 ? 391 : 280} height={width >= 768 ? 200: 150} syncId="progression">
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
                        <LineChart data={time_series} width={width >= 768 ? 391 : 280} height={width >= 768 ? 200: 150} syncId="progression">
                            <YAxis width={50}/>
                            <Line type="monotone" dataKey="deaths_per_mil" name="Deaths per million" stroke="#ff5252" formatter={value => value.toFixed(2)}/>
                            <Tooltip/>
                            <Legend verticalAlign="top"/>
                        </LineChart>
                    </div>
                </div>    
                    
                                
            </div>
        </div>
    </div>
    )
}

export default GridItemDetail