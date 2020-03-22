import React from "react"

import Hero from "../components/hero"
import SEO from "../components/seo"
import Tabs from "../components/tabs"
import CountryOverviewGraph from "../components/country-overview-graph"
import GridBar from "../components/grid-bar"
import GridItem from "../components/grid-item"
import Footer from "../components/footer"
import GetTopCountries from '../utils/get-top-countries'
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
        sort: 'worst',
        limit: 60,
        width:  800,
        height: 182
    }
  }
  
  tidyFormat = (numberString) => {
    return this.state.numberFormat.format(numberString)
  }
  
  render(){
    const {countries} = this.props.stateHook
    const {selected_country, field, sort, per, limit} = this.state

    let full_field_name = field === 'confirmed' ? 
      per === 'total' ? 'confirmed' : 'confirmed_per_mil' :
      per === 'total' ? 'deaths' : 'deaths_per_mil'

    
    const active_country = SetupCountry({
      country: countries.filter( (c) => c.country_name ===  this.state.selected_country )[0],
      field: full_field_name
    })
    
    const topCountries = GetTopCountries({ 
      countries, 
      active_country, 
      field: full_field_name, 
      sort, 
      limit 
    })
    
    return (
      <React.Fragment>
        <SEO title={selected_country + ' COVID-19 Progress'} />
        <Hero selected_country={selected_country}/>
        <section className="section">
          <div className="container">
            <div className="columns info">
              <div className="column"> 
                <h2 className="is-size-3 title">
                  {active_country.country_name}
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
                  field={field}
                  full_field_name={full_field_name}
                  width={this.state.width}
                />
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
                <Tabs country_name={active_country.country_name}/>
              </div>
            </div>
          </div>                
        </section>
        <GridBar 
          active_country_name={active_country.country_name}
          per={this.state.per}
          field={this.state.field}
          sort={this.state.sort}
          length={topCountries.length}
          fieldFn={e => this.setState({field: e.target.value})}
          perFn={e => this.setState({per: e.target.value})}
          sortFn={e => this.setState({sort: e.target.value})}
        />
        <section className="section">
          <div className="container">
            <div className="columns" style={{flexWrap: 'wrap'}}>
              { topCountries.map( (country, i) => (
                <GridItem 
                  country={country} 
                  key={i}
                  active_country={active_country} 
                  openModalFn={ () => this.setState({ modal_open: true, active_country, comparable_country: country } ) }
                  per={per}
                  field={field}
                  tidy={this.tidyFormat}
                  width={this.state.width}
                />
              ))}              
            </div>
          </div>
        </section>
        <Footer />
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