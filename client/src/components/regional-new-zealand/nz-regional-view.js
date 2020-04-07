import React from "react"
import  { graphql, useStaticQuery } from 'gatsby'
import styled from '@emotion/styled'

import EnhancedTable from '../enhanced-table/enhanced-table'
import RegionalAreaGraph from './regional-area-graph'
import RegionalBarGraph from './regional-bar-graph'
import SetupNZTable from '../../utils/setup-nz-table'

const NZRegionalView = ({width, height}) => {
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

    const GraphHeader = styled('div')`
      p{
        margin-bottom: 0;
        @media screen and (min-width: 1300px){
          padding-left: 30px;
        }
        @media screen and (max-width: 600px){
          margin-bottom: 20px;
      }
    `

    return (
      <section className="section" style={{marginBottom: '50px'}}>
        <div className="container">
          <div className="columns">
            <div className="column is-one-third-desktop is-full-tablet">
              <div className="box has-background-success">
                  <h3 className="is-size-4 title has-text-white title">
                      Current Cases by DHB
                  </h3>
                  <p className="is-size-6 subtitle has-text-white">
                    We use the Ministry of Health current case data found 
                    {' '}<a
                      href="https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-current-situation/covid-19-current-cases/covid-19-current-cases-details"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <strong className="has-text-white">
                        here
                      </strong>
                    </a>. Click on a row to see the data for that region.</p>

                      
                    <p className="has-text-white is-size-7" style={{marginTop: '10px'}}>
                      These comparisons are based on the case report date not when they are announced.
                      If a case have been reported for the same day as the 1pm national update they are included in the previous days results.
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
            <div className="column is-two-thirds-desktop is-full-tablet">
              <GraphHeader className="field is-horizontal" style={{width: "100%", justifyContent: 'flex-end'}}>
                
                <div className="control">
                  <div className="select">
                    <select value={scale} onChange={e => setScale(e.target.value)}>
                      <option value="linear">Linear</option>
                      <option value="log">Log</option>
                    </select>
                  </div>
                </div>
              </GraphHeader>
              
              <RegionalAreaGraph
                active_region={regions.filter(r => r.name == activeRegion)[0]}
                width={width}
                height={height}
                scale={scale}
              />

              <GraphHeader className="field is-horizontal" style={{width: "100%", justifyContent: 'space-between', marginTop: '50px'}}>
                <div className="control">
                  <p className="title is-size-4" >
                    Age groups {activeRegion == 'All' ? 'nationwide' : 'in ' + activeRegion + ' DHB'} 
                  </p>
                </div>
                <div className="control">
                  <div className="select">
                    <select value={type} onChange={e => setType(e.target.value)}>
                      <option value="value">Value</option>
                      <option value="percent">Percent</option>
                    </select>
                  </div>
                </div>
              </GraphHeader>
              
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

export default NZRegionalView