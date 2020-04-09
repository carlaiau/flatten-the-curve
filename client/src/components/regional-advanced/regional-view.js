import React from "react"
import styled from '@emotion/styled'

import EnhancedTable from '../enhanced-table/enhanced-table'
import RegionalAreaGraph from './regional-area-graph'

const RegionalView = ({rows, headCells, all, width, height, area_label = "State"}) => {

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
                <h3 className="is-size-4 has-text-white title">View by {area_label}</h3>
                <p className="is-size-6 subtitle has-text-white">
                    Please select a column to filter data, Columns are sortable.
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
            <p className="title is-size-4" >
                Cases {activeRegion == 'All' ? 'nationwide' : 'in ' + activeRegion} 
              </p>
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

export default RegionalView