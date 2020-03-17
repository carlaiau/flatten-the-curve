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
      countries_in_select_box: props.data.select_countries.nodes,
      selected_country: 'New Zealand',
      numberFormat: new Intl.NumberFormat(),
      field: 'confirmed',
      per: 'total',
      limit: 60,
		}
      modalOpen: false,
      active_country: null,
      comparable_country: null,
    }

  tidyFormat(numberString){
    return this.state.numberFormat.format(numberString)
  }
  
  render(){
    const {selected_country, countries_in_select_box, countries, field, per, limit} = this.state

    let full_field_name = field == 'confirmed' ? 
      (per == 'total' ? 'confirmed' : 'confirmed_per_mil') :
      (per == 'total') ? 'deaths' : 'deaths_per_mil'

    let active_country = countries.filter( (c) => c.country_name === this.state.selected_country )[0]
    
    active_country.time_series.forEach( (time) => {
      if(active_country.highest && time[full_field_name] > active_country.highest[full_field_name])
        active_country.highest = time
      else if(!active_country.highest)
        active_country.highest = time
    })
    
    countries.forEach( (country) => {
      let earliest = {}
      let highest = {}
      country.time_series.forEach( (time) => {
        if(earliest[full_field_name]){
          if(time[full_field_name] < earliest[full_field_name] && ( time[full_field_name] >= active_country.highest[full_field_name]) )  
            earliest = time
        }
        else if(!earliest[full_field_name] && time[full_field_name] >= active_country.highest[full_field_name])
          earliest = time
        
        if(highest[full_field_name] && time[full_field_name] > highest[full_field_name])
          highest = time
        else if(!highest[full_field_name])
          highest = time
      })
      country.earliest = earliest
      country.highest = highest
    })

    


    
    //sort
    countries.sort((a, b) => (a.highest[full_field_name] < b.highest[full_field_name]) ? 1 : -1)


    // Then choose top
    top_countries = countries.filter(
      c => c.highest[full_field_name] > active_country.highest[full_field_name]
    ).slice(0, this.state.limit)
    
    
    const Modal = () => {
      if(this.state.modalOpen){
        return (
          <div className='modal is-active'>
            <div className="modal-background"></div>
            <div className="modal-card">
              <header className="modal-card-head">
                <p className="modal-card-title">{this.state.comparable_country.country_name}</p>
                <button className="delete" aria-label="close" onClick={e => this.setState({modalOpen: false})}></button>
              </header>
              <section className="modal-card-body">
                <table>
                  <tbody>
                    <tr>
                      <th>Date</th>
                      <th>Confirmed</th>
                    </tr>
                    {this.state.comparable_country.time_series.map( time => {
                      console.log(time)
                      return (
                        <tr>
                          <td>

                          </td>
                          <td>

                          </td>
                        </tr>

                      )
                    })}
                  </tbody>
                </table>
              </section>
              <footer className="modal-card-foot">
                <button className="button" onClick={e => this.setState({modalOpen: false})}>Cancel</button>
              </footer>
            </div>
          </div>
        )
      }
      return <React.Fragment></React.Fragment>
    }

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
                          <select value={selected_country} onChange={e => this.setState({selected_country: e.target.value})}>
                            {countries_in_select_box.map( ({country_name, highest_confirmed }) => (
                              <option key={country_name} value={country_name}>{country_name}:     {this.tidyFormat(highest_confirmed)}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="control">
                        <button className="button is-success">Go</button>
                      </div>
                    </div>
                    <p className="is-size-7">
                      Please note: If your country is not showing we are filtering for populations over 3 million and at least 10 confirmed cases.
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
                  <p className="is-size-6">
                    This is a work in Progress. Code is freely available on <a href="https://github.com/carlaiau/flatten-the-curve"  target="_blank" rel="noopener noreferrer">
                      GitHub</a> and pull requests are welcome.
                  </p>
                  <p className="is-size-6">
                    Inspired by <a href="https://flattenthecurve.com/" target="_blank" rel="noopener noreferrer">Flattenthecurve.com</a>. 
                    Please visit this site for actionable steps to slow the spread.
                  </p>
                  <p className="is-size-6">
                    COVID-19 Data belongs to <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank" rel="noopener noreferrer">Johns Hopkins University</a> 
                    {} and was last updated at 8:29pm Mar, 17 2020 NZT.
                    </p>
                </div>
            </div>

            <div className="columns">
              <div className="column title-with-inputs">
                <p className="is-size-5">
                  Showing The {this.top.length} Countr{this.top.length == 1? 'y': 'ies'} Ranked Higher Than {active_country.country_name} by
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
              </div>
            </div>
            <div className="columns">
              <div className="column">
                <p className="is-size-6" style={{marginBottom: '10px'}}>
                  We want to show when these countries were at a similar level to {active_country.country_name} and how their situation has progressed since then.
                </p>
                <p className="is-size-6">
                  Each countries progression can be used as a potential forecast for {active_country.country_name}'s future.
                </p>

              </div>
            </div>
            <div className="columns" style={{flexWrap: 'wrap'}}>
              { this.state.top_countries.map( (country) => (
                <div className="column is-one-third" key={country.country_name}>
                  <div className="box has-background-danger has-text-white country">
                    <div className="content" style={{position: 'relative'}}>
                        <strong className="has-text-white" style={{position: 'absolute', top: 0, right: 0}}>
                          {formatDistance(parse(country.earliest.date, 'MM/dd/yy', new Date()), parse('03/16/20', 'MM/dd/yy', new Date()) ) } ago
                        </strong>
                      <h2 className="is-size-3  has-text-white" style={{paddingTop: '25px', marginTop: 0}}>{country.country_name}</h2>
                      <p className="is-size-6 has-text-white">
                        Reached {active_country.country_name}'s {this.state.per == 'total' ? ' Total': 'Per Million'} {this.state.field == 'deaths'? 'Deaths': 'Confirmed Cases'} on 
                        { } {format(parse(country.earliest.date, 'MM/dd/yy', new Date()), 'PP')}
                      </p>
                      <table className="table is-narrow ">
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
                        
                      <p></p>
                      <table className="table is-narrow is-borderless">
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
                      <button className='button' onClick={e => this.setState({
                        modalOpen: true,
                        active_country,
                        comparable_country: country
                      })}>
                        View {country.country_name}'s Progression</button>
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
        <Modal/>
      </React.Fragment>
    )
  }
  
}


export const query = graphql`
  query {
    countries: allOutputJson(sort: {order: DESC, fields: highest_confirmed}, filter: {highest_confirmed: {gte: 10}, population: {gte: 3000000}}) {
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
    select_countries: allOutputJson(sort: {order: ASC, fields: country_name}, filter: {highest_confirmed: {gte: 10}, population: {gte: 3000000}}) {
      nodes {
        country_name
        highest_confirmed
      }
    }
  }
  
`
