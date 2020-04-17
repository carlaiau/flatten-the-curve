import React from 'react'
import CumulativeGraph from './cumulative-graph'
import GraphOptionsSideBar from './graph-options-sidebar'
import styled from '@emotion/styled'

export default class CumulativeGraphContainer extends React.Component{
    
    constructor(props){
        super(props);

        this.state = {
            type_of_area: props.type_of_area || "country",
            areas: props.areas || [],
            checkedAreas: props.checkedAreas,
            accumulateFrom: props.accumulateFrom,
            accumulateOptions: props.accumulateOptions,
            show_all_areas: false,
            max_area_count: props.max_area_count || 30,
            scale: 'log',
            
            
            
        }
    }

    // confirmed_graph_countries
    areaChecked = (e) => {
        const newArea = e
        if(this.state.checkedAreas.includes(newArea)){
            const newAreas = this.state.checkedAreas.filter(c => c !== newArea)
            return this.setState({checkedAreas: newAreas})
        }
        else{
            let newAreas = this.state.checkedAreas
            newAreas.push(newArea)
            return this.setState({checkedAreas: newAreas})
        }
    }




    render(){
        const GraphContainer = styled('div')`
            align-items: center;
            .box{
                @media screen and (max-width: 480px){
                    margin-left: 10px;  
                    margin-right: 10px;
                }
            }
            .recharts-legend-item{
                @media screen and (max-width: 480px){
                    svg{
                        height: 7px;
                        width: 7px;
                    }
                    span{
                        font-size: 10px;
                    }
                }
            }
            .recharts-layer.recharts-cartesian-axis{
                @media screen and (max-width: 480px){
                    
                    text{
                        tspan{
                            font-size: 10px;
                        }
                    }
                }
            }
            .recharts-legend-wrapper{
                @media screen and (max-width: 480px){
                    display: none;
                }
            }
        `

        return (
            <GraphContainer className="columns">
                <div className="column is-quarter">    
                    <div className="box">
                        <GraphOptionsSideBar
                            field={this.props.field}
                            type_of_area={this.state.type_of_area}
                            areas={this.state.areas}
                            
                            checkedAreas={this.state.checkedAreas}
                            max_area_count={this.state.max_area_count} 
                            
                            scale={this.state.scale} 
                            
                            accumulateFrom={this.state.accumulateFrom}
                            accumulateOptions={this.props.accumulateOptions}
                            show_all_areas={this.state.show_all_areas}
                            scaleFn={e => {this.setState({scale: e.target.value})}}
                            checkFn={e => this.areaChecked(e.target.value) }
                            clearFn={e => this.setState({checkedAreas: []})}
                            allFn={ (areas) => this.setState({checkedAreas: areas.map(a => a.name)})}
                            caseFn={e => {this.setState({accumulateFrom: e.target.value})}}
                            maxCountFn={e => this.setState({show_all_areas: ! this.state.show_all_areas})}
                        />
                        
                    </div>
                </div>
                <div className="column is-three-quarters">
                    <CumulativeGraph 
                        field={this.props.field}
                        width={this.props.width} 
                        height={this.props.height} 
                        
                        type_of_area={this.state.type_of_area}
                        areas={this.state.areas}
                        scale={this.state.scale} 
                        accumulateFrom={this.state.accumulateFrom}
                        max_area_count={this.state.max_area_count} 
                        show_all_areas={this.state.show_all_areas}
                        areas_to_graph={this.state.checkedAreas}/>
                </div>
            </GraphContainer>  
        )
    }
}
