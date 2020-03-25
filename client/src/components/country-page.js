import React from "react"

import Hero from "../components/hero"
import SEO from "../components/seo"
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
        overview_scale: 'linear',
        grid_width: 0,
        grid_height: 0,
        max_count: 30,
        is_mobile: false,
        update_time: '12:20am 25 March UTC',
        nz_time: '1:03pm 25 March NZT',
        forecast_faq_open: false,
    }
  }
  
  tidyFormat = (numberString) => {
    return this.state.numberFormat.format(numberString)
  }
  
  render(){
    const {countries} = this.props.stateHook
    const {selected_country, field, sort, per, max_count} = this.state

    let full_field_name = field === 'confirmed' ? 
      per === 'total' ? 'confirmed' : 'confirmed_per_mil' :
      per === 'total' ? 'deaths' : 'deaths_per_mil'

    
    const active_country = SetupCountry({
      country: countries.filter( (c) => c.country_name ===  this.state.selected_country )[0],
      field: full_field_name
    })
    
    const topCountries = GetTopCountries({ 
      max_count: this.state.is_mobile ? this.state.max_count : 100,
      countries, 
      active_country, 
      field: full_field_name, 
      sort, 
    })


    const ContentBlock = () => {
      const {country_name, highest} = active_country
      const {confirmed, deaths} = highest
      return (
      <div className="box">
          <h3 className="is-size-4 title">{country_name} must act now</h3>
          
          <p className="is-size-6">
            Because of the explosive growth, it is critical we all do our best to flatten the curve, even when these early measures feel extreme. 
            Slowing the spread is our best tool to prevent catastrophic collapse of our medical systems.
          </p>
          { confirmed > 100 ||deaths > 10 ?
          <p className="is-size-6">
            The cumulative daily growth is based on compounding daily growth starting from the daily figure when {country_name} first exceeded{' '}
            { confirmed > 100 ? <strong>100 confirmed cases</strong> : <></> }{' '}
            { deaths > 10 ? <>and <strong>10 deaths</strong></> : <></> }
          </p>
          : <></> }
          <div style={{marginTop: '10px', marginBottom: '10px'}}>
            <p className="is-size-6">
              Global data updated at <strong>{this.state.update_time}</strong>
            </p>
            
            {country_name == 'New Zealand' ?
            <p className="is-size-6">
              New Zealand data updated at 
              <strong>{this.state.nz_time}</strong>
            </p>
            : <></> }
          </div>
          { this.state.forecast_faq_open ? 
            < div style={{margin: '20px 10px'}}>
              <p className="is-size-7">
                The forecasts below show a future projection of COVID-19 in {country_name}. 
                This is based on the historical growth data of each country that is currently ahead of {country_name} in the outbreak.
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
            </div>
            : <></> }
          <button className="button is-dark is-outlined is-size-7" onClick={e => this.setState({forecast_faq_open: ! this.state.forecast_faq_open})}>
            {this.state.forecast_faq_open ? 'Close': 'Forecast info'}
          </button>
          
      </div>
      )
  }
    
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
                  scale={this.state.overview_scale}
                  field={field}
                  full_field_name={full_field_name}
                  width={this.state.overview_width}
                  height={this.state.overview_height}
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
                        <option value="linear">Linear Scale</option>
                        <option value="log">Log Scale</option>
                      </select>
                    </div>
                  </div>
                </div>
                <ContentBlock/>
              </div>
            </div>
          </div>                
        </section>
          <GridBar 
            active_country_name={active_country.country_name}
            max_count={this.state.is_mobile ? this.state.max_count : 100}
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

    let overview_width =  860
    let overview_height = 500
    
    let grid_width = 391
    let grid_height = 200

    let is_mobile = false
    
    if(window.innerWidth < 1408){ // FullHD
      overview_width =  740
      overview_height = 550
      grid_width = 350
      grid_height = 180
      is_mobile = false
    }
    if(window.innerWidth < 1216){ // Desktop
      overview_width =  600
      overview_height = 400
      grid_width = 285
      grid_height = 160
      is_mobile = false
    }
    if(window.innerWidth < 1024){
      overview_width =  450
      overview_height = 400
      grid_width = 200
      grid_height = 120
      is_mobile = false
    }

    if(window.innerWidth < 769){
      overview_width =  650
      overview_height = 450
      grid_width = 600
      grid_height = 300
      is_mobile = true   
    }
    if(window.innerWidth < 480){
      overview_width = 300
      overview_height = 300
      grid_width = 280
      grid_height = 150  
       
    }

    //window.innerHeight
    
    this.setState({ overview_width, overview_height, grid_width, grid_height, is_mobile });
  
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