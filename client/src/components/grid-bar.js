
import React from 'react'

const GridBar = ( {max_count, active_country_name, per, field, sort, length, fieldFn, perFn, sortFn} ) => (
    <section className="section bar">
        <div className="container">
            <div className="columns" style={{flexWrap: 'wrap', alignItems: 'center'}}>
                <div className="column">
                    <div className="title-with-inputs" style={{marginBottom: '10px'}}>
                        <p className="is-size-5">
                            Showing the {length >= max_count? 'top ': ''}{length} countr{length === 1? 'y': 'ies'} 
                            {' '} that are now ranked higher than {active_country_name} by
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
        </div>                
    </section>
)

export default GridBar