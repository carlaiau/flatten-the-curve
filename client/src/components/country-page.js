import React from "react"

import SEO from "../components/seo"
import CountryOverviewGraph from "./country-overview-graph"
import CountryGrid from "./country-grid/country-grid"
import NZView from "./regional-new-zealand/nz-regional-view"
import SetupCountry from '../utils/setup-country'

import 'bulma/css/bulma.css'
import '../styles/custom.css'


// Need to actually make it dynamically determine the date

export default class CountryPage extends React.Component{
  
    constructor(props){
      super(props);
      this.state = {
        selected_country: props.selected_country,
        numberFormat: new Intl.NumberFormat(),
        field: 'confirmed',
        per: 'total',
        overview_scale: 'log',
    }
  }
  
  tidyFormat = (numberString) => {
    return this.state.numberFormat.format(numberString)
  }
  
  render(){
    const {countries, update_times} = this.props.stateHook
    const {selected_country, field, per} = this.state

    let full_field_name = field === 'confirmed' ? 
      per === 'total' ? 'confirmed' : 'confirmed_per_mil' :
      per === 'total' ? 'deaths' : 'deaths_per_mil'

    
    const active_country = SetupCountry({
      country: countries.filter( (c) => c.name ===  this.state.selected_country )[0],
      field: full_field_name
    })


    const ContentBlock = () => {
      const {name, highest} = active_country
      const {confirmed, deaths} = highest
      return (
      <div className="box">
          <h3 className="is-size-4 title">{name} must act now</h3>
          
          <p className="is-size-6">
            Because of the explosive growth, it is critical we all do our best to flatten the curve, even when these early measures feel extreme. 
            Slowing the spread is our best tool to prevent catastrophic collapse of our medical systems.
          </p>
          { (confirmed > 100 ||deaths > 10) && per == 'total' ?
          <p className="is-size-6"style={{marginTop: '10px'}}>
            The <strong>{field =='confirmed' ? 'Cases' :'Deaths'} double every 3 days</strong> comparison is based on compounding daily growth starting from when {name}'s daily figure first exceeded{' '}
            { confirmed > 100 && field =='confirmed'? <strong>100 confirmed cases</strong> : <></> }{' '}
            { deaths > 10 && field != 'confirmed' ? <strong>10 deaths</strong> : <></> }
          </p>
          : <></> }
          <div style={{marginTop: '10px', marginBottom: '10px'}}>
            <p className="is-size-6">
              Global data updated at <strong>{update_times.global}</strong>
            </p>
            
            {name == 'New Zealand' ?
            <>
              <p className="is-size-6">
                {name} data updated at <strong>{update_times.nz}</strong>
              </p>
              <p className="is-size-6">
                Regional data updated at <strong>{update_times.nz_regional}</strong>
              </p>

              <p className="is-size-6" style={{marginTop: '10px'}}>
                While we're in lockdown please visit <a href="https://www.alonetogether.co.nz/" 
                  target="_blank" 
                  rel="noopener noreferrer">Alone Together</a> for ideas to help you take care of yourself and others
                
              </p>
              
              

            </>
            : <></> }
          </div>
      </div>
      )
  }
    
    return (<>
        <SEO title={`Flatten The Curve: ${selected_country} COVID-19 Status`} />

        { active_country.name == 'New Zealand' ? 
          <>
          <section className="section" style={{paddingBottom: 0}}>
            <div className="container">
                <div className="columns info" style={{alignItems: 'flex-end'}}>
                    <div className="column is-half"> 
                        <h2 className="is-size-2 title">{selected_country}</h2>
                        <table className="subtitle">
                            <tr>
                                <th className="is-size-4" style={{paddingRight: '10px', textAlign: 'right'}}>{this.tidyFormat(active_country.highest_confirmed)}</th>
                                <td className="is-size-4">Cases</td>
                            </tr>
                            <tr>
                                <th className="is-size-4" style={{paddingRight: '10px', textAlign: 'right'}}>{this.tidyFormat(active_country.highest_deaths)}</th>
                                <td className="is-size-4">{ active_country.highest_deaths == 1 ? 'Death' : 'Deaths'}</td>
                            </tr>
                        </table>
                    </div>
                    <div className="column is-half text-right-align-desktop"> 
                        <p className="is-size-7">
                            Global data updated at <strong>{update_times.global}</strong>
                        </p>
                        {selected_country== 'New Zealand' ? 
                            <p className="is-size-7">
                                {selected_country} data updated at <strong>{update_times.nz_regional}</strong>
                            </p>
                        : <></>}
                    </div>
                </div>
            </div>                
          </section>
          <NZView width={this.props.overview_width} height={this.props.overview_height}/>
          </>
        :


        <section className="section">
          <div className="container">
            <div className="columns info">
              <div className="column is-two-thirds"> 
                <h2 className="is-size-3 title">
                  {active_country.name}
                </h2>
                <p className="is-size-4 subtitle">
                  {
                    // Notice use of country wide constant variable, not dynamically based on highest. due to sorting
                  active_country.highest_confirmed ? this.tidyFormat(active_country.highest_confirmed) + ' Cases' : ''}
                  <span style={{float: 'right'}}>
                    {active_country.highest.deaths ? this.tidyFormat(active_country.highest.deaths) + ' Deaths' : ''}
                  </span>
                </p>  
                <CountryOverviewGraph 
                  active_country={active_country}
                  scale={this.state.overview_scale}
                  field={field}
                  full_field_name={full_field_name}
                  width={this.props.overview_width}
                  height={this.props.overview_height}
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
        }
        <CountryGrid 
          active_country={active_country}
          countries={countries}
          grid_width={this.props.grid_width}
          grid_height={this.props.grid_height}
          is_mobile={this.props.is_mobile}
          tidy={this.tidyFormat}
        />
      
    </>)
  }
  
}