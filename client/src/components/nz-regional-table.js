import React from "react"
import  { graphql, useStaticQuery } from 'gatsby'

const NZRegionalTable = () => {
    const nzData = useStaticQuery(graphql`query {
        newZealand: allNzAdvancedJson {
            nodes {
              name
              time_series {
                confirmed
                dateForSort
                dateObject
                ages {
                  _1
                  _10_to_14
                  _15_to_19
                  _1_to_4
                  _20_to_29
                  _30_to_39
                  _40_to_49
                  _50_to_59
                  _5_to_9
                  _60_to_69
                  _70_
                }
                genders {
                  Female
                  Male
                  Undefined
                }
              }
              highest {
                confirmed
                dateForSort
                dateObject
                genders {
                  Female
                  Male
                  Undefined
                }
                ages {
                  _1
                  _10_to_14
                  _15_to_19
                  _20_to_29
                  _1_to_4
                  _30_to_39
                  _40_to_49
                  _50_to_59
                  _60_to_69
                  _5_to_9
                  _70_
                }
              }
            }
          }
    }`)

    const regions = nzData.newZealand.nodes
    console.log(regions)
    let total_overall = 0
    let total_change = 0
    return (
        <div className="container">
            <p className="is-size-6">
                Work in progress. 24 hour change is based on report date, not when MoH announces. Ergh
            </p>
            <table className="table">
                <thead>
                    <tr>
                        <th>Region</th>
                        <th>Confirmed</th>
                        <th>24 Hour Change</th>
                        <th>70+</th>
                        <th>60 to 69</th>
                        <th>50 to 59</th>
                        <th>40 to 49</th>
                        <th>20 to 39</th>
                        <th>10 to 19</th>
                        <th>9 -</th>
                    </tr>
                </thead>
                {
                
                
                regions.map( region => {
                    total_overall += region.highest.confirmed
                    total_change += region.time_series.length > 1 ? region.highest.confirmed - region.time_series[region.time_series.length - 2].confirmed : 0
                    return (
                        <tr>
                            <td>{region.name}</td>
                            <td>{region.highest.confirmed}</td>
                            <td>{region.time_series.length > 1 ? region.highest.confirmed - region.time_series[region.time_series.length - 2].confirmed : 0}</td>
                            <td>{region.highest.ages['_70_'] || 0}</td>
                            <td>{region.highest.ages['_60_to_69'] || 0}</td>
                            <td>{region.highest.ages['_50_to_59'] || 0}</td>
                            <td>{region.highest.ages['_40_to_49'] || 0}</td>
                            <td>{region.highest.ages['_20_to_29'] + region.highest.ages['_30_to_39']|| 0}</td>
                            <td>{region.highest.ages['_1'] + region.highest.ages['_1_4'] + region.highest.ages['_5_to_9']|| 0}</td>
                            <td>{region.highest.ages['_10_to_14'] + region.highest.ages['_15_to_19'] || 0}</td>
                        </tr>
                    )

                })}
                <tr>
                    <td>Overall Totals</td>
                    <td>{total_overall}</td>
                    <td>{total_change}</td>
                </tr>
            </table>

        </div>
    )
}

export default NZRegionalTable