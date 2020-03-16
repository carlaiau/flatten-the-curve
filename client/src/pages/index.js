import React from "react"
import { graphql} from "gatsby"
import SEO from "../components/seo"
import 'bulma/css/bulma.css'

export default class IndexPage extends React.Component{
  
  constructor(props){
		super(props);
		this.state = {
      countries: props.data.countries.nodes.slice(1),
      selected_country: 'New Zealand',
      numberFormat: new Intl.NumberFormat()
		}
  }
  
  tidyFormat(numberString){
    return this.state.numberFormat.format(numberString)
  }
  
  render(){
    const {countries} = this.state
    let active_country = countries.filter( (c) => c.country_name === this.state.selected_country )[0]
    
    
    active_country.time_series.forEach( (time) => {
      if(active_country.highest && time.confirmed > active_country.highest.confirmed)
        active_country.highest = time
      else if(!active_country.highest)
        active_country.highest = time
    })

    const top_nine = countries

    top_nine.forEach( (country) => {
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
                    Flatten the curve of COVID-19 Spread
                  </h1>
                  <h2 className="subtitle">Why social distance is important</h2>
                  <div className="field is-grouped is-horizontal">
                    <div className="control">
                      <div className="select is-large">
                        <select value={this.state.selected_country} onChange={e => this.setState({selected_country: e.target.value})}>>
                          <option>Choose Your country</option> 
                          {countries.map( ({country_name }) => (
                            <option key={country_name} value={country_name}>{country_name}</option>
                          ))}
                        </select>
                      </div>
                      
                    </div>
                    <div className="control">
                      <button className="button is-large is-success">Go</button>
                    </div>
                  </div>
                </div>
                <div className="column">
                    <p className="is-size-3"><strong>{this.tidyFormat(active_country.highest.confirmed)}</strong> Confirmed Cases<br/>
                    <strong>{this.tidyFormat(active_country.highest.deaths)}</strong> deaths and<br/>
                    <strong>{this.tidyFormat(active_country.highest.recovered)}</strong> recoveries</p>
                  </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section">
          <div className="container is-widescreen">
            <div className="columns" style={{flexWrap: 'wrap'}}>
              { top_nine.map( (country) => (
                <div className="column is-one-third" key={country.country_name}>
                  <div className="box has-background-danger has-text-white">
                    <div className="content" >
                      <h2 className="title has-text-white">{country.country_name}</h2>
                      <p className="is-size-4">On {country.earliest.date} {country.country_name} had</p>
                      <p className="is-size-5">
                        <strong>{this.tidyFormat(country.earliest.confirmed)}</strong> confirmed cases<br/>
                        <strong>{this.tidyFormat(country.earliest.deaths)}</strong> deaths and <br/>
                        <strong>{this.tidyFormat(country.earliest.recovered)}</strong> recoveries
                      </p>
                      <p className="is-size-4">Today {country.country_name} has</p>
                      <p className="is-size-5">
                        <strong>{this.tidyFormat(country.highest.confirmed)}</strong> confirmed cases<br/>
                        <strong>{this.tidyFormat(country.highest.deaths)}</strong> deaths and <br/>
                        <strong>{this.tidyFormat(country.highest.recovered)}</strong> recoveries
                      </p>
                    </div>
                  </div>
                </div>
              ))}                    
            </div>
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
  }
`
