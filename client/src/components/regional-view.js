import React from "react"
import  { graphql, useStaticQuery } from 'gatsby'

import EnhancedTable from './enhanced-table/enhanced-table'
import RegionalAreaGraph from './regional-area-graph'
import RegionalBarGraph from './regional-bar-graph'
import SetupNZTable from '../utils/setup-nz-table'

const RegionalView = ({width, height}) => {
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
    
    const {rows, headCells} = SetupNZTable(regions)

    const [activeRegion, setActiveRegion] = React.useState('All');
    const [scale, setScale] = React.useState('linear');
    const [type, setType] = React.useState('value');
    return (
      <section className="section" style={{marginBottom: '50px'}}>
        <div className="container">
          <div className="columns">
            <div className="column is-one-third">
              <div className="box has-background-success">
                  <h3 className="is-size-3 has-text-white title">
                      Current Cases by DHB
                  </h3>
                  <p className="is-size-5 subtitle has-text-white">
                    Total includes confirmed and probable.
                  </p>
                  <p className="is-size-7 has-text-white">
                    Using Ministry of Health Current Case data found 
                    {' '}<a
                      href="https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases/covid-19-current-cases-details"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <strong className="has-text-white">
                        here
                      </strong>
                    </a>. The dates for all graphing is based on when they cases are reported not when they're announced.

                  </p>
              </div>
              <EnhancedTable 
                rows={rows} 
                headCells={headCells} 
                pageTemplate="nz" 
                selected={activeRegion}
                selectFn={setActiveRegion}
                tidy={new Intl.NumberFormat()}
              />
            </div>
            <div className="column is-two-thirds">
              <div className="field is-horizontal" style={{width: "100%", justifyContent: 'space-between'}}>
                <div className="control">
                  <p className="title is-size-4 has-text-centered">
                    Cases versus time {activeRegion == 'All' ? 'nationwide' : 'in ' + activeRegion + ' DHB'} 
                  </p>
                </div>
                <div className="control">
                  <div className="select">
                    <select value={scale} onChange={e => setScale(e.target.value)}>
                      <option value="linear">Linear</option>
                      <option value="log">Log</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <RegionalAreaGraph
                active_region={regions.filter(r => r.name == activeRegion)[0]}
                width={width}
                height={height}
                scale={scale}
              />

              <div className="field is-horizontal" style={{width: "100%", justifyContent: 'space-between', marginTop: '50px'}}>
                <div className="control">
                  <p className="title is-size-4" >
                    Cases versus age group {activeRegion == 'All' ? 'nationwide' : 'in ' + activeRegion + ' DHB'} 
                  </p>
                </div>
                <div className="control">
                  <div className="select">
                    <select value={type} onChange={e => setType(e.target.value)}>
                      <option value="value">Value</option>
                      <option value="percent">Percentage</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <RegionalBarGraph
                active_region={regions.filter(r => r.name == activeRegion)[0]}
                width={width}
                height={height}
                type={type}
              />
            </div>
          </div>
        </div>
      </section>
    )
}

export default RegionalView