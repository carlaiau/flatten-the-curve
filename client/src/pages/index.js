import React from 'react'
import Hero from '../components/hero'
import Tab from '../components/tabs'
import Footer from '../components/footer'
import CumulativeGraph from '../components/cumulative-graph'
import GraphOptionsSideBar from '../components/graph-options-sidebar'
import styled from '@emotion/styled'
import 'bulma/css/bulma.css'
import '../styles/custom.css'



export default class IndexPage extends React.Component{
    
    constructor(props){
        super(props);

        const default_countries = [
            'Singapore',
            'China',
            'Italy',
            'Spain',,
            'Iran',
            'South Korea',
            'Australia',
            'United States',
            'United Kingdom',
          ]
        this.state = {
          selected_country: '',
          numberFormat: new Intl.NumberFormat(),
          limit: 60,
          width:  800,
          height: 182,
          num_scale: 'linear',
          num_graph_countries: default_countries,
          death_scale: 'linear',
          death_graph_countries: default_countries
      }
    }

    

    render(){
        const IndexContainer = styled('div')`
            
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
        return(<>
            <Hero selected_country=''/>
            
            <IndexContainer className="container">
                <div className="columns">
                    <div className="column is-full" style={{marginTop: '30px'}}>
                        <Tab/>
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-narrow">
                        <div className="box has-background-success">
                            <h3 className="is-size-3 has-text-white title">
                                Cumulative number of cases
                            </h3>
                            <p className="is-size-5 subtitle has-text-white">
                                by number of days since 100th case
                            </p>
                        </div>
                    </div>
                </div>
                <div className="columns">
                    <div className="column is-quarter">
                        
                        <div className="box">
                            <GraphOptionsSideBar
                                scale={this.state.num_scale} 
                                scaleFn={e => {this.setState({num_scale: e.target.value})}}
                                checkCountries={this.state.num_graph_countries}
                                checkFn={e => {
                                    const checkedCountry = e.target.value
                                    if(this.state.num_graph_countries.includes(checkedCountry)){
                                        const newCountries =  this.state.num_graph_countries.filter(c => c != checkedCountry)
                                        return this.setState({num_graph_countries: newCountries})
                                    }
                                    else{
                                        let newCountries = this.state.num_graph_countries
                                        newCountries.push(checkedCountry)
                                        return this.setState({num_graph_countries: newCountries})
                                    }
                                }
                            }/>
                            <div style={{textAlign:'right'}}>
                                <button class="button has-background-newt has-text-white" 
                                style={{marginTop: '10px'}}
                                onClick={e => this.setState({num_graph_countries: []})}>
                                    <strong>Clear All</strong>    
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="column is-three-quarters">
                        <CumulativeGraph width={this.state.width} scale={this.state.num_scale} countries_to_graph={this.state.num_graph_countries}/>
                    </div>
                </div>  
                
                <div className="columns">
                    <div className="column is-narrow">
                        <div className="box has-background-success is-full">
                            <h3 className="is-size-3 has-text-white title">Cumulative number of deaths</h3>
                            <p className="is-size-5 subtitle has-text-white">by numbers of days since 10th death</p>
                        </div>
                    </div>
                </div>
                <div className="columns" style={{marginBottom: '30px'}}>
                    <div className="column">
                        <div className="box">
                            <GraphOptionsSideBar
                                field='death'
                                scale={this.state.death_scale} 
                                scaleFn={e => {this.setState({death_scale: e.target.value})}}
                                checkCountries={this.state.death_graph_countries}
                                checkFn={e => {
                                    const checkedCountry = e.target.value
                                    if(this.state.death_graph_countries.includes(checkedCountry)){
                                        const newCountries =  this.state.death_graph_countries.filter(c => c != checkedCountry)
                                        return this.setState({death_graph_countries: newCountries})
                                    }
                                    else{
                                        let newCountries = this.state.death_graph_countries
                                        newCountries.push(checkedCountry)
                                        return this.setState({death_graph_countries: newCountries})
                                    }
                                }
                            }/>
                            <div style={{textAlign:'right'}}>
                                <button class="button has-background-newt has-text-white" 
                                style={{marginTop: '10px'}}
                                onClick={e => this.setState({death_graph_countries: []})}>
                                    <strong>Clear All</strong>    
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="column is-three-quarters">
                        <CumulativeGraph width={this.state.width} field="deaths" scale={this.state.death_scale}  countries_to_graph={this.state.death_graph_countries}/>  
                    </div>
                </div>
            </IndexContainer>
            <Footer/>
        </>
    )
    }
  
  /**
   * Calculate & Update state of new dimensions
   */
  updateDimensions = () => {  
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  /**
   * Add event listener
   */
  componentDidMount = () => {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
  }

  /**
   * Remove event listener
   */
  componentWillUnmount = () => {
    window.removeEventListener("resize", this.updateDimensions);
  }
    
}
