import React from 'react'
import Hero from '../components/hero'
import Footer from '../components/footer'
import CumulativeGraph from '../components/cumulative-graph'
import GraphOptionsSideBar from '../components/graph-options-sidebar'
import styled from '@emotion/styled'
import 'bulma/css/bulma.css'
import '../styles/custom.css'
import SEO from '../components/seo'



export default class IndexPage extends React.Component{
    
    constructor(props){
        super(props);

        const default_countries = [
            'Singapore',
            'China',
            'Italy',
            'Spain',
            'Iran',
            'South Korea',
            'Australia',
            'United States',
            'United Kingdom',
          ]

        this.state = {
          selected_country: '',
          numberFormat: new Intl.NumberFormat(),
          cum_width:  800,
          cum_height: 182,
          num_scale: 'linear',
          num_graph_countries: default_countries,
          death_scale: 'linear',
          death_graph_countries: default_countries,
          max_count: 40,
          update_time: '5:12pm 22 March NZT'
      }
    }


    
    


    // num_graph_countries
    countryChecked = (e, graph_type) => {
        const checkedCountry = e.target.value
        if(this.state[graph_type].includes(checkedCountry)){
            const newCountries =  this.state[graph_type].filter(c => c != checkedCountry)
            return this.setState({[graph_type]: newCountries})
        }
        else{
            let newCountries = this.state[graph_type]
            newCountries.push(checkedCountry)
            return this.setState({[graph_type]: newCountries})
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
        

        const ContentBlock = () => (
            <div className="box">
                <h2 className="is-size-3"><strong>We must act now!</strong></h2>
                <h3 className="is-size-4 subtitle">
                    Compare your country to evolving situations in the rest of the world
                </h3>
                <p className="is-size-6">
                    If you are currently at the bottom of the curve you can use our tool to see how your situation may develop.
                    You can compare yourself to other countries who have progressed ahead and observe how things escalate.     
                </p>
                <p className="is-size-6">
                    Because of the explosive growth, it is critical we all do our best to flatten the curve, even when these early measures feel extreme.
                    Slowing the spread is our best tool to prevent catastrophic collapse of our medical systems.
                </p>
                <p className="is-size-6" style={{marginBottom: '20px'}}>
                    For actionable steps to slow the spread please visit <a href="https://flattenthecurve.com/" target="_blank" rel="noopener noreferrer">Flattenthecurve.com</a>. 
                </p>
                <p className="is-size-7">Global data updated at <strong>{this.state.update_time}</strong></p>
                
                <p className="is-size-7">
                    Please use the dropdown in the header for country-specific comparisons and projections.     
                </p>                            
                <p className="is-size-7">
                    We present data for countries that have populations larger than 1 million and at least 10 confirmed cases.
                </p>    
            </div>
        )

        
        return(<>
            <SEO title={' COVID-19: Showing why we must act early'}/>
            <Hero selected_country=''/>
            <div className="section">
                <IndexContainer className="container">
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <ContentBlock/>
                        </div>
                        { this.state.width < 480 ?
                        <div className="column">
                            <div className="box has-background-newt">
                                <p className="is-size-6">
                                    <strong className="has-text-white">
                                        Please use a computer to get the best use out of this interface
                                    </strong>
                                </p>
                                
                            </div>
                        </div>
                        : 
                        <></>
                        }
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
                                    max_count={this.state.max_count} 
                                    scaleFn={e => {this.setState({num_scale: e.target.value})}}
                                    checkCountries={this.state.num_graph_countries}
                                    checkFn={e => this.countryChecked(e, 'num_graph_countries') }
                                    clearFn={e => this.setState({num_graph_countries: []})}
                                    allFn={ (countries) => this.setState({num_graph_countries: countries.map(c => c.country_name)})}
                                />
                                
                            </div>
                        </div>
                        <div className="column is-three-quarters">
                            <CumulativeGraph width={this.state.cum_width} height={this.state.cum_height} scale={this.state.num_scale} max_count={this.state.max_count} countries_to_graph={this.state.num_graph_countries}/>
                        </div>
                    </div>  
                    
                    

                </IndexContainer>
            </div>
            <Footer/>
        </>
    )
    }

  /*

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
                                    max_count={this.state.max_count}
                                    scaleFn={e => {this.setState({death_scale: e.target.value})}}
                                    checkCountries={this.state.death_graph_countries}
                                    checkFn={e => this.countryChecked(e, 'death_graph_countries')}
                                    clearFn={e => this.setState({death_graph_countries: []})}
                                    allFn={ (countries) => this.setState({death_graph_countries: countries.map(c => c.country_name)}) }
                                />
                            </div>
                        </div>
                        <div className="column is-three-quarters">
                            <CumulativeGraph width={this.state.cum_width} height={this.state.cum_height} field="deaths"  max_count={this.state.max_count}  scale={this.state.death_scale}  countries_to_graph={this.state.death_graph_countries}/>  
                        </div>
                        </div>

*/
  /**
   * Calculate & Update state of new dimensions
   */
  updateDimensions = () => {  
    let cum_width =  1000

    let cum_height = 500
    
    if(window.innerWidth < 1408){ // FullHD
        cum_width = 860
        cum_height = 430
    }
    if(window.innerWidth < 1216){ // Desktop
        cum_width = 720
        cum_height = 360
    }
    if(window.innerWidth < 1024){
        cum_width = 565
        cum_height = 300
    }
    if(window.innerWidth < 769){
        cum_width = 740
        cum_height = 450
    }

    if(window.innerWidth < 480){
        cum_width = 350
        cum_height = 300
    }
    
    this.setState({ cum_width, cum_height });
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
