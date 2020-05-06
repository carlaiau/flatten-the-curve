import React, {useContext} from "react"
import {graphql} from 'gatsby'
import {GlobalStateContext} from "../context/GlobalContextProvider"
import AdvancedCountryPage from "../components/advanced-country-page"
import Layout from "../components/layout"

const AdvancedCountryTemplate = ({data, pageContext}) => {
    const {countries, update_times} = useContext(GlobalStateContext)

    let all = data.all.nodes[0].data
    let cum = data.cum.nodes[0].cum

    if(pageContext.slug == 'united-states'){
        all = data.all.nodes[0].data.map(s => {
            if(s.name == 'United States')
                s.name = "All"
            return s
        })
        cum = data.cum.nodes[0].cum.map(s => {
            if(s.name == 'United States')
                s.name = "All"
            return s
        })
    }


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
            100: confirmed.map((node) => mapFn( node, 'confirmed', 0)),
            250: confirmed.map((node) => mapFn( node, 'confirmed', 1)),
            500:  confirmed.map((node) => mapFn( node, 'confirmed', 2)),
            1000: confirmed.map((node) => mapFn( node, 'confirmed', 3)),
            5000: confirmed.map((node) => mapFn( node, 'confirmed', 4)),
        },
        deaths: {
            10:   deaths.map((node) => mapFn( node, 'deaths', 0)),
            50:   deaths.map((node) => mapFn( node, 'deaths', 1)),
            100:  deaths.map((node) => mapFn( node, 'deaths', 2)),
            250:  deaths.map((node) => mapFn( node, 'deaths', 3)),
            500:  deaths.map((node) => mapFn( node, 'deaths', 4)),
        }
    }




    return (
        <Layout selected_country={pageContext.name}>
            <AdvancedCountryPage 
                countries={countries} 
                all={all} 
                cum={cum_object}
                update_times={update_times}
                country_name={pageContext.name}
                checkedAreas={pageContext.checkedAreas}
                area_label={pageContext.area_label || false}
                show_grid={pageContext.show_grid || false}
                hide_deaths={pageContext.hide_deaths || false}
            />
        </Layout>
    )
}

export default AdvancedCountryTemplate

export const query = graphql`
query($slug: String!){
    all: allAdvancedJson(filter: {slug: {eq: $slug}}){
        nodes{
            data {
                name
                highest_tests
                highest_hospitalized
                highest_deaths
                highest_confirmed
                highest_recovered
                population
                time_series {
                    confirmed
                    confirmed_per_mil
                    date
                    deaths
                    deaths_per_mil
                    tests
                    hospitalized
                    recovered
                }
            }
        }
    }
    cum: allAdvancedJson(filter: {slug: {eq: $slug}}){
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
