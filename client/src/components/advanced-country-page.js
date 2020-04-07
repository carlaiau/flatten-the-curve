import React from 'react'
import SEO from "./seo"
import CumulativeGraphContainer from "./cumulative-graph/cumulative-graph-container"
import CountryGrid from "./country-grid/country-grid"
import UpdateTable from './update-times'
import EnhancedTable from './enhanced-table/enhanced-table'
import RegionalView from './regional-advanced/regional-view'
import SetupCountry from '../utils/setup-country'
import SetupAdvancedCountryTable from '../utils/setup-advanced-country-table'

import 'bulma/css/bulma.css'
import '../styles/custom.css'

export default class AdvancedCountryPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            countries: props.countries,
            numberFormat: new Intl.NumberFormat(),
            all: props.all,
            cum: props.cum,
            field: 'confirmed',
            per: 'total',
            overview_scale: 'log',
            country: props.countries.filter(c => c.name == props.country_name)[0],
            selectedStates: ['All'],
            numberFormat: new Intl.NumberFormat(),
            max_area_count: 60,
            area_label: props.area_label || 'state'
        }   
    }
    tidyFormat = (numberString) => {
        return this.state.numberFormat.format(numberString)
    }

    render(){
        const {field, per, country} = this.state
        const update_times = this.props.update_times
        

        let full_field_name = field === 'confirmed' ? 
        per === 'total' ? 'confirmed' : 'confirmed_per_mil' :
        per === 'total' ? 'deaths' : 'deaths_per_mil'


        const active_country = SetupCountry({
            country: country,
            field: full_field_name
        })

        active_country.name =  this.props.country_name
        

        const mainTable = SetupAdvancedCountryTable(this.props.country_name, this.props.all, true)

        const summaryTable = SetupAdvancedCountryTable(this.props.country_name, this.props.all, false)

        return (<>
            <SEO title={`${this.props.country_name} COVID-19 Update: ${this.state.area_label} level cumulative graphs and comparisons`}/>
            <section className="section" style={{paddingBottom: 0}}>
                <div className="container">
                    <div className="columns info" style={{alignItems: 'flex-end'}}>
                        <div className="column is-half"> 
                            <h2 className="is-size-3 title">{this.props.country_name}</h2>
                            <table className="subtitle">
                                <tr>
                                    <th className="is-size-4" style={{paddingRight: '10px', textAlign: 'right'}}>{this.tidyFormat(country.highest_confirmed)}</th>
                                    <td className="is-size-4">Cases</td>
                                </tr>
                                {country.highest_deaths ?
                                <tr>
                                    <th className="is-size-4" style={{paddingRight: '10px', textAlign: 'right'}}>{this.tidyFormat(country.highest_deaths)}</th>
                                    <td className="is-size-4">Deaths</td>
                                </tr>
                                :<></> }
                            </table>
                        </div>
                        <div className="column is-half text-right-align-desktop"> 
                            <p className="is-size-7">
                                Global data updated at <strong>{update_times.global}</strong>
                            </p>
                            {this.props.country_name == 'United States' ? 
                                <p className="is-size-7">
                                    {this.props.country_name} data updated at <strong>{update_times.us}</strong>
                                </p>
                            : <></>}
                            {this.props.country_name == 'United States' ?
                                <p className="is-size-7">
                                The United States data is sourced from the
                                {' '}<a href="https://covidtracking.com/" target="_blank" rel="noopener noreferrer">
                                COVID Tracking Project</a>.
                                </p>
                            : <></>}
                        </div>
                    </div>
                </div>                
        </section>
        {
            this.props.country_name == 'United States' || 
            this.props.country_name == 'Canada' ||
            this.props.country_name == 'Australia' ||
            this.props.country_name == 'China' 
            ?
            <RegionalView 
                rows={summaryTable.rows}
                headCells={summaryTable.headCells}
                all={this.state.all}
                width={this.props.overview_width} 
                height={this.props.overview_height}
                area_label={this.props.country_name == 'Canada' ? 'province or territory' : 'state'}
            />

        : <></> }
        <section className="section cum">
            <div className="container">
                <div className="columns">
                    <div className="column is-narrow">
                        <div className="box has-background-success">
                            <h3 className="is-size-4 has-text-white title">
                                Cumulative number of cases by {this.state.area_label}
                            </h3>
                            <p className="is-size-6 subtitle has-text-white">
                                by number of days since nth case
                            </p>
                        </div>
                    </div>
                </div>
                <CumulativeGraphContainer 
                    width={this.props.cum_width} 
                    height={this.props.cum_height} 
                    areas={this.state.cum}
                    field="confirmed"
                    type_of_area="state"
                    checkedAreas={this.props.checkedAreas}
                    accumulateFrom={100}
                    accumulateOptions={[50, 100, 200, 300, 400, 500, 750, 1000]}
                    max_area_count={this.state.max_area_count}
                    
                    
                />  
                { this.props.hide_deaths ? <></> :
                    <>
                        <div className="columns">
                            <div className="column is-narrow">
                                <div className="box has-background-success is-full">
                                    <h3 className="is-size-4 has-text-white title">Cumulative number of deaths by {this.state.area_label}</h3>
                                    <p className="is-size-6 subtitle has-text-white">by numbers of days since nth death</p>
                                </div>
                            </div>
                        </div>
                        <CumulativeGraphContainer 
                            width={this.props.cum_width} 
                            height={this.props.cum_height} 
                            areas={this.state.cum}
                            field="deaths"
                            type_of_area="state"
                            checkedAreas={this.props.checkedAreas}
                            accumulateFrom={10}
                            accumulateOptions={[10, 20, 30, 40, 50, 75, 100]}   
                        /> 
                    </>
                }
            </div>
        </section>
        <section className="section">
            <div className="container">
                <div className="columns">
                    <div className="column is-narrow">
                        <div className="box has-background-success is-full">
                            <h3 className="is-size-4 has-text-white title">{this.props.country_name} Overview</h3>
                            <p className="is-size-6 subtitle has-text-white">
                                Columns are sortable, please remember to horizontally scroll on mobile devices.
                            </p>
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="section">
            <EnhancedTable 
                rows={mainTable.rows} 
                headCells={mainTable.headCells} 
                pageTemplate="advanced-country" 
                tidy={this.state.numberFormat}
                country_name={this.props.country_name}
                is_main={true}

            />
        </section>
        {(this.props.show_grid ?
            <CountryGrid 
                active_country={active_country}
                countries={this.props.countries}
                grid_width={this.props.grid_width}
                grid_height={this.props.grid_height}
                is_mobile={this.props.is_mobile}
                tidy={this.tidyFormat}
            />
            :
            <></>)

        }
    </>)
    }
}