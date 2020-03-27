import React, {useContext} from "react"
import {graphql} from 'gatsby'
import {GlobalStateContext} from "../context/GlobalContextProvider"
import AdvancedCountryPage from "../components/advanced-country.page"

const UnitedStatesPage = ({data}) => {
    const {countries} = useContext(GlobalStateContext)

    return <AdvancedCountryPage countries={countries} all={data.all.nodes.map(s => {
        if(s.name == 'United States')
            s.name = "All"
        return s
    })} cum={data.cum.nodes.map(s => {
        if(s.name == 'United States')
            s.name = "All"
        return s
    })}/>
}

export default UnitedStatesPage

export const query = graphql`
query MyQuery {
    all: allUnitedStatesJson {
        nodes {
            name
            highest_tests
            highest_hospitalized
            highest_deaths
            highest_confirmed
            population
            time_series {
                confirmed
                confirmed_per_mil
                date
                deaths
                deaths_per_mil
                hospitalized
                hospitalized_per_mil
                tests
                tests_per_mil
            }
        }
    }
    cum: allUnitedStatesCumJson {
        nodes {
            name
            highest_deaths
            highest_confirmed
            population
            confirmed {
                range
                time_series {
                    confirmed
                    date
                    num_day
                }
            }
            deaths {
                range
                time_series {
                    date
                    deaths
                    num_day
                }
            }
        }
    }
}
  
`

