import React from 'react'
import SEO from "./seo"
import CountryOverviewGraph from "./country-overview-graph"
import CumulativeGraphContainer from "./cumulative-graph/cumulative-graph-container"
import CountryGrid from "./country-grid/country-grid"
import UpdateTable from './update-times'
import EnhancedTable from './enhanced-table/enhanced-table'

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
            country: props.all.filter(state => state.name == 'All')[0],
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
        

        const {rows, headCells} = SetupAdvancedCountryTable(this.props.country_name, this.props.all)



        
        
        /*
        This will replace content block when in place
        <label className="label">States</label>
        <div className="check-container">
            {this.state.all.map(s => (
                <label className="checkbox" key={s.name}>
                    <input 
                        type="checkbox" name={s.name} 
                        value={s.name} 
                    />{s.name}
                </label>
            ))}
        </div>
        */          
       
       const ContentBlock = () => {
        const {name, highest} = active_country
        const {confirmed, deaths} = highest
        return (
        <div className="box">
            <h3 className="is-size-4 title">{this.props.country_name} must act now</h3>
            
            <p className="is-size-6">
              Because of the explosive growth, it is critical we all do our best to flatten the curve, even when these early measures feel extreme. 
              Slowing the spread is our best tool to prevent catastrophic collapse of our medical systems.
            </p>
            { (confirmed > 100 ||deaths > 10) && per == 'total' ?
            <p className="is-size-6"style={{marginTop: '10px'}}>
              The <strong>{field =='confirmed' ? 'Cases' :'Deaths'} double every 3 days</strong>{' '}
              comparison is based on compounding daily growth starting from when the {this.props.country_name} daily figure first exceeded{' '}
              { confirmed > 100 && field =='confirmed'? <strong>100 confirmed cases</strong> : <></> }{' '}
              { deaths > 10 && field != 'confirmed' ? <strong>10 deaths</strong> : <></> }
            </p>
            : <></> }
            <div style={{marginTop: '10px', marginBottom: '10px'}}>
              <p className="is-size-6">
                Global data updated at <strong>{update_times.global}</strong>
              </p>
              {this.props.country_name == 'United States' ? 
                <p className="is-size-6">
                    {this.props.country_name} data updated at <strong>{update_times.us}</strong>
                </p>
                : <></>}
            </div>
            {this.props.country_name == 'United States' ?
            <div>
                 
                <p className="is-size-7">
                The United States total and state level COVID-19 data is sourced from the
                {' '}<a href="https://covidtracking.com/" target="_blank" rel="noopener noreferrer">
                  COVID Tracking Project
                </a>. This page is in active development.
                </p>
            </div>
            : <></>}
            
            
        </div>
        )
    }


        return (<>
            <SEO title={`${this.props.country_name} COVID-19 Update: ${this.state.area_label} level cumulative graphs and comparisons`}/>
            <section className="section">
                <div className="container">
                    <div className="columns info">
                        <div className="column is-two-thirds"> 
                            <h2 className="is-size-3 title">{this.props.country_name}</h2>
                            <p className="is-size-4 subtitle">
                            { country.highest_confirmed ? this.tidyFormat(country.highest_confirmed) + ' Cases' : ''}
                            <span style={{float: 'right'}}>
                                {country.highest_deaths ? this.tidyFormat(country.highest_deaths) + ' Deaths' : ''}
                            </span>
                            </p>  
                            <CountryOverviewGraph 
                                active_country={active_country}
                                scale={this.state.overview_scale}   
                                field={field}   
                                full_field_name={full_field_name}
                                width={this.props.overview_width}     
                                height={this.props.overview_height}
                                max_area_count={this.state.max_area_count}
                            />
                        </div>
                        <div className="column is-one-third">
                            <div className="field is-grouped is-horizontal">
                                <div className="control">
                                    <div className="select">
                                    <select value={this.state.field} onChange={e => this.setState({field: e.target.value})}>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="deaths">Deaths</option>
                                    </select>
                                    </div>
                                </div>
                                <div className="control">
                                    <div className="select">
                                    <select value={this.state.per} onChange={e => this.setState({per: e.target.value})}>
                                        <option value="total">Total</option>
                                        <option value="per_million">Per Mil</option>
                                    </select>
                                    </div>
                                </div>
                                <div className="control">
                                    <div className="select">
                                    <select value={this.state.overview_scale} onChange={e => this.setState({overview_scale: e.target.value})}>
                                        <option value="linear">Linear</option>
                                        <option value="log">Log</option>
                                    </select>
                                    </div>
                                </div>
                            </div>
                            <ContentBlock/>
                        
                        </div>
                    </div>
                </div>                
        </section>
            
            <section className="section cum">
                <div className="container">
                    <div className="columns">
                        <div className="column is-narrow">
                            <div className="box has-background-success">
                                <h3 className="is-size-3 has-text-white title">
                                    Cumulative number of cases by {this.state.area_label}
                                </h3>
                                <p className="is-size-5 subtitle has-text-white">
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
                    {
                    this.props.hide_deaths ? 
                        <>
                            <div className="columns">
                                <div className="column is-narrow">
                                    <div className="box has-background-success is-full">
                                        <h3 className="is-size-3 has-text-white title">Cumulative number of deaths by {this.state.area_label}</h3>
                                        <p className="is-size-5 subtitle has-text-white">by numbers of days since nth death</p>
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
                    : <></> }
                    </div>
            </section>
            <section className="section">
                <div className="container">
                    <div className="columns">
                        <div className="column is-narrow is-one-third">
                            <div className="box has-background-success is-full">
                                <h3 className="is-size-3 has-text-white title">{this.props.country_name} Overview</h3>
                                {this.props.country_name == 'United States' ? 
                                <p className="is-size-5 subtitle has-text-white">
                                Data is sourced from the
                {' '}<a href="https://covidtracking.com/" target="_blank" rel="noopener noreferrer" style={{color: '#fff', fontWeight: 700}}>
                  COVID Tracking Project
                </a>. This page is in active development</p>
                                :<></>}    
                                <UpdateTable color="white"/>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section">
                <EnhancedTable 
                    rows={rows} 
                    headCells={headCells} 
                    pageTemplate="advanced-country" 
                    tidy={this.state.numberFormat}
                    country_name={this.props.country_name}
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