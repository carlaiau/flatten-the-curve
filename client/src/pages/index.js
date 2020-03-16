import React from "react"
import { graphql} from "gatsby"
import SEO from "../components/seo"
import 'bulma/css/bulma.css'

export default class IndexPage extends React.Component{
  
  constructor(props){
		super(props);
		this.state = {
      countries: props.data.countries.nodes,
      selected_country: 'New Zealand',
      
		}
  }
  
  
  render(){
    const {countries} = this.state
    let active_country = countries.filter( (c) => c.country_name === this.state.selected_country )[0]
    return (
      <React.Fragment>
        <SEO title="Home" />
        <section className="hero is-info is-large">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">
                Flatten the curve
              </h1>
              <h2 className="subtitle">Why social distance is so important while our confirmed cases is low.</h2>
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
              <p className="is-size-4" style={{marginTop: '10px'}}>with {new Intl.NumberFormat().format(active_country.highest_confirmed)} confirmed cases</p>
              <p className="is-size-6">We are only including countries with over 3,000,000 population and 3 or more confirmed cases</p>
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
