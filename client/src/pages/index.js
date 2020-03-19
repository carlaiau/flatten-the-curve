import React from "react"
import { graphql} from "gatsby"
import Hero from "../components/hero"
import SEO from "../components/seo"
import Tabs from "../components/tabs"
import Modal from "../components/modal"
import GetTopCountries from '../utils/get-top-countries.js'

import 'bulma/css/bulma.css'
import '../styles/custom.css'
import { format, parse, formatDistance } from "date-fns"
import {LineChart, Line, XAxis, YAxis, Tooltip, Legend} from 'recharts'

// Need to actually make it dynamically determine the date

export default class IndexPage extends React.Component{
  
  constructor(props){
		super(props);
		this.state = {
      countries: props.data.countries.nodes,
      countries_in_select_box: props.data.select_countries.nodes,
      selected_country: 'New Zealand',
      numberFormat: new Intl.NumberFormat(),
      field: 'confirmed',
      per: 'total',
      sort: 'worst',
      limit: 60,
      modal_open: false,
      active_country: null,
      comparable_country: null,
      width:  800,
      height: 182,
      min_days_ahead: 10 // This is actually meant to be 7
    }
  }

  tidyFormat(numberString){
    return this.state.numberFormat.format(numberString)
  }
  
  render(){
    const {selected_country, countries_in_select_box, countries, field, sort, per, limit} = this.state

    let full_field_name = field === 'confirmed' ? 
      (per === 'total' ? 'confirmed' : 'confirmed_per_mil') :
      (per === 'total') ? 'deaths' : 'deaths_per_mil'

    let active_country = countries.filter( (c) => c.country_name ===  this.state.selected_country )[0]
    
    active_country.time_series.forEach( (time) => {
      if(active_country.highest && time[full_field_name] > active_country.highest[full_field_name])
        active_country.highest = time
      else if(!active_country.highest)
        active_country.highest = time
    })
    
    
    
    const top = GetTopCountries({ 
      countries, 
      active_country, 
      field: full_field_name, 
      min_days_ahead: this.state.min_days_ahead, 
      sort, 
      limit 
    })

    const Graph = () => {
      const filteredData = this.state.field == 'confirmed' ? active_country.time_series.filter(t => parseInt(t.confirmed) > 0) : active_country.time_series.filter(t => parseInt(t.deaths) > 0)
      if(filteredData.length){
        return (
          <LineChart width={this.state.width >= 768 ? 620 : 303} height={this.state.width >= 768 ? 372 : 150} data={filteredData}>
            <XAxis dataKey="date"/>
            <YAxis width={55}/>
            {
              full_field_name == 'confirmed' ? 
                <Line type="monotone" dataKey="confirmed" name="Total confirmed cases" stroke="#ff793f"/> :
              full_field_name == 'deaths' ? 
                <Line type="monotone" dataKey="deaths" name="Total deaths" stroke="#ff5252"/> 
                :
              full_field_name == 'confirmed_per_mil' ? 
                <Line type="monotone" dataKey="confirmed_per_mil" name="Confirmed cases per million" stroke="#ff793f" formatter={value => value.toFixed(2)}/> 
                :
                <Line type="monotone" dataKey="deaths_per_mil" name="Deaths per million"stroke="#ff5252"/>
            }
            <Tooltip/>
            <Legend verticalAlign="top"/>

          </LineChart>
        )
      }
      return <React.Fragment><p className="is-size-4">No Results to Graph!</p></React.Fragment>
    }



    return (
      <React.Fragment>
        <SEO title="Home" />
        <Hero countries={countries_in_select_box} selected_country={selected_country} changeFn={ (e) => this.setState({selected_country: e.target.value}) }/>
        

        
        <section className="section">
          <div className="container">
            <div className="columns info">
              <div className="column"> 
                <h2 className="is-size-3 title">{active_country.country_name}</h2>
                <p className="is-size-4 subtitle">
                  {active_country.highest.confirmed ? this.tidyFormat(active_country.highest.confirmed) + ' Cases' : '' }
                  <span style={{float: 'right'}}>
                    {active_country.highest.deaths ?  ' ' + this.tidyFormat(active_country.highest.deaths) + ' Deaths' : '' }
                  </span>
                </p>  

                <div className="box" style={{padding: '10px'}}>
                  <Graph />
                </div>
              </div>
              <div className="column">
                <div className="field is-grouped is-horizontal">
                  <div className="control">
                    <div className="select">
                      <select value={this.state.field} onChange={e => this.setState({field: e.target.value})}>
                        <option value="confirmed">Confirmed Cases</option>
                        <option value="deaths">Deaths</option>
                      </select>
                    </div>
                  </div>
                  <div className="control">
                    <div className="select">
                      <select value={this.state.per} onChange={e => this.setState({per: e.target.value})}>
                        <option value="total">Total</option>
                        <option value="per_million">Per Millon</option>
                      </select>
                    </div>
                  </div>
                </div>
                <Tabs />
              </div>
            </div>
          </div>                
        </section>
        
        <section className="section bar">
          <div className="container">
            <div className="columns" style={{flexWrap: 'wrap', alignItems: 'center'}}>
              <div className="column">
                <div className="title-with-inputs" style={{marginBottom: '10px'}}>
                  <p className="is-size-5">
                    Showing the {top.length} countr{top.length === 1? 'y': 'ies'} that are now ranked higher than {active_country.country_name} by
                  </p>
                  <div className="field is-grouped is-horizontal">
                    <div className="control">
                      <div className="select">
                        <select value={this.state.field} onChange={e => this.setState({field: e.target.value})}>
                          <option value="confirmed">Confirmed Cases</option>
                          <option value="deaths">Deaths</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="field is-grouped is-horizontal">
                    <div className="control">
                      <div className="select">
                        <select value={this.state.per} onChange={e => this.setState({per: e.target.value})}>
                          <option value="total">Total</option>
                          <option value="per_million">Per Millon</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="field is-grouped is-horizontal">
                    <div className="control">
                      <div className="select">
                        <select value={this.state.sort} onChange={e => this.setState({sort: e.target.sort})}>
                          <option value="worst">Worst First</option>
                          <option value="best">Best First</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>              
            </div>
          </div>                
        </section>
        
        <section className="section">
          <div className="container">
            <div className="columns" style={{flexWrap: 'wrap'}}>
              { top.map( (country) => (
                <div className="column is-one-third" key={country.country_name}>
                  <div className="box has-background-success has-text-white country">
                    <div className="content" style={{position: 'relative'}}>
                      <h2 className="is-size-3  has-text-white" style={{marginTop: 0}}>{country.country_name}</h2>
                      <p className="is-size-6 has-text-white">
                      {formatDistance(parse(country.earliest.date, 'MM/dd/yy', new Date()), parse('03/16/20', 'MM/dd/yy', new Date()) ) } ago {country.country_name}  had similar {this.state.per === 'total' ? ' total': 'per million'} {this.state.field === 'deaths'? 'deaths': 'confirmed cases'} as
                      {' '} {active_country.country_name}
                        
                      </p>
                      <table className="table is-narrow ">


                      <thead>

                        <tr>
                          <th className={this.state.per != 'total' ? 'is-hidden': ''}>Total</th>
                          <th className={this.state.per == 'total' ? 'is-hidden': ''}>Per Million</th>
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
                            <td className={this.state.per != 'total' ? 'is-hidden': ''}>{this.tidyFormat(country.earliest.confirmed)}</td>
                            <td className={this.state.per != 'total' ? 'is-hidden': ''}>{this.tidyFormat(country.highest.confirmed)}</td>

                            <td className={this.state.per == 'total' ? 'is-hidden': ''}>{country.earliest.confirmed_per_mil ? country.earliest.confirmed_per_mil.toFixed(2): ''}</td>
                            <td className={this.state.per == 'total' ? 'is-hidden': ''}>{country.highest.confirmed_per_mil ? country.highest.confirmed_per_mil.toFixed(2): ''}</td>
                          </tr>
                          <tr>
                            <th>Deaths</th>
                            <td className={this.state.per != 'total' ? 'is-hidden': ''}>{this.tidyFormat(country.earliest.deaths)}</td>
                            <td className={this.state.per != 'total' ? 'is-hidden': ''}>{this.tidyFormat(country.highest.deaths)}</td>
                            
                            
                            <td className={this.state.per == 'total' ? 'is-hidden': ''}>{country.earliest.deaths_per_mil ? country.earliest.deaths_per_mil.toFixed(2): ''}</td>
                            <td className={this.state.per == 'total' ? 'is-hidden': ''}>{country.highest.deaths_per_mil ? country.highest.deaths_per_mil.toFixed(2): ''}</td>
                          </tr>
                          <tr>
                            <th>Recovered</th>
                            <td className={this.state.per != 'total' ? 'is-hidden': ''}>{this.tidyFormat(country.earliest.recovered)}</td>
                            <td className={this.state.per != 'total' ? 'is-hidden': ''}>{this.tidyFormat(country.highest.recovered)}</td>
                            
                            <td className={this.state.per == 'total' ? 'is-hidden': ''}>{country.earliest.recovered_per_mil ? country.earliest.recovered_per_mil.toFixed(2): ''}</td>
                            <td className={this.state.per == 'total' ? 'is-hidden': ''}>{country.highest.recovered_per_mil ? country.highest.recovered_per_mil.toFixed(2): ''}</td>
                          </tr>
                        </tbody>
                      </table>
                        { country.highest.confirmed_per_mil > active_country.highest.confirmed_per_mil ?
                          <button className='button is-dark has-text-white'
                            onClick={() => this.setState({
                              modal_open: true,
                              active_country,
                              comparable_country: country
                              })  
                            }
                            style={{width: '100%', maxWidth: '100%', height: '40px', border: 'none'}}
                          >
                            View Forecast and  Progression
                          </button>
                        :
                          <button className='button has-background-success is-size-7 has-text-white'>
                            Insufficient confirmed cases per million for forecast
                          </button>
                      }
                    </div>
                  </div>
                </div>
              ))}                    
            </div>
          </div>
        </section>
        
        
        <section className="section  has-background-dark has-text-white footer">
          <div className="container">
            <h2 className="is-size-4">This is work in progress</h2>
            <p className="is-size-7">COVID daily updated infection data is from the <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank" rel="noopener noreferrer">John Hopkins repo</a></p>
            <p className="is-size-7">Population data sourced from Population data sourced from <a href="https://data.worldbank.org/indicator/SP.POP.TOTL" target="_blank" rel="noopener noreferrer">The World Bank</a></p>
            <p className="is-size-7">Favicon sourced from {' '}
              <a href="https://www.iconfinder.com/becris" target="_blank" rel="noopener noreferrer">
                becris
              </a> {' '}
              via Iconfinder's {' '}
              <a href="https://www.iconfinder.com/p/coronavirus-awareness-icons" target="_blank" rel="noopener noreferrer">
                Coronavirus Awareness Icon Campaign
              </a>
            </p>
            <p className="is-size-4" style={{marginTop: '10px'}}>Code available at  <a href="https://github.com/carlaiau/flatten-the-curve" target="_blank" rel="noopener noreferrer">Github</a>.</p>
            <p className="is-size-4">
              Currently in development by <a href="https://carlaiau.com/">Carl Aiau</a>
            </p>
          </div>
        </section>
        <Modal open={this.state.modal_open} active={this.state.active_country} compare={this.state.comparable_country} width={this.state.width} closeFn={() => this.setState({modal_open: false})}/>
      </React.Fragment>
    )
  }

  /**
   * Calculate & Update state of new dimensions
   */
  updateDimensions = () => {  
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  /**
   * Add event listener
   */
  componentDidMount = () => {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  /**
   * Remove event listener
   */
  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateDimensions);
  }
  
}


export const query = graphql`
  query {
    countries: allCountriesJson(sort: {order: DESC, fields: highest_confirmed}, filter: {highest_confirmed: {gte: 1}, population: {gte: 100000}}) {
      nodes {
        country_name
        id
        time_series {
          date
          confirmed
          confirmed_per_mil
          deaths
          deaths_per_mil
          recovered
          recovered_per_mil
        }
        highest_confirmed
      }
    }
    select_countries: allCountriesJson(sort: {order: ASC, fields: country_name}, filter: {highest_confirmed: {gte: 1}, population: {gte: 100000}}) {
      nodes {
        country_name
        highest_confirmed
      }
    }
  }
  
`
