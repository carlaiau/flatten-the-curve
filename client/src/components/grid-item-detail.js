import React from "react"
import styled from '@emotion/styled'
import SingularGraphTooltip from './graph-tooltip'
import { parseJSON, format, add } from "date-fns"
import {LineChart, Line, YAxis, Tooltip, Legend, ReferenceLine} from 'recharts'


const GridItemDetail = ({ active, compare, width, details_open, closeFn, detailsFn }) => {
    let max_historical = 7

    const time_series = compare.time_series.filter( time => time.confirmed_per_mil >= active.highest.confirmed_per_mil )
    
    let prev_series = active.time_series.filter( time => time.confirmed_per_mil < active.highest.confirmed_per_mil )

    // Reduce the length of max_historical to ensure
    while(max_historical > prev_series.length){
        max_historical--
    }

    prev_series = prev_series.slice(prev_series.length + 1 - max_historical)
    
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
            death_ratio: time.deaths / time.confirmed,
            date: time.date
        })
        previous_confirmed = time.confirmed_per_mil
        previous_deaths = time.deaths_per_mil
    }
    })
    
    const forecast = []
    let current_day = 0
    // Push negative days onto forecase
    prev_series.forEach( (time) => {
        forecast.push({
            day: current_day,
            real_confirmed: time.confirmed,
            real_deaths: time.deaths | 0,
            date: time.date
        })
        current_day++   
    })

    // Create forecasts    
    deltas.forEach( (delta, i) => {
        if(i === 0){
            forecast.push({
                day: current_day,
                real_confirmed: active.highest.confirmed,
                real_deaths: active.highest.deaths | 0,
                date: active.highest.date,
            })

            previous_confirmed = active.highest.confirmed
            previous_deaths = active.highest.deaths | 0
            
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
                day: current_day, 
                confirmed: parseInt(confirmed.toFixed(0)), 
                deaths: parseInt(deaths.toFixed(0)),
                date: active.highest.date,
                offset: i
                
            })
            previous_confirmed = confirmed
            previous_deaths = deaths
            current_day += 1
        }
    })

    const days_of_forecast = time_series.length - 1

    forecast.forEach(time => {
        time.dateString = time.offset ? format(add(parseJSON(active.highest.date), {days: time.offset}),'MMM dd') : format(parseJSON(time.date),'MMM dd') 
    })
    

    // At this point
    const CountryDiv = styled('div')`
        p{
            color: #fff;
            strong{
                color: #fff;
            }
            &.is-size-6{
                margin-bottom: 10px;
            }
        }
        .historical{
            .box{
                background: #227093;
            }
        }
    `
    return (

        


    <CountryDiv className="column is-full expanded-country">
        <div className="box is-info">
            <button className="modal-close is-large has-background-newt" aria-label="close" onClick={closeFn}></button>
            <div className="columns">
                <div className="column is-one-third">
                    <h3 className="is-size-3 title has-text-white">
                        {active.country_name}
                    </h3>
                    <p className="is-size-5  subtitle">
                        Forecast based on historical data from {compare.country_name}
                    </p>
                    <p className="is-size-6">
                        Calculated using the daily growth of confirmed cases and deaths on a per million basis in {compare.country_name} {}
                        since {compare.country_name} reached a similar case count to {active.country_name}.
                    </p>
                    <p className="is-size-6">
                        <strong>{days_of_forecast - 1}</strong> future days 
                        <br/>
                        <strong>{max_historical}</strong> historical days
                        <br/>
                        based on <strong>{time_series.length -1}</strong> days of {compare.country_name} data
                    </p>
                        
                    
                    
                     
                    { details_open ? 
                        <>
                            <p className="is-size-6">
                                If {active.country_name} currently has 0 deaths, we use the {compare.country_name} number of deaths to confirmed case ratio to 
                                estimate when {active.country_name} will encounter the first death. 
                                Once forecasted death has occured the projected deaths grow based on the {compare.country_name} observed death rate.
                            </p>
                            <p className="is-size-6">
                                This forecast is not meant to reflect the futre of {active.country_name}, merely an indication of what is possible.
                                If there are flaws with this naive approach please reach out to us so we can ensure it is done correctly.
                            </p>
                            
                        </>
                    :
                        <button className="button is-white is-outlined is-size-7" onClick={detailsFn}>Expand Method</button>
                    }
                </div>
                <div className='column is-one-third'>
                    <h3 className="is-size-4 title has-text-white" style={{textAlign: 'center'}}>{active.country_name} Forecast</h3>
                    <p className="is-size-6 subtitle" style={{textAlign: 'center'}}>Confirmed Cases</p>
                    <div style={{
                        background: '#fff',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        padding: '5px'
                     }}
                    >   
                        <LineChart data={forecast} width={width >= 768 ? 391 : 280} height={width >= 768 ? 200: 150} syncId="projection">
                            <YAxis width={60}/>
                            <Line type="monotone" dataKey="real_confirmed" name="Historical" stroke="#227093"dot={false} strokeWidth={3} />
                            <Line type="monotone" dataKey="confirmed" name="Forecast" stroke="#ff793f" dot={false} strokeWidth={3}/>
                            <ReferenceLine x={max_historical -1} stroke="#aaa" label="Latest" strokeWidth={3} strokeOpacity={0.25}/>
                            <Tooltip content={SingularGraphTooltip}/>
                            <Legend verticalAlign="top" iconType="square"/>
                        </LineChart>
                    </div>
                    <p className="is-size-6" style={{textAlign: 'center'}}>Deaths</p>
                    <div style={{
                        background: '#fff', 
                        borderRadius: '4px',
                        padding: '5px'
                        }}
                    >
                        <LineChart data={forecast} width={width >= 768 ? 391 : 280} height={width >= 768 ? 200: 150} syncId="projection">
                            <YAxis width={60}/>
                            <Line type="monotone" dataKey="real_deaths" name="Historical" stroke="#227093" dot={false} strokeWidth={3}/>
                            <Line type="monotone" dataKey="deaths" name="Forecast" stroke="#ff5252" dot={false} strokeWidth={3}/>
                            <ReferenceLine x={max_historical - 1} stroke="#aaa" label="Latest" strokeWidth={3} strokeOpacity={0.25}/>
                            <Tooltip content={SingularGraphTooltip}/>
                            <Legend verticalAlign="top" iconType="square"/>
                        </LineChart>
                    </div>
                </div>
            
                <div className='column is-one-third historical'>
                    <h3 className="is-size-4 title has-text-white" style={{textAlign: 'center'}}>{compare.country_name} Historical</h3>
                    <p className="is-size-6 subtitle" style={{textAlign: 'center'}}>Confirmed per million</p>
                    
                    <div style={{
                        background: '#fff',
                        padding: '5px',
                        borderRadius: '4px',
                        marginBottom: '20px'
                        }}
                    >   
                        <LineChart data={time_series} width={width >= 768 ? 391 : 280} height={width >= 768 ? 200: 150} syncId="progression">
                            <YAxis width={50}/>
                            <Line type="monotone" dataKey="confirmed_per_mil" name="Confirmed per million" stroke="#227093" dot={false} strokeWidth={3} formatter={value => value.toFixed(2)}/>
                            <Tooltip content={SingularGraphTooltip}/>
                            
                        </LineChart>
                    </div>
                    <p className="is-size-6" style={{textAlign: 'center'}}>Deaths per million</p>
                    <div style={{
                        background: '#fff',
                        padding: '5px',
                        borderRadius: '4px'}}
                    >
                        <LineChart data={time_series} width={width >= 768 ? 391 : 280} height={width >= 768 ? 200: 150} syncId="progression">
                            <YAxis width={50}/>
                            <Line type="monotone" dataKey="deaths_per_mil" name="Deaths per million" stroke="#227093" dot={false} strokeWidth={3} formatter={value => value.toFixed(2)}/>
                            <Tooltip content={SingularGraphTooltip}/>
                        </LineChart>
                    </div>
                </div>    
                    
                                
            </div>
        </div>
    </CountryDiv>
    )
}

export default GridItemDetail