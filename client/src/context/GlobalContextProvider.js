import React from "react"
import  { graphql, useStaticQuery } from 'gatsby'

export const GlobalStateContext = React.createContext()
export const GlobalDispatchContext = React.createContext()


function reducer(){ }

const GlobalContextProvider = ({ children }) => {
    const globalData = useStaticQuery(graphql`query {
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
        cumulative: allCumulativeJson(sort: {order: DESC, fields: highest_confirmed}, filter: {population: {gte: 100000}}) {
            nodes {
              country_name
              highest_confirmed
              population
              confirmed {
                confirmed
                date
                num_day
              }
              deaths {
                num_day
                date
                deaths
              }
            }
          }

        
    }`)
    
    const {countries, select_countries, cumulative } = globalData
    
    const [state, dispatch] = React.useReducer(reducer, {
        countries: countries.nodes,
        select_countries: select_countries.nodes,
        cumulative_confirmed: cumulative.nodes.filter(c => c.confirmed),
        cumulative_deaths: cumulative.nodes.filter(c => c.deaths)
    });
  
  return (
    <GlobalStateContext.Provider value={state}>
        <GlobalDispatchContext.Provider value={dispatch}>
            {children}
        </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  )
}

export default GlobalContextProvider