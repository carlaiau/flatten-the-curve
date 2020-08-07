import React from "react"
import { graphql, useStaticQuery } from 'gatsby'

export const GlobalStateContext = React.createContext()
export const GlobalDispatchContext = React.createContext()


function reducer() { }

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
                    recovered
                    tests
                }
                highest_confirmed
                highest_deaths
                highest_recovered

                population
            }
        }
        select_countries: allCountriesJson(sort: {order: ASC, fields: name}, filter: {highest_confirmed: {gte: 10}, population: {gte: 1000000}}) {
            nodes {
                name
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

  const { countries, select_countries, cumulative } = globalData
  const confirmed = cumulative.nodes.filter(c => c.confirmed)
  const deaths = cumulative.nodes.filter(c => c.deaths)


  const mapFn = (node, field, index) => {
    if (node[field][index].time_series.length) {
      return {
        name: node.name,
        time_series: node[field][index].time_series,
      }
    }
    return false
  }

  const [state, dispatch] = React.useReducer(reducer, {
    countries: countries.nodes,
    select_countries: select_countries.nodes,
    cumulative_confirmed: {
      1000: confirmed.map((node) => mapFn(node, 'confirmed', 0)),
      5000: confirmed.map((node) => mapFn(node, 'confirmed', 1)),
      10000: confirmed.map((node) => mapFn(node, 'confirmed', 2)),
      50000: confirmed.map((node) => mapFn(node, 'confirmed', 3)),
      100000: confirmed.map((node) => mapFn(node, 'confirmed', 4)),

    },
    cumulative_deaths: {
      100: deaths.map((node) => mapFn(node, 'deaths', 0)),
      500: deaths.map((node) => mapFn(node, 'deaths', 1)),
      1000: deaths.map((node) => mapFn(node, 'deaths', 2)),
      5000: deaths.map((node) => mapFn(node, 'deaths', 3)),
      10000: deaths.map((node) => mapFn(node, 'deaths', 4)),
    },
    update_times: {
      global: "12:00am 06 August UTC",
      us: "4:00pm 06 August ET"
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