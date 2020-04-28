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
        overview_scale: 'log',
    }
  }
  
  tidyFormat = (numberString) => {
    return this.state.numberFormat.format(numberString)
  }
  
  render(){
    const {countries, update_times} = this.props.stateHook
    const {selected_country} = this.state

    
    const active_country = SetupCountry({
      country: countries.filter( (c) => c.name ===  this.state.selected_country )[0]
    })
    const country = active_country
    const latest = active_country.time_series[active_country.time_series.length - 1]
    
    return (<>
        <SEO title={`Flatten The Curve: ${selected_country} COVID-19 Status`} />
        <section className="section">
          <div className="container">
            <div className="columns" style={{alignItems: 'center'}}>
              <div className="column is-one-third">
                <h2 className="is-size-2 title">{selected_country}</h2>
                <table style={{marginBottom: '10px'}}>
                  <tbody>
                    <tr>
                        <td className="is-size-6" style={{paddingRight: '10px', textAlign: 'right'}}>Daily Change</td>
                        <td className="is-size-6" style={{paddingRight: '5px', textAlign: 'right'}}>Total</td>
                    </tr>
                      <tr>
                      <th className="is-size-4" style={{paddingRight: '10px', textAlign: 'right'}}>
                              {this.tidyFormat(country.highest_confirmed - country.time_series[country.time_series.length - 2].confirmed)}
                          </th>
                          <th className="is-size-4" style={{paddingRight: '5px', textAlign: 'right'}}>
                              {this.tidyFormat(country.highest_confirmed)}
                          </th>
                          
                          <td className="is-size-6"style={{verticalAlign: 'middle'}}>Cases</td>
                      </tr>
                      {country.highest_deaths ?
                      <tr>
                          <th className="is-size-4" style={{paddingRight: '10px', textAlign: 'right'}}>
                              {this.tidyFormat(country.highest_deaths - country.time_series[country.time_series.length - 2].deaths)}
                          </th>
                          <th className="is-size-4" style={{paddingRight: '5px', textAlign: 'right'}}>
                              {this.tidyFormat(country.highest_deaths)}
                          </th>
                          
                          <td className="is-size-6" style={{verticalAlign: 'middle'}}>Deaths</td>
                      </tr>
                      :<></> }
                      {country.highest_recovered ?
                      <tr>
                          <th className="is-size-4" style={{paddingRight: '10px', textAlign: 'right'}}>
                              {this.tidyFormat(country.highest_recovered - country.time_series[country.time_series.length - 2].recovered)}
                          </th>
                          <th className="is-size-4" style={{paddingRight: '5px', textAlign: 'right'}}>
                              {this.tidyFormat(country.highest_recovered)}
                          </th>
                          
                          <td className="is-size-6" style={{verticalAlign: 'middle'}}>Recovered</td>
                      </tr>
                      :<></> }
                      </tbody>
                      </table>
                      <table>

                      <tbody>
                      <tr >
                          <th className="is-size-4" style={{paddingRight: '5px', textAlign: 'right', paddingTop: '15px'}}>
                            {
                            this.tidyFormat( ( latest.confirmed / ( active_country.population / 1000000 ) ).toFixed(0))
                            }
                          </th>
                          <td className="is-size-6" style={{paddingTop: '15px', verticalAlign: 'middle'}}>Cases per million</td>
                      </tr>
                      {active_country.highest_deaths && active_country.highest_deaths > 10 ?
                        <tr>
                            <th className="is-size-4" style={{paddingRight: '5px', textAlign: 'right'}}>{
                              this.tidyFormat( ( latest.deaths / (active_country.population / 1000000) ).toFixed(1) )}</th>
                            <td className="is-size-6" style={{verticalAlign: 'middle'}}>Deaths per million</td>
                        </tr>
                      :<></> }
                      <tr >
                          <th className="is-size-4" style={{paddingRight: '5px', textAlign: 'right'}}>
                            {this.tidyFormat(((latest.recovered / latest.confirmed) * 100).toFixed(0))}%
                          </th>
                          <td className="is-size-6" style={{verticalAlign: 'middle'}}>Recovered</td>
                      </tr>
                      {active_country.highest_deaths && active_country.highest_deaths > 10 ?
                        <tr>
                            <th className="is-size-4" style={{paddingRight: '5px', textAlign: 'right'}}>
                            {this.tidyFormat(((latest.deaths / latest.confirmed) * 100).toFixed(1))}%
                            </th>
                            <td className="is-size-6" style={{verticalAlign: 'middle'}}>Died</td>
                        </tr>
                      :<></> }
                      </tbody>
                  </table>
                <div> 
                  <p className="is-size-7" style={{marginTop: '20px'}}>
                      Global data updated at <strong>{update_times.global}</strong>
                  </p>
                  {selected_country== 'New Zealand' ? 
                  <>
                      <p className="is-size-7">
                          Nationwide data updated at <strong>{update_times.nz}</strong>
                      </p>
                      <p className="is-size-7">
                          DHB data updated at <strong>{update_times.nz_regional}</strong>
                      </p>
                  </>
                  : <></>}
                </div>
              </div>
              <div className="column is-two-thirds">  
              <div className="field is-grouped is-horizontal"  style={{width: "100%", justifyContent: 'flex-end'}}>
                  <div className="control">
                    <div className="select">
                      <select value={this.state.overview_scale} onChange={e => this.setState({overview_scale: e.target.value})}>
                        <option value="linear">Linear</option>
                        <option value="log">Log</option>
                      </select>
                    </div>
                  </div>
                </div>
                <CountryOverviewGraph 
                  active_country={active_country}
                  scale={this.state.overview_scale}
                  width={this.props.overview_width}
                  height={this.props.overview_height}
                />
              </div>
            </div>
          </div>                
        </section>
        { selected_country == 'New Zealand' ?
          <NZView width={this.props.overview_width} height={this.props.overview_height}/>
        : <></> }
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