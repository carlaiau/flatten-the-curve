import React from "react"
import { graphql} from "gatsby"
import SEO from "../components/seo"
import 'bulma/css/bulma.css'
import '../styles/custom.css'
import { format, parse, formatDistance } from "date-fns"

export default class IndexPage extends React.Component{
  
  constructor(props){
		super(props);
		this.state = {
      countries: props.data.countries.nodes,
      countries_in_select_box: props.data.select_countries.nodes.filter( (c) => c.country_name !== 'China'),
      selected_country: 'New Zealand',
      numberFormat: new Intl.NumberFormat(),
      field: 'confirmed',
      per: 'total'
		}
  }
  
  tidyFormat(numberString){
    return this.state.numberFormat.format(numberString)
  }
  
  render(){
    const {countries, countries_in_select_box, field, per} = this.state
    let active_country = countries.filter( (c) => c.country_name === this.state.selected_country )[0]
    
    
    active_country.time_series.forEach( (time) => {
      if(active_country.highest && time.confirmed > active_country.highest.confirmed)
        active_country.highest = time
      else if(!active_country.highest)
        active_country.highest = time
    })


    
    countries.forEach( (country) => {
      let earliest = {}
      let highest = {}
      country.time_series.forEach( (time) => {
        if(earliest.confirmed){
          if(time.confirmed < earliest.confirmed && ( time.confirmed >= active_country.highest_confirmed) )  
            earliest = time
        }
        else if(!earliest.confirmed && time.confirmed >= active_country.highest_confirmed)
          earliest = time
        
        if(highest.confirmed && time.confirmed > highest.confirmed)
          highest = time
        else if(!highest.confirmed)
          highest = time
      })
      country.earliest = earliest
      country.highest = highest
    })


    // Sort
    if(per === 'per_million'){
      if(field === 'confirmed') 
        countries.sort((a, b) => (a.highest.confirmed_per_mil < b.highest.confirmed_per_mil) ? 1 : -1)
      else 
        countries.sort((a, b) => (a.highest.deaths_per_mil < b.highest.deaths_per_mil) ? 1 : -1)
    } 
    else{
      if(field === 'confirmed') 
        countries.sort((a, b) => (a.highest.confirmed < b.highest.confirmed) ? 1 : -1)
      else 
        countries.sort((a, b) => (a.highest.deaths < b.highest.deaths) ? 1 : -1)
    }


    // Then choose top
    const top= countries.filter(
      country => country.highest_confirmed > active_country.highest_confirmed
    ).slice(0, 60)




    

    return (
      <React.Fragment>
        <SEO title="Home" />
        <section className="hero is-info ">
          <div className="hero-body">
            <div className="container">
              <div className="columns">
                <div className="column">
                  <h1 className="title">
                    COVID-19: Flatten The Curve
                  </h1>
                  <p className="subtitle is-size-5">A unique way of showing the importance of early protective measures</p>
                </div>
                <div className="column">
                  <div className="field is-grouped is-horizontal">
                      <div className="control">
                        <div className="select">
                          <select value={this.state.selected_country} onChange={e => this.setState({selected_country: e.target.value})}>
                            {countries_in_select_box.map( ({country_name, highest_confirmed }) => (
                              <option key={country_name} value={country_name}>{country_name}:     {highest_confirmed}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="control">
                        <button className="button is-success">Go</button>
                      </div>
                    </div>
                    <p className="is-size-7">
                      Please note: If your country is not showing we are filtering for populations over 3 million and at least 3 confirmed cases.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section">
          <div className="container">
            <div className="columns info">
              <div className="column is-narrow">
                <div className="box has-background-success">
                  <h3 className="is-size-4 title has-text-white">{this.state.selected_country}'s Current State</h3>  
                  <table className="table is-borderless is-size-6" style={{border: 'none', background: 'none'}}>
                    <thead>
                      <tr>
                        <td></td>
                        <td>Total</td>
                        <td>Per Million</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Confirmed</th>
                        <td>{this.tidyFormat(active_country.highest.confirmed)}</td>
                        <td>{active_country.highest.confirmed_per_mil.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <th>Deaths</th>
                        <td>{this.tidyFormat(active_country.highest.deaths)}</td>
                        <td>{active_country.highest.deaths_per_mil ? active_country.highest.deaths_per_mil.toFixed(2): ''}</td>
                      </tr>
                      <tr>
                        <th>Recovered</th>
                        <td>{this.tidyFormat(active_country.highest.recovered)}</td>
                        <td>{active_country.highest.recovered_per_mil ? active_country.highest.recovered_per_mil.toFixed(2): ''}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="column desc">
                  <p className="is-size-5">
                    This is a work in Progress. Code is freely available on <a href="https://github.com/carlaiau/flatten-the-curve"  target="_blank" rel="noopener noreferrer">
                      GitHub</a> and pull requests are welcome.
                  </p>
                  <p className="is-size-5">
                    Inspired by <a href="https://flattenthecurve.com/" target="_blank" rel="noopener noreferrer">Flattenthecurve.com</a>. Please visit this site for actionable steps to slow the spread.
                  </p>
                  <p className="is-size-5">
                    COVID-19 Data belongs to <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank" rel="noopener noreferrer">Johns Hopkins University</a> and was last updated at 3:36pm Mar, 17 2020 NZT.
                    </p>
                </div>
            </div>

            <div className="columns">
              <div className="column title-with-inputs">
                <p className="is-size-5">Showing {top.length} Countr{top.length == 1? 'y': 'ies'} With Highest</p>
                <div className="field is-grouped is-horizontal">
                  <div className="control">
                    <div className="select">
                      <select value={this.state.field} onChange={e => this.setState({field: e.target.value})}>
                        <option value="confirmed">Confirmed</option>
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

              </div>
            </div>

            
            

            
            
            <div className="columns" style={{flexWrap: 'wrap'}}>
              { top.map( (country) => (
                <div className="column is-one-third" key={country.country_name}>
                  <div className="box has-background-danger has-text-white country">
                    <div className="content" style={{position: 'relative'}}>
                    <p className="is-size-4" style={{marginBottom: 0}}>
                        <strong>
                          {formatDistance(parse(country.earliest.date, 'MM/dd/yy', new Date()), parse('03/15/20', 'MM/dd/yy', new Date()) ) } ago
                        </strong>
                      </p>
                      <h2 className="is-size-3  has-text-white" style={{marginTop: '15px'}}>{country.country_name}</h2>
                      <p className="is-size-5 has-text-white" style={{marginBottom: 0}}>reached the same count as {active_country.country_name} on</p>
                      <table className="table is-narrow ">
                      <thead>
                        <tr>
                          <th colSpan="3" className="is-size-5" style={{padding: 0}}>{format(parse(country.earliest.date, 'MM/dd/yy', new Date()), 'PP')}</th>
                        </tr>
                        <tr>
                          <td></td>
                          <td>Total</td>
                          <td>Per Million</td>
                        </tr>
                      </thead>
                        <tbody>
                          <tr>
                            <th>Confirmed</th>
                            <td>{this.tidyFormat(country.earliest.confirmed)}</td>
                            <td>{country.earliest.confirmed_per_mil ? country.earliest.confirmed_per_mil.toFixed(2): ''}</td>
                            
                          </tr>
                          <tr>
                            <th>Deaths</th>
                            <td>{this.tidyFormat(country.earliest.deaths)}</td>
                            <td>{country.earliest.deaths_per_mil ? country.earliest.deaths_per_mil.toFixed(2): ''}</td>
                          </tr>
                          <tr>
                            <th>Recovered</th>
                            <td>{this.tidyFormat(country.earliest.recovered)}</td>
                            <td>{country.earliest.recovered_per_mil ? country.earliest.recovered_per_mil.toFixed(2): ''}</td>
                            
                          </tr>
                        </tbody>
                      </table>
                        
                      
                      <table className="table is-narrow is-borderless">
                        <thead>
                          <tr>
                            <th colSpan="3" className="is-size-4" style={{paddingBottom: 0}}>Today</th>
                          </tr>
                          <tr>
                            <td></td>
                            <td>Total</td>
                            <td>Per Million</td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <th>Confirmed</th>
                            <td>{this.tidyFormat(country.highest.confirmed)}</td>
                            <td>{country.highest.confirmed_per_mil ? country.highest.confirmed_per_mil.toFixed(2): ''}</td>
                          </tr>
                          <tr>
                            <th>Deaths</th>
                            <td>{this.tidyFormat(country.highest.deaths)}</td>
                            <td>{country.highest.deaths_per_mil ? country.highest.deaths_per_mil.toFixed(2): ''}</td>
                          </tr>
                          <tr>
                            <th>Recovered</th>
                            <td>{this.tidyFormat(country.highest.recovered)}</td>
                            <td>{country.highest.recovered_per_mil ? country.highest.recovered_per_mil.toFixed(2): ''}</td>
                          </tr>
                        </tbody>
                        </table>
                    </div>
                  </div>
                </div>
              ))}                    
            </div>
          </div>
        </section>
        <section className="section  has-background-light footer">
            <div className="container">
              <h2 className="is-size-3">This is a prototype / work in progress</h2>
              <p>COVID daily updated infection data is from the <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank" rel="noopener noreferrer">John Hopkins repo</a></p>
              <p>Ppoulation data sourced from Population data sourced from <a href="https://data.worldbank.org/indicator/SP.POP.TOTL" target="_blank" rel="noopener noreferrer">The World Bank</a></p>
              <h3>Things Next on the list to do:</h3>
              <ul>
                <li>Allow for ranking by deaths as well as confirmed</li>
                <li>Allow for ranking on per mil, as well as absolute</li>
                <li>Make each tile clickable showing growth, and use this countries growth as a projection of the currently selected countries future</li>
              </ul>
              <p>Code available at  <a href="https://github.com/carlaiau/flatten-the-curve" target="_blank" rel="noopener noreferrer">Github</a>. 
                Currently in development by <a href="https://carlaiau.com/">Carl Aiau</a></p>
            </div>
        </section>
      </React.Fragment>
    )
  }
  
}


export const query = graphql`
  query {
    countries: allOutputJson(sort: {order: DESC, fields: highest_confirmed}, filter: {highest_confirmed: {gte: 3}, population: {gte: 3000000}}) {
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
    select_countries: allOutputJson(sort: {order: ASC, fields: country_name}, filter: {highest_confirmed: {gte: 3}, population: {gte: 3000000}}) {
      nodes {
        country_name
        highest_confirmed
      }
    }
  }
  
`
