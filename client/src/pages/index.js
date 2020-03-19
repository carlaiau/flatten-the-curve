import React from "react"
import { graphql} from "gatsby"
import Hero from "../components/hero"
import SEO from "../components/seo"
import Tabs from "../components/tabs"
import Modal from "../components/modal"
import CountryOverviewGraph from "../components/country-overview-graph"

import GridBar from "../components/grid-item"
import GridItem from "../components/grid-item"
import Footer from "../components/footer"
import GetTopCountries from '../utils/get-top-countries.js'

import 'bulma/css/bulma.css'
import '../styles/custom.css'


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
      min_days_ahead: 10 // This is two weeks, offset of 3 bug
    }
  }

  tidyFormat = (numberString) => {
    return this.state.numberFormat.format(numberString)
  }

  

  
  render(){
    const {selected_country, countries_in_select_box, countries, field, sort, per, limit} = this.state

    let full_field_name = field === 'confirmed' ? 
      per === 'total' ? 'confirmed' : 'confirmed_per_mil' :
      per === 'total' ? 'deaths' : 'deaths_per_mil'

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
                  {active_country.highest.confirmed ? this.tidyFormat(active_country.highest.confirmed) + ' Cases' : ''}
                  <span style={{float: 'right'}}>
                    {active_country.highest.deaths ? this.tidyFormat(active_country.highest.deaths) + ' Deaths' : ''}
                  </span>
                </p>  

                <div className="box" style={{padding: '10px'}}>
                  <CountryOverviewGraph 
                    active_country={active_country}
                    field={field}
                    full_field_name={full_field_name}
                    width={this.state.width}
                  />
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
                <Tabs country_name={active_country.country_name} min_days={this.state.min_days_ahead - 3}/>
              </div>
            </div>
          </div>                
        </section>
        <GridBar 
          active_country_name={active_country.country_name}
          per={this.state.per}
          field={this.state.field}
          sort={this.state.sort}
          length={top.length}
          fieldFn={e => this.setState({field: e.target.value})}
          perFn={e => this.setState({per: e.target.value})}
          sortFn={e => this.setState({sort: e.target.value})}
        />
        <section className="section">
          <div className="container">
            <div className="columns" style={{flexWrap: 'wrap'}}>
              { top.map( (country) => (
                <GridItem 
                  country={country} 
                  active_country={active_country} 
                  openModalFn={ () => this.setState({ modal_open: true, active_country, comparable_country: country } ) }
                  per={per}
                  field={field}
                  tidy={this.tidyFormat}
                />
              ))}                    
            </div>
          </div>
        </section>
        <Footer />
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
    countries: allCountriesJson(sort: {order: DESC, fields: highest_confirmed}, filter: {highest_confirmed: {gte: 1}, population: {gte: 1000000}}) {
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
        population
      }
    }
    select_countries: allCountriesJson(sort: {order: ASC, fields: country_name}, filter: {highest_confirmed: {gte: 1}, population: {gte: 1000000}}) {
      nodes {
        country_name
        highest_confirmed
      }
    }
  }
  
`
