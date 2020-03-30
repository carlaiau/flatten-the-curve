import React, {useContext} from "react"
import {graphql} from 'gatsby'
import {GlobalStateContext} from "../context/GlobalContextProvider"
import AdvancedCountryPage from "../components/advanced-country.page"

const CanadaPage = ({data}) => {
    const {countries, update_times} = useContext(GlobalStateContext)

    const all = data.all.nodes[0].data
 
    const cum = data.cum.nodes[0].cum

    const confirmed = cum.filter(c => c.confirmed)
    const deaths = cum.filter(c => c.deaths)


    const mapFn = (node, field, index) => {
        if(node[field][index].time_series.length){
          return {
            name : node.name,
            time_series: node[field][index].time_series,
          }
        }
        return false
      }

    const cum_object = {
        confirmed: {
            50:  confirmed.map((node) => mapFn( node, 'confirmed', 0)),
            100: confirmed.map((node) => mapFn( node, 'confirmed', 1)),
            200: confirmed.map((node) => mapFn( node, 'confirmed', 2)),
            300: confirmed.map((node) => mapFn( node, 'confirmed', 3)),
            400: confirmed.map((node) => mapFn( node, 'confirmed', 4)),
            500:  confirmed.map((node) => mapFn( node, 'confirmed', 5)),
            750:  confirmed.map((node) => mapFn( node, 'confirmed', 6)),
            1000: confirmed.map((node) => mapFn( node, 'confirmed', 7)),
        },
        deaths: {
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
        }
    }




    return <AdvancedCountryPage countries={countries} 
        all={all} 
        cum={cum_object}
        update_times={update_times}
        country_name={"Canada"}
        checkedAreas={['Ontario', 'Saskatchewan', 'Quebec', 'British Columbia']}
    />
}

export default CanadaPage

export const query = graphql`
query{
    all: allAdvancedJson(filter: {slug: {eq: "canada"}}){
        nodes{
            data {
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
                }
            }
        }
    }
    cum: allAdvancedJson(filter: {slug: {eq: "canada"}}){
        nodes{
            cum {
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
}
  
`

