import React from "react"
import SEO from "../components/seo"
import Hero from "../components/hero"
import { navigate } from "@reach/router"
import 'bulma/css/bulma.css'
import '../styles/custom.css'


// Need to actually make it dynamically determine the date

export default class IndexPage extends React.Component{
  
  constructor(props){
		super(props);
		this.state = {
      countries: props.data.countries.nodes,
      select_countries: props.data.select_countries.nodes
    }
  }

  heroSelectFn = (e) =>  {
    if(e.target.value) 
      navigate(`/${e.target.value.toLowerCase().replace(/\s+/g, "-")}`)
  }

  

  
  render(){

    return (
      <React.Fragment>
        <SEO title="COVID-19" />
        <Hero countries={this.state.select_countries} selected_country='' selectFn={this.heroSelectFn}/>
        <p>yo!</p>
      </React.Fragment>
    )
  }  
}


export const query = graphql`
  query {
    countries: allCountriesJson(sort: {order: DESC, fields: highest_confirmed}, filter: {highest_confirmed: {gte: 10}, population: {gte: 1000000}}) {
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
    select_countries: allCountriesJson(sort: {order: ASC, fields: country_name}, filter: {highest_confirmed: {gte: 10}, population: {gte: 1000000}}) {
      nodes {
        country_name
        highest_confirmed
      }
    }
  }
  
`