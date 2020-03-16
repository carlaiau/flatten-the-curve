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
      numberFormat: new Intl.NumberFormat()
		}
  }
  
  tidyFormat(numberString){
    return this.state.numberFormat.format(numberString)
  }
  
  render(){
    const {countries, countries_in_select_box} = this.state
    let active_country = countries.filter( (c) => c.country_name === this.state.selected_country )[0]
    
    
    active_country.time_series.forEach( (time) => {
      if(active_country.highest && time.confirmed > active_country.highest.confirmed)
        active_country.highest = time
      else if(!active_country.highest)
        active_country.highest = time
    })

    const top_thirty = countries.filter(
      country => country.highest_confirmed > active_country.highest_confirmed
    ).slice(0, 30)
    
    top_thirty.forEach( (country) => {
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
                  <h2 className="subtitle is-size-5">A unique way of showing the importance of early protective measures</h2>
                  <div className="field is-grouped is-horizontal">
                    <div className="control">
                      <div className="select">
                        <select value={this.state.selected_country} onChange={e => this.setState({selected_country: e.target.value})}>>
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
                  <p className="is-size-7" style={{marginBottom: '10px'}}>
                    <strong style={{color: '#fff'}}>If your country is not show</strong>: we are filtering for populations over 3 million and at least 3 confirmed cases.
                  </p>
                  <p className="is-size-5">Work in Progress. 
                    Inspired by <a href="https://flattenthecurve.com/" target="_blank" rel="noopener noreferrer">Flattenthecurve.com</a>. 
                    Data from <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank" rel="noopener noreferrer">John Hopkins</a>.
                  </p>
                  
                  
                  <p className="is-size-6">Data last updated: <strong style={{color: 'white'}}>8:58am March 17, 2020 NZT</strong> </p>
                </div>
                <div className="column">
                  <h3 className="is-size-4 title">{this.state.selected_country}'s Current State Today</h3>  
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
                        <td>Confirmed</td>
                        <td>{this.tidyFormat(active_country.highest.confirmed)}</td>
                        <td>{active_country.highest.confirmed_per_mil.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                      <td>Deaths</td>
                        <td>{this.tidyFormat(active_country.highest.deaths)}</td>
                        <td>{active_country.highest.deaths_per_mil ? active_country.highest.deaths_per_mil.toFixed(2): ''}</td>
                      </tr>
                      <tr>
                        <td>Recovered</td>
                        <td>{this.tidyFormat(active_country.highest.recovered)}</td>
                        <td>{active_country.highest.recovered_per_mil ? active_country.highest.recovered_per_mil.toFixed(2): ''}</td>
                      </tr>
                    </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section">
          <div className="container">
            <h3 className="is-size-3 title" style={{marginBottom: 0}}>Top {top_thirty.length} countr{top_thirty.length == 1? 'y': 'ies'} with a higher confirmed case count.</h3>
            <h3 className="is-size-3 title">When did each country last reach a case count similar to {this.state.selected_country}?</h3>
            <div className="columns" style={{flexWrap: 'wrap'}}>
              { top_thirty.map( (country) => (
                <div className="column is-one-third" key={country.country_name}>
                  <div className="box has-background-danger has-text-white">
                    <div className="content" style={{position: 'relative'}}>
                    <p className="is-size-4" style={{marginBottom: 0}}>
                        <strong>
                          {formatDistance(parse(country.earliest.date, 'MM/dd/yy', new Date()), parse('03/15/20', 'MM/dd/yy', new Date()) ) } ago
                        </strong>
                      </p>
                      <h2 className="is-size-3  has-text-white" style={{marginTop: '15px'}}>{country.country_name}</h2>
                      
                      <table className="table is-narrow ">
                      <thead>
                        <tr>
                          <th colspan="3" className="is-size-4">
                            {format(parse(country.earliest.date, 'MM/dd/yy', new Date()), 'PP')}
                          </th>
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
                            <th colspan="3" className="is-size-4">Today</th>
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
