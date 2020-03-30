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
            
            growth: {
                label: "Doubles every 3 days",
                value: 1.25992105
            },            
            growth_options: [
                {
                    label: "Doubles every day",
                    value: 2.00
                },
                {
                    label: "Doubles every 2 days",
                    value: 1.414213562
                },
                {
                    label: "Doubles every 3 days",
                    value: 1.25992105
                },
                {
                    label: "Doubles every 4 days",
                    value: 1.189207115
                },
                {
                    label: "Doubles every 5 days",
                    value: 1.148698355
                },
                {
                    label: "Doubles every 6 days",
                    value: 1.122462048
                },
                {
                    label: "Doubles every week",
                    value: 1.104089514
                },
                {
                    label: "Doubles every fortnight",
                    value: 1.050756639
                },
                {
                    label: "5% Daily Growth",
                    value: 1.05
                },
                {
                    label: "10% Daily Growth",
                    value: 1.1
                },

                {
                    label: "20% Daily Growth",
                    value: 1.2
                },
                {
                    label: "25% Daily Growth",
                    value: 1.25
                },
                {
                    label: "30% Daily Growth",
                    value: 1.3
                },
                {
                    label: "33% Daily Growth",
                    value: 1.33
                },
                {
                    label: "35% Daily Growth",
                    value: 1.35
                },
                {
                    label: "40% Daily Growth",
                    value: 1.4
                },
                {
                    label: "50% Daily Growth",
                    value: 1.5
                },
                {
                    label: "60% Daily Growth",
                    value: 1.6
                },
                {
                    label: "70% Daily Growth",
                    value: 1.7
                },
                {
                    label: "80% Daily Growth",
                    value: 1.8
                },
                {
                    label: "90% Daily Growth",
                    value: 1.9
                },
                {
                    label: "100% Daily Growth",
                    value: 2.0
                },
            ]
            
            
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

                            growth={this.state.growth}
                            growth_options={this.state.growth_options}
                            show_all_areas={this.state.show_all_areas}
                            scaleFn={e => {this.setState({scale: e.target.value})}}
                            checkFn={e => this.areaChecked(e.target.value) }
                            clearFn={e => this.setState({checkedAreas: []})}
                            allFn={ (areas) => this.setState({checkedAreas: areas.map(a => a.name)})}
                            caseFn={e => {this.setState({accumulateFrom: e.target.value})}}
                            growthFn={e => this.setState({growth: this.state.growth_options.find(g => e.target.value == g.value)}) }
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
                        growth={this.state.growth}
                        areas_to_graph={this.state.checkedAreas}/>
                </div>
            </GraphContainer>  
        )
    }
}
