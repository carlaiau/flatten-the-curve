import React from "react"

import {LineChart, Line, XAxis, YAxis, Tooltip, Legend} from 'recharts'

const Modal = (props) => {
    const { open, active, compare, width, closeFn } = props
    const tidyFormat = (numberString) => new Intl.NumberFormat().format(numberString)
    
    if(open){
        // Remember you can do some logic up here
        

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
        <div className='modal is-active'>
            <div className="modal-background" onClick={closeFn}></div>
            <div className="modal-card ">
                <header className="modal-card-head has-background-success">
                    <p className="modal-card-title is-size-4"><strong className="has-text-white">Forecast for {active.country_name}</strong></p>
                    <button className="delete has-background-dark" aria-label="close" onClick={closeFn}></button>
                </header>
                <section className={`modal-card-body has-background-light has-text-dark ${forecast.length == 1 ? 'is-hidden': ''}`} style={{overflowX: 'hidden'}}>
                    <h2 className="is-size-4" style={{marginBottom: '10px'}}>Based on {compare.country_name} Progression</h2>
                    <p className="is-size-6 subtitle" style={{marginBottom: '10px'}}>Forecasted next {time_series.length - 2} days</p>
                    <LineChart data={forecast} width={width >= 768 ? 565 : 303} height={width >= 768 ? 300: 150} syncId="projection">
                        <XAxis dataKey="day"/>
                        <YAxis width={50}/>
                        <Line type="monotone" dataKey="confirmed" name="Total confirmed cases" stroke="#ff793f" />
                        <Tooltip/>
                        <Legend verticalAlign="top"/>
                    </LineChart>
                    <LineChart data={forecast} width={width >= 768 ? 565 : 303} height={width >= 768 ? 300: 150} syncId="projection">
                        <XAxis dataKey="day"/>
                        <YAxis width={50}/>
                        <Line type="monotone" dataKey="deaths" name="Total deaths" stroke="#ff5252"/>
                        <Tooltip/>
                        <Legend verticalAlign="top"/>
                    </LineChart>

                    <p className="is-size-7" style={{marginBottom: '10px'}}>*Description of forecast below table</p>
                    <table className="table  is-striped is-fullwidth" style={{marginTop: '10px'}}>
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
                                <td>{tidyFormat(time.confirmed)}</td>
                                <td>{time.deaths ? tidyFormat(time.deaths): 0}</td>
                            </tr>
                            )
                        )}
                        </tbody>
                    </table>
                    <p className="is-size-7" style={{marginBottom: '10px'}}>
                        This is calculated using the daily growth of confirmed cases and deaths on a per million basis in {compare.country_name} {}
                        since {compare.country_name} reached the same confirmed case count as {active.country_name}.
                    </p>
                    <p className="is-size-7" style={{marginBottom: '10px'}}>
                        If {active.country_name} currently has 0 deaths, we use the {compare.country_name} ratio of confirmed cases to deaths to forecast when {active.country_name} will encounter it's first death. 
                        Once the forecasted deaths are above 1 the projected death rate grows based on the growth of the {compare.country_name} observed death rate.
                    </p>
                    <p className="is-size-7" style={{marginBottom: '10px'}}>
                        This forecast is not meant to reflective of {active.country_name}'s future, merely an indication of what is possible.
                        If there are flaws with this naive approach please reach out to us so we can ensure it is done correctly.
                    </p>
                    <h2 className="is-size-4" style={{marginBottom: '10px', marginTop: '30px'}}>
                        COVID-19 Progression in {compare.country_name}
                    </h2>
                    <p className="is-size-6" style={{marginBottom: '10px'}}>
                        Previous {time_series.length - 1} days of data from {compare.country_name}.
                    </p>
            
                    <LineChart data={time_series} width={width >= 768 ? 565 : 303} height={width >= 768 ? 300: 150} syncId="progression">
                        <YAxis width={50}/>
                        <Line type="monotone" dataKey="confirmed_per_mil" name="Confirmed per million" stroke="#ff793f" formatter={value => value.toFixed(2)}/>
                        <Tooltip/>
                        <Legend verticalAlign="top"/>
                    </LineChart>
                    <LineChart data={time_series} width={width >= 768 ? 565 : 303} height={width >= 768 ? 300: 150} syncId="progression">
                        <YAxis width={50}/>
                        <Line type="monotone" dataKey="deaths_per_mil" name="Deaths per million" stroke="#ff5252" formatter={value => value.toFixed(2)}/>
                        <Tooltip/>
                        <Legend verticalAlign="top"/>
                    </LineChart>
                    <table className="table is-striped is-fullwidth" style={{marginTop: '10px'}}>
                        <thead> 
                        <tr>
                            <th></th>
                            
                            <th colSpan="2" className="is-size-7">Per Million</th>
                            <th colSpan="2" className="is-size-7">Daily Change</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="is-size-7">Days Ago</td>
                            
                            <td className="is-size-7">Confirmed</td>
                            <td className="is-size-7">Deaths</td>
                            <td className="is-size-7">Confirmed</td>
                            <td className="is-size-7">Deaths</td>
                        </tr>
                        {
                            time_series.map( (time, i) => (
                            <tr key={i}>
                                <td className="is-size-7">{time_series.length - (i + 1) }</td>
                                <td className="is-size-7">{time.confirmed_per_mil.toFixed(2)}</td>
                                <td className="is-size-7">{time.deaths_per_mil ? time.deaths_per_mil.toFixed(2): 0}</td>
                                <td className="is-size-7">{i !== 0 && deltas[i - 1] && deltas[i - 1].confirmed ? (deltas[i -1].confirmed * 100).toFixed(2) : 0}%</td>
                                <td className="is-size-7">{i !== 0 && deltas[i - 1] && deltas[i - 1].deaths ? deltas[i - 1].deaths === Infinity ? '--' : (deltas[i - 1].deaths * 100).toFixed(2): 0}%</td>
                            </tr>
                            )
                        )}
                        </tbody>
                    </table>
                </section>    
                <footer className="modal-card-foot has-background-success is-hidden-mobile">
                    <button className="button is-dark" onClick={closeFn}>
                        Back to Results
                    </button>
                </footer>
            </div>
        </div>
        )
    }
    return <React.Fragment></React.Fragment>
}

export default Modal