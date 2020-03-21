import React from 'react'
import Hero from '../components/hero'
import Tab from '../components/tabs'
import Footer from '../components/footer'
import CumulativeGraph from '../components/cumulative-graph'
import GraphOptionsSideBar from '../components/graph-options-sidebar'

import 'bulma/css/bulma.css'
import '../styles/custom.css'



export default class IndexPage extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
          selected_country: '',
          numberFormat: new Intl.NumberFormat(),
          limit: 60,
          width:  800,
          height: 182,
          num_scale: 'linear',
          num_graph_countries: [
            'China',
            'Italy',
            'Spain',
            'Japan',
            'Iran',
            'France',
            'South Korea',
            'Singapore',
            'United States',
            'United Kingdom',
            'Australia',
            'Canada'
          ],
          death_scale: 'linear',
          death_graph_countries: [
            'Singapore',
            'China',
            'Italy',
            'Spain',
            'Japan',
            'Iran',
            'France',
            'South Korea',
            'United Kingdom',
            'United States'
          ]
      }
    }

    render(){
        
        return(<>
            <Hero selected_country=''/>
            
            <div className="container">
                <div className="columns">
                    <div className="column is-full" style={{marginTop: '30px'}}>
                        <Tab/>
                    </div>
                </div>
                <div className="columns" style={{marginTop: '20px', alignItems: 'center'}}>
                    <div className="column is-quarter">
                        <div className="box has-background-success">
                            <h3 className="is-size-3 has-text-white title">
                                Cumulative number of cases
                            </h3>
                            <p className="is-size-5 subtitle has-text-white">
                                by number of days since 100th case
                            </p>
                        </div>
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
                            <button class="button is-warning" onClick={e => this.setState({num_graph_countries: []})}>Clear All</button>
                        </div>
                    </div>
                    <div className="column is-three-quarters">
                        <CumulativeGraph scale={this.state.num_scale} countries_to_graph={this.state.num_graph_countries}/>
                    </div>
                </div> 

                <div className="columns" style={{paddingTop: '30px', paddingBottom: '30px', alignItems: 'center'}}>
                    <div className="column">
                        <div className="box has-background-success">
                            <h3 className="is-size-3 has-text-white title">
                            Cumulative number of deaths
                            </h3>
                            <p className="is-size-5 subtitle has-text-white">
                            by numbers of days since 10th deaths
                            </p>
                        </div>
                        <div className="box">
                            <GraphOptionsSideBar
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
                            <button class="button is-warning" onClick={e => this.setState({death_graph_countries: []})}>Clear All</button>
                        </div>
                    </div>
                    <div className="column is-three-quarters">
                        <CumulativeGraph field="deaths" scale={this.state.death_scale}  countries_to_graph={this.state.death_graph_countries}/>  
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
    }
    
}
