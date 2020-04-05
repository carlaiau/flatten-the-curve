
import React from 'react'

const GridBar = ( {max_count, active_name, per, field, sort, length, forecast_faq_open, fieldFn, perFn, sortFn, forecastFn} ) => (
    <section className="section bar" style={{clear: 'both'}}>
        <div className="container">
            <div className="columns" style={{flexWrap: 'wrap', alignItems: 'center'}}>
                <div className="column">
                    <div className="title-with-inputs" style={{marginBottom: '10px'}}>
                        <p className="is-size-5">
                            Showing the {length >= max_count? 'top ': ''}{length} countr{length === 1? 'y': 'ies'} 
                            {' '} that are now ranked higher than {active_name} by
                        </p>
                        <div className="field is-grouped is-horizontal">
                            <div className="control">
                                <div className="select">
                                    <select value={field} onChange={fieldFn}>
                                        <option value="confirmed">Confirmed Cases</option>
                                        <option value="deaths">Deaths</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field is-grouped is-horizontal">
                            <div className="control">
                                <div className="select">
                                    <select value={per} onChange={perFn}>
                                        <option value="total">Total</option>
                                        <option value="per_million">Per Millon</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field is-grouped is-horizontal">
                            <div className="control">
                                <div className="select">
                                    <select value={sort} onChange={sortFn}>
                                        <option value="worst">Worst First</option>
                                        <option value="best">Best First</option>
                                        <option value="alpha_asc">A - Z</option>
                                        <option value="alpha_desc">Z - A</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>              
            </div>
            <div className="columns">
                <div className="column">
                    <button className="button is-dark is-outlined is-size-7" onClick={forecastFn}>
                        {forecast_faq_open ? 'Close': 'Forecast info'}
                    </button>
                    { forecast_faq_open ? 
                    <>
                        <p className="is-size-7" style={{marginTop: '10px'}}>
                        The forecasts below show a future projection of COVID-19 in {active_name}. 
                        This is based on the historical growth data of each country that is currently ahead of {active_name} in the outbreak.
                        </p>
                        <p className="is-size-7">
                        Viewing this can offer unique insights into the range of possible outcomes. The forecast is not based on epidemiological models, just on historical data experienced by other countries.
                        </p>
                        <p className="is-size-7">
                            The forecast does not take into account the relative doubling time of each country.
                        </p>
                        <p className="is-size-7">
                            Forecasting accuracy depends on a multitude of factors such as the number and speed of tests done, the quality of the case tracking, the testing of tracked cases, and the support given to those who need to go into isolation.
                        </p>
                    </>
                    : <></> }
                </div>
            </div>
        </div>                
    </section>
)

export default GridBar