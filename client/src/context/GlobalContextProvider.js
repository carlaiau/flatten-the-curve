import React from "react"
import  { graphql, useStaticQuery } from 'gatsby'

export const GlobalStateContext = React.createContext()
export const GlobalDispatchContext = React.createContext()


function reducer(){ }

const GlobalContextProvider = ({ children }) => {
    const globalData = useStaticQuery(graphql`query {
        countries: allCountriesJson(sort: {order: DESC, fields: highest_confirmed}, filter: {highest_confirmed: {gte: 10}, population: {gte: 1000000}}) {
            nodes {
                name
                id
                time_series {
                    date
                    confirmed
                    confirmed_per_mil
                    deaths
                    deaths_per_mil
                }
                highest_confirmed
                highest_deaths

                population
            }
        }
        select_countries: allCountriesJson(sort: {order: ASC, fields: name}, filter: {highest_confirmed: {gte: 10}, population: {gte: 1000000}}) {
            nodes {
                name
                highest_confirmed
            }
        }
        cumulative: allCumulativeJson(sort: {order: DESC, fields: highest_confirmed}, filter: {population: {gte: 100000}}) {
          nodes {
            name
            highest_confirmed
            population
            confirmed {
              range
              time_series {
                date
                num_day
                confirmed
              }
            }
            deaths {
              range
              time_series {
                date
                num_day
                deaths
              }
            }
          }
        }
    }`)
    
    const {countries, select_countries, cumulative } = globalData
    const confirmed = cumulative.nodes.filter(c => c.confirmed)
    const deaths = cumulative.nodes.filter(c => c.deaths)


    const mapFn = (node, field, index) => {
      if(node[field][index].time_series.length){
        return {
          name : node.name,
          time_series: node[field][index].time_series,
        }
      }
      return false
    }
    
    const [state, dispatch] = React.useReducer(reducer, {
        countries: countries.nodes,
        select_countries: select_countries.nodes,
        cumulative_confirmed: {
          50:  confirmed.map((node) => mapFn( node, 'confirmed', 0)),
          100: confirmed.map((node) => mapFn( node, 'confirmed', 1)),
          200: confirmed.map((node) => mapFn( node, 'confirmed', 2)),
          300: confirmed.map((node) => mapFn( node, 'confirmed', 3)),
          400: confirmed.map((node) => mapFn( node, 'confirmed', 4)),
          500:  confirmed.map((node) => mapFn( node, 'confirmed', 5)),
          750:  confirmed.map((node) => mapFn( node, 'confirmed', 6)),
          1000: confirmed.map((node) => mapFn( node, 'confirmed', 7)),

        },
        cumulative_deaths: {
          10:   deaths.map((node) => mapFn( node, 'deaths', 0)),
          20:   deaths.map((node) => mapFn( node, 'deaths', 1)),
          30:   deaths.map((node) => mapFn( node, 'deaths', 2)),
          40:   deaths.map((node) => mapFn( node, 'deaths', 3)),
          50:   deaths.map((node) => mapFn( node, 'deaths', 4)),
          75:   deaths.map((node) => mapFn( node, 'deaths', 5)),
          100:  deaths.map((node) => mapFn( node, 'deaths', 6)),
          200:  deaths.map((node) => mapFn( node, 'deaths', 7)),
          300:  deaths.map((node) => mapFn( node, 'deaths', 8)),
          400:  deaths.map((node) => mapFn( node, 'deaths', 9)),
          500:  deaths.map((node) => mapFn( node, 'deaths', 10)),
        },
        update_times:{
          global: "12:04am 28 March UTC",
          us: "4:00pm 28 March ET",
          nz: "1:03pm 28 March NZT",
        }
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