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
        overview_width: 0,
        overview_height: 0,
        grid_width: 0,
        grid_height: 0
    }
  }
  
  tidyFormat = (numberString) => {
    return this.state.numberFormat.format(numberString)
  }
  
  render(){
    const {countries} = this.props.stateHook
    const {selected_country, field, sort, per} = this.state

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
    })
    
    return (
      <React.Fragment>
        <SEO title={`Flatten The Curve: ${selected_country} COVID-19 Status`} />
        <Hero selected_country={selected_country}/>
        <section className="section">
          <div className="container">
            <div className="columns info">
              <div className="column is-two-thirds"> 
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
                  width={this.state.overview_width}
                  height={this.state.overview_height}
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
                  width={this.state.grid_width}
                  height={this.state.grid_height}
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


    // For Overview: width={width >= 768 ? 620 : 303} height={width >= 768 ? 372 : 250}
    
    // For grid width={width >= 768 ? 391 : 280} height={width >= 768 ? 200: 150}
    let overview_width =  860
    let overview_height = 500
    
    let grid_width = 391
    let grid_height = 200
    
    if(window.innerWidth < 1408){ // FullHD
      overview_width =  740
      overview_height = 550
      grid_width = 350
      grid_height = 180
    }
    if(window.innerWidth < 1216){ // Desktop
      overview_width =  600
      overview_height = 400
      grid_width = 285
      grid_height = 160
    }
    if(window.innerWidth < 1024){
      overview_width =  450
      overview_height = 400
      grid_width = 200
      grid_height = 120
    }

    if(window.innerWidth < 769){
      overview_width =  650
      overview_height = 450
      grid_width = 600
      grid_height = 300   
    }
    if(window.innerWidth < 480){
      overview_width = 300
      overview_height = 300
      grid_width = 280
      grid_height = 150   
    }

    //window.innerHeight
    
    this.setState({ overview_width, overview_height, grid_width, grid_height });
  
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