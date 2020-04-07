import React from "react"
import styled from '@emotion/styled'

import EnhancedTable from '../enhanced-table/enhanced-table'
import RegionalAreaGraph from './regional-area-graph'
import RegionalBarGraph from './regional-bar-graph'


/*
tableData={rows, headCells}
                active_country={active_country}
                all={this.state.all}
                width={this.props.overview_width} 
                height={this.props.overview_height}

                */
const USRegionalView = ({rows, headCells, country_name, all, width, height, area_label}) => {

    const [activeRegion, setActiveRegion] = React.useState('All');
    const [scale, setScale] = React.useState('log');

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
          <div className="columns" style={{flexWrap: 'wrap'}}>
            <div className="column is-one-third-desktop is-full-tablet">
              <div className="box has-background-success">
                  <h3 className="is-size-3 has-text-white title">
                      Region comparisons within {country_name}
                  </h3>
                  <p className="has-text-white subtitle is-size-6">
                    Click on a row to see the data for a {area_label}.
                  </p>
              </div>
              <EnhancedTable 
                rows={rows} 
                headCells={headCells} 
                pageTemplate="advanced-country" 
                selected={activeRegion}
                selectFn={setActiveRegion}
                tidy={new Intl.NumberFormat()}
              />
            </div>
            <div className="column is-two-thirds-desktop is-full-tablet">
              <GraphHeader className="field is-horizontal" style={{width: "100%", justifyContent: 'space-between'}}>
                <div className="control">
                  <p className="title is-size-4 has-text-centered">
                    Cases versus days {activeRegion == 'All' ? 'nationwide' : 'in ' + activeRegion} 
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
              </GraphHeader>
              
              <RegionalAreaGraph
                active_region={all.filter(r => r.name == activeRegion)[0]}
                width={width}
                height={height}
                scale={scale}
                tidy={new Intl.NumberFormat()}
              />
            </div>
          </div>
        </div>
      </section>
    )
}

export default USRegionalView