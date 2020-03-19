import React from 'react'
import { format, parse, formatDistance } from "date-fns"

const GridItem = ({country, active_country, openModalFn, per, field, tidy}) => (
    <div className="column is-one-third" key={country.country_name}>
        <div className="box has-background-success has-text-white country">
            <div className="content" style={{position: 'relative'}}>
                <h2 className="is-size-3  has-text-white" style={{marginTop: 0}}>
                    {country.country_name}
                </h2>
                <p className="is-size-6 has-text-white">
                    {tidy((country.population / 1000000).toFixed(0))} Million People
                </p>
                <p className="is-size-6 has-text-white">
                {formatDistance(parse(country.earliest.date, 'MM/dd/yy', new Date()), parse('03/16/20', 'MM/dd/yy', new Date()) ) } ago 
                {' '} had similar {per === 'total' ? ' total': 'per million'} 
                {' '}{field === 'deaths' ? 'deaths': 'confirmed cases'} as
                {' '} {active_country.country_name}
                
                </p>
                
                <table className="table is-narrow ">


                <thead>

                <tr>
                    <th className={per != 'total' ? 'is-hidden': ''}>Total</th>
                    <th className={per == 'total' ? 'is-hidden': ''}>Per Million</th>
                    <th style={{textAlign: 'right', textTransform: 'capitalize'}}>
                    
                    {formatDistance(parse(country.earliest.date, 'MM/dd/yy', new Date()), parse('03/16/20', 'MM/dd/yy', new Date()) ) } ago
                    </th>
                    <th style={{textAlign: 'right'}}>
                    Now
                    </th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                    <th>Confirmed</th>
                    <td className={per != 'total' ? 'is-hidden': ''}>
                        {tidy(country.earliest.confirmed)}
                    </td>
                    <td className={per != 'total' ? 'is-hidden': ''}>
                        {tidy(country.highest.confirmed)}
                    </td>

                    <td className={per == 'total' ? 'is-hidden': ''}>
                        {country.earliest.confirmed_per_mil ? country.earliest.confirmed_per_mil.toFixed(2): ''}</td>
                    <td className={per == 'total' ? 'is-hidden': ''}>{country.highest.confirmed_per_mil ? country.highest.confirmed_per_mil.toFixed(2): ''}</td>
                    </tr>
                    <tr>
                    <th>Deaths</th>
                    <td className={per != 'total' ? 'is-hidden': ''}>{tidy(country.earliest.deaths)}</td>
                    <td className={per != 'total' ? 'is-hidden': ''}>{tidy(country.highest.deaths)}</td>
                    
                    
                    <td className={per == 'total' ? 'is-hidden': ''}>{country.earliest.deaths_per_mil ? country.earliest.deaths_per_mil.toFixed(2): ''}</td>
                    <td className={per == 'total' ? 'is-hidden': ''}>{country.highest.deaths_per_mil ? country.highest.deaths_per_mil.toFixed(2): ''}</td>
                    </tr>
                    <tr>
                    <th>Recovered</th>
                    <td className={per != 'total' ? 'is-hidden': ''}>{tidy(country.earliest.recovered)}</td>
                    <td className={per != 'total' ? 'is-hidden': ''}>{tidy(country.highest.recovered)}</td>
                    
                    <td className={per == 'total' ? 'is-hidden': ''}>{country.earliest.recovered_per_mil ? country.earliest.recovered_per_mil.toFixed(2): ''}</td>
                    <td className={per == 'total' ? 'is-hidden': ''}>{country.highest.recovered_per_mil ? country.highest.recovered_per_mil.toFixed(2): ''}</td>
                    </tr>
                </tbody>
                </table>
                { country.highest.confirmed_per_mil > active_country.highest.confirmed_per_mil ?
                    <button className='button is-dark has-text-white' onClick={openModalFn} style={{width: '100%', maxWidth: '100%', height: '40px', border: 'none'}}
                    >
                    View Forecast and  Progression
                    </button>
                :
                    <button className='button has-background-success is-size-7 has-text-white' style={{width: '100%', maxWidth: '100%', height: '40px'}}>
                    Insufficient confirmed cases per million for forecast
                    </button>
                }
            </div>
        </div>
    </div>
)


export default GridItem