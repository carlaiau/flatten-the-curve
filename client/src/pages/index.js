import React from "react"
import { graphql} from "gatsby"
import SEO from "../components/seo"
import 'bulma/css/bulma.css'
import '../styles/custom.css'
import { format, parse, formatDistance } from "date-fns"

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
      limit: 60,
      modalOpen: false,
      active_country: null,
      comparable_country: null,
      active_tab: 'about'
    }
  }

  tidyFormat(numberString){
    return this.state.numberFormat.format(numberString)
  }
  
  render(){
    const {selected_country, countries_in_select_box, countries, field, per, limit} = this.state

    let full_field_name = field === 'confirmed' ? 
      (per === 'total' ? 'confirmed' : 'confirmed_per_mil') :
      (per === 'total') ? 'deaths' : 'deaths_per_mil'

    console.log(countries)
    let active_country = countries.filter( (c) => c.country_name ===  this.state.selected_country )[0]
    
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

    
    const the_latest_date = active_country.highest

    


    
    //sort
    countries.sort((a, b) => (a.highest[full_field_name] < b.highest[full_field_name]) ? 1 : -1)


    // Then choose top
    const top = countries.filter(
      c => c.highest[full_field_name] > active_country.highest[full_field_name]
    ).slice(0, limit)
    
    /* the Modal component */
    const Modal = () => {
      if(this.state.modalOpen){

        // Remember you can do some logic up here
        const time_series = this.state.comparable_country.time_series.filter( time => time.confirmed_per_mil > active_country.highest.confirmed_per_mil )

        const deltas = [] 
        let previous_confirmed = 0
        let previous_deaths = 0
        
        
        time_series.forEach( (time, i) => {
          if(i === 0){
            previous_confirmed = time.confirmed_per_mil
            previous_deaths = time.deaths_per_mil  
          }
          else{
            deltas.push({
              index: i,
              confirmed: ( time.confirmed_per_mil - previous_confirmed ) / previous_confirmed,
              deaths: ( time.deaths_per_mil - previous_deaths ) / previous_deaths,
              death_ratio: time.deaths / time.confirmed
            })
            previous_confirmed = time.confirmed_per_mil
            previous_deaths = time.deaths_per_mil
          }
        })


        const forecast = [
          {
            day: 0,
            confirmed: active_country.highest.confirmed,
            deaths: active_country.highest.deaths
          }
        ]

        deltas.forEach( (delta, day) => {
          if(day === 0){
            previous_confirmed = forecast[0].confirmed
            previous_deaths = forecast[0].deaths
          }
          else{
            const confirmed = previous_confirmed * (1 + delta.confirmed)
            let deaths = 0
            if(! previous_deaths){ // If death doesn't exist yet, trigger at this point
              const projected_deaths = delta.death_ratio * previous_confirmed
              if(projected_deaths > 0) 
                deaths = projected_deaths
            }
            else 
              deaths = previous_deaths * (1 + delta.deaths)
            
            forecast.push({day, confirmed: confirmed.toFixed(0), deaths: deaths.toFixed(0) })
            previous_confirmed = confirmed
            previous_deaths = deaths
            
          }
        })


        

        




        
        return (
          <div className='modal is-active'>
            <div className="modal-background" onClick={e => this.setState({modalOpen: false})}></div>
            <div className="modal-card ">
              <header className="modal-card-head has-background-success">
                <p className="modal-card-title is-size-4 "><strong className="has-text-white">Forecast for {active_country.country_name}</strong></p>
                <button className="delete has-background-dark" aria-label="close" onClick={e => this.setState({modalOpen: false})}></button>
              </header>
              <section className={`modal-card-body has-background-light has-text-dark ${forecast.length == 1 ? 'is-hidden': ''}`}>
                <h2 className="is-size-4" style={{marginBottom: '10px'}}>Based on {this.state.comparable_country.country_name} Progression</h2>
                <p className="is-size-6" style={{marginBottom: '10px'}}>Forecasted next {time_series.length - 2} days for {active_country.country_name}.</p>
                <p className="is-size-7" style={{marginBottom: '10px'}}>*Description of forecast below table</p>
                <table className="table  is-striped is-fullwidth" style={{marginTop: '10px'}}>
                  <tbody>
                    <tr>
                      <th>Days</th>
                      <th>Confirmed</th>
                      <th>Deaths</th>
                    </tr>
                    {
                      forecast.map( (time, i) => (
                        <tr key={i}>
                          <td>{i}</td>
                          <td>{this.tidyFormat(time.confirmed)}</td>
                          <td>{time.deaths ? this.tidyFormat(time.deaths): 0}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <p className="is-size-7" style={{marginBottom: '10px'}}>This is calculated using the daily growth of confirmed cases and deaths on a per million basis in {this.state.comparable_country.country_name} {}
                since {this.state.comparable_country.country_name} reached the same confirmed case count as {active_country.country_name}.</p>
                <p className="is-size-7" style={{marginBottom: '10px'}}>
                  If {active_country.country_name} currently has 0 deaths, we use the {this.state.comparable_country.country_name} ratio of confirmed cases to deaths to forecast when {active_country.country_name} will encounter it's first death. 
                  Once the forecasted deaths are above 1 the projected death rate grows based on the growth of the {this.state.comparable_country.country_name} observed death rate.</p>
                <p className="is-size-7" style={{marginBottom: '10px'}}>
                  This forecast is not meant to reflective of {active_country.country_name}'s future, merely an indication of what is possible.
                  If there are flaws with this naive approach please reach out to us so we can ensure it is done correctly.
                </p>
                <h2 className="is-size-4" style={{marginBottom: '10px', marginTop: '30px'}}>COVID-19 Progression in {this.state.comparable_country.country_name}</h2>
                <p className="is-size-6" style={{marginBottom: '10px'}}>Previous {time_series.length - 1} days of data from {this.state.comparable_country.country_name}.</p>
                <table className="table is-striped is-fullwidth">
                  <thead> 
                    <tr>
                      <th></th>
                      
                      <th colSpan="2" className="is-size-7">Per Million</th>
                      <th colSpan="2" className="is-size-7">Daily Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="is-size-7">Days Ago</td>
                      
                      <td className="is-size-7">Confirmed</td>
                      <td className="is-size-7">Deaths</td>
                      <td className="is-size-7">Confirmed</td>
                      <td className="is-size-7">Deaths</td>
                    </tr>
                    {
                      time_series.map( (time, i) => (
                        <tr key={i}>
                          <td className="is-size-7">{time_series.length - (i + 1) }</td>
                          <td className="is-size-7">{time.confirmed_per_mil.toFixed(2)}</td>
                          <td className="is-size-7">{time.deaths_per_mil ? time.deaths_per_mil.toFixed(2): 0}</td>
                          <td className="is-size-7">{i !== 0 && deltas[i - 1] && deltas[i - 1].confirmed ? (deltas[i -1].confirmed * 100).toFixed(2) : 0}%</td>
                          <td className="is-size-7">{i !== 0 && deltas[i - 1] && deltas[i - 1].deaths ? deltas[i - 1].deaths === Infinity ? '--' : (deltas[i - 1].deaths * 100).toFixed(2): 0}%</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </section>
              
              <footer className="modal-card-foot has-background-success is-hidden-mobile">
                <button className="button is-dark" onClick={e => this.setState({modalOpen: false})}>Back to Results</button>
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
                  <div className="field">
                      <label className="label has-text-white">Choose your country</label>
                      <div className="control">
                        <div className="select is-medium">
                          <select value={selected_country} onChange={e => this.setState({selected_country: e.target.value})}>
                            {countries_in_select_box.map( ({country_name, highest_confirmed }) => (
                              <option key={country_name} value={country_name}>{country_name}</option>
                            ))}
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
            <div className="columns info">
              <div className="column is-narrow">
                <div className="box has-background-success">
                  <h3 className="is-size-4 title has-text-white">{this.state.selected_country} Now</h3>  
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
                <div className="box">
                    <div className="tabs">
                      <ul>
                        <li className={this.state.active_tab =='about' ? 'is-active' : ''}>
                          <a onClick={(e)=> this.setState({active_tab: 'about'})}>About</a>
                        </li>
                        <li className={this.state.active_tab =='forecast' ? 'is-active' : ''}>
                        <a onClick={(e)=> this.setState({active_tab: 'forecast'})}>Potential Forecast Notes</a>
                        </li>
                      </ul>
                    </div>
                    <div className={this.state.active_tab =='about' ? '' : 'is-hidden'}>
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
                        {} and was last updated at 3:28pm Mar, 18 2020 NZT.
                        </p>
                      <p className="is-size-6">
                        If your country is not in the dropdown we are filtering out countries below 3 million population and less than 5 confirmed cases. 
                        If your country is not shown but should be, please contact us!
                      </p>
                    </div>
                    <div className={this.state.active_tab =='forecast' ? '' : 'is-hidden'}>
                      <p className="is-size-6">
                        The potential forecast does not take into account the relative doubling time of each country
                      </p>
                      <p className="is-size-6">
                        The true forecast depends on a multitidue of factors such as: The number and speed of tests done, 
                        the quality of the case tracking, the testing of tracked cases, and the support for people who need to go into isolation.
                      </p>
                      <p className="is-size-6">
                        This sites goal is to motivate people to take actionable steps by showing them where countries have ended up from a situation
                        that was the same as {active_country.country_name} 
                      </p>
                    </div>
                  </div>  
                </div>
              </div>

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
                </div>
                
              </div>              
            </div>

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
                      <table className="t able is-narrow ">


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
                      <button className={`button ${country.highest.confirmed_per_mil > active_country.highest.confirmed_per_mil ? 'is-dark'  : 'has-background-success is-size-7'} has-text-white`} 
                        onClick={e => {
                          if(country.highest.confirmed_per_mil > active_country.highest.confirmed_per_mil){
                            return this.setState({
                              modalOpen: country.highest.confirmed_per_mil > active_country.highest.confirmed_per_mil ? true: false,
                              active_country,
                              comparable_country: country
                            })
                          }}
                        }
                        style={{width: '100%', maxWidth: '100%', height: '40px', border: 'none'}}
                      >
                        {country.highest.confirmed_per_mil > active_country.highest.confirmed_per_mil ?
                          'View Forecast and  Progression'  :
                          'Insufficient confirmed cases per million for forecast'
                        }
                      </button>
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
        <Modal/>
      </React.Fragment>
    )
  }
  
}


export const query = graphql`
  query {
    countries: allOutputJson(sort: {order: DESC, fields: highest_confirmed}, filter: {highest_confirmed: {gte: 5}, population: {gte: 3000000}}) {
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
    select_countries: allOutputJson(sort: {order: ASC, fields: country_name}, filter: {highest_confirmed: {gte: 5}, population: {gte: 3000000}}) {
      nodes {
        country_name
        highest_confirmed
      }
    }
  }
  
`
