import React from "react"
import  { graphql, useStaticQuery } from 'gatsby'

export const GlobalStateContext = React.createContext()
export const GlobalDispatchContext = React.createContext()


function reducer(state, action) {
    switch (action.type) {
      case "TOGGLE_THEME": {
        return {
          ...state,
          theme: state.theme === "light" ? "dark" : "light",
        }
      }
      default:
        throw new Error("Bad Action Type")
    }
  }

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
    }`)
    
    
    const [state, dispatch] = React.useReducer(reducer, {
        countries: globalData.countries.nodes,
        select_countries: globalData.select_countries.nodes
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