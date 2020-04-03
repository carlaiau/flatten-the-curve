import React from "react"
import  { graphql, useStaticQuery } from 'gatsby'

const NZRegionalTable = () => {
    const nzData = useStaticQuery(graphql`query {
        newZealand: allNzAdvancedJson {
            nodes {
              name
              time_series {
                total
                probable
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
                total
                probable
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
    let total = 0
    regions.forEach(element => {
      if(element.name != "All")
        total += element.highest.total
    });
    console.log(total)
    
    return (
        <div className="container">
          <div className="columns">
            <div className="column is-narrow">
                <div className="box has-background-success">
                    <h3 className="is-size-3 has-text-white title">
                        Current Case Details
                    </h3>
                    <p className="is-size-5 subtitle has-text-white">
                        Based on Ministry of Health Data. This is occasionally inconsistent with main data
                    </p>
                </div>
            </div>
          </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Region</th>
                        <th>Confirmed</th>
                        <th>Probable</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                {
                  regions.map( region => (
                          <tr>
                              <td>{region.name}</td>
                              <td>{region.highest.confirmed}</td>
                              <td>{region.highest.probable}</td>
                              <td>{region.highest.total}</td>
                          </tr>
                  ))
                }
                </tbody>
                
            </table>

        </div>
    )
}

export default NZRegionalTable