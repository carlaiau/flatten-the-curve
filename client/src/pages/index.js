import React from 'react'
import Hero from '../components/hero'
import Footer from '../components/footer'
import CumulativeGraph from '../components/cumulative-graph'
import GraphOptionsSideBar from '../components/graph-options-sidebar'
import EnhancedTable from '../components/enhanced-table'
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
            update_time: '1:11am 27 March UTC',
            selected_country: '',
            numberFormat: new Intl.NumberFormat(),
            
            cum_width:  800,
            cum_height: 182,

            
            confirmed_scale: 'linear',
            confirmed_graph_countries: default_countries,
            confirmed_start: 100,
            confirmed_growth: {
                label: "Doubles every 3 days",
                value: 1.25992105
            },
            confirmed_options: [50, 100, 200, 300, 400, 500, 750, 1000],

            death_scale: 'linear',
            death_graph_countries: default_countries,
            death_start: 10,
            death_options: [10, 20, 30, 40, 50, 75, 100, 200, 300, 400, 500],
            death_growth: {
                label: "Doubles every 3 days",
                value: 1.25992105
            },

            max_count: 40,
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
    countryChecked = (e, graph_type) => {
        const checkedCountry = e.target.value
        if(this.state[graph_type].includes(checkedCountry)){
            const newCountries =  this.state[graph_type].filter(c => c !== checkedCountry)
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
                <p className="is-size-6" style={{marginBottom: '20px'}}>Global data updated at <strong>{this.state.update_time}</strong></p>
                
                <p className="is-size-7" >
                    Please use the dropdown in the header for country-specific comparisons and projections.     
                </p>                            
                <p className="is-size-7">
                    We present data for countries that have populations larger than 1 million and at least 10 confirmed cases.
                </p>    
            </div>
        )


        const StyledTable = styled('div')`
            .MuiTableHead-root{
                background: #fff;
                .MuiTableCell-alignRight{
                    text-align: right;
                }
            }
            .MuiTablePagination-root{
                background: #227093;
                max-width: 500px;
                border-radius: 6px;
                color: #fff;
                margin-top: 20px;
            }
            td.MuiTableCell-body{
                text-align: right;
            }
            .MuiTableBody-root{
                .MuiTableRow-root{
                    &:last-of-type{
                        td, th{
                            border-bottom: none;
                        }
                    }
                }
            }

            .MuiSelect-icon{
                color: #fff;
            }
            .MuiSvgIcon-root{
                color: #fff;
            }
            .Mui-disabled{
                .MuiSvgIcon-root{
                    opacity: 0.5;
                }
            }

            @media screen and (max-width: 1216px){
                .MuiTableCell-root{
                    padding: 10px;
                }
                .MuiTableHead-root{
                    .MuiTableCell-root{
                        padding: 5px;
                    }
                }
            }
            @media screen and (max-width: 920px){
                .MuiTableCell-root{
                    padding: 10px 0;
                }
                .MuiTableCell-root{
                    &.population{
                        display: none;
                    }
                }
                .MuiTableRow-root{
                    td{
                        &:first-of-type{
                            display: none;
                        }
                    }
                }
            }
            @media screen and (max-width: 768px){
                .MuiTableCell-root{
                    &.recovered,
                    &.recovered_delta{
                        display: none;
                    }
                }
            }
            @media screen and (max-width: 375px){
                .MuiTableHead-root{
                    .MuiTableCell-root{
                        padding: 5px;
                        line-height: 1.3;
                        font-size: 9px;
                    }
                    .MuiTableSortLabel-icon{
                        font-size: 12px;
                    }
                }
                .MuiTableBody-root{
                    .MuiTableCell-root{
                        font-size: 9px;
                        padding: 5px 0;
                        
                    }
                    th{
                        &.MuiTableCell-root{
                            padding-left: 5px;
                        }
                    }
                    .button{
                        font-size: 8px !important;
                        padding: 2px;
                        margin-left: 2px;
                    }
                }
                .MuiTablePagination-root{
                    width: 80%;
                    margin-left: 20px;
                    .MuiToolbar-root{
                        .MuiTypography-body2{
                            font-size: 9px;
                        }
                    }
                }
            }

        `
        
        return(<>
            <SEO title={' COVID-19: Showing why we must act early'}/>
            <Hero selected_country=''/>
            <div className="section">
                <IndexContainer className="container">
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <ContentBlock/>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-narrow">
                            <div className="box has-background-success">
                                <h3 className="is-size-3 has-text-white title">
                                    Cumulative number of cases
                                </h3>
                                <p className="is-size-5 subtitle has-text-white">
                                    by number of days since {this.state.confirmed_start}th case
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-quarter">
                            
                            <div className="box">
                                <GraphOptionsSideBar
                                    scale={this.state.confirmed_scale} 
                                    max_count={this.state.max_count} 
                                    confirm_state={this.confirm_start}
                                    checkCountries={this.state.confirmed_graph_countries}

                                    min_cases={this.state.confirmed_start}
                                    min_case_options={this.state.confirmed_options}

                                    growth_options={this.state.growth_options}
                                    growth={this.state.confirmed_growth}

                                    caseFn={e => {this.setState({confirmed_start: e.target.value})}}
                                    scaleFn={e => {this.setState({confirmed_scale: e.target.value})}}
                                    checkFn={e => this.countryChecked(e, 'confirmed_graph_countries') }
                                    clearFn={e => this.setState({confirmed_graph_countries: []})}
                                    growthFn={e => this.setState({confirmed_growth: this.state.growth_options.find(val => e.target.value == val.value)}) }
                                    allFn={ (countries) => this.setState({confirmed_graph_countries: countries.map(c => c.country_name)})}
                                />
                                
                            </div>
                        </div>
                        <div className="column is-three-quarters">
                            <CumulativeGraph 
                                width={this.state.cum_width} 
                                height={this.state.cum_height} 
                                scale={this.state.confirmed_scale} 
                                max_count={this.state.max_count} 
                                growth={this.state.confirmed_growth}
                                case_start={this.state.confirmed_start}
                                countries_to_graph={this.state.confirmed_graph_countries}/>
                        </div>
                    </div>  
                    <div className="columns">
                        <div className="column is-narrow">
                            <div className="box has-background-success is-full">
                                <h3 className="is-size-3 has-text-white title">Cumulative number of deaths</h3>
                                <p className="is-size-5 subtitle has-text-white">by numbers of days since {this.state.death_start}th death</p>
                            </div>
                        </div>
                    </div>
                    <div className="columns" style={{marginBottom: '30px'}}>
                        <div className="column">
                            <div className="box">
                                <GraphOptionsSideBar
                                    field='deaths'
                                    scale={this.state.death_scale} 
                                    max_count={this.state.max_count}
                                    checkCountries={this.state.death_graph_countries}

                                    min_cases={this.state.death_start}
                                    min_case_options={this.state.death_options}

                                    growth_options={this.state.growth_options}
                                    growth={this.state.death_growth}

                                    caseFn={e =>    {this.setState({death_start: e.target.value})}}
                                    scaleFn={e =>   {this.setState({death_scale: e.target.value})}}

                                    checkFn={e => this.countryChecked(e, 'death_graph_countries')}
                                    clearFn={e => this.setState({death_graph_countries: []})}
                                    growthFn={e => this.setState({death_growth: this.state.growth_options.find(val => e.target.value == val.value)}) }
                                    allFn={ (countries) => this.setState({death_graph_countries: countries.map(c => c.country_name)}) }
                                />
                            </div>
                        </div>
                        <div className="column is-three-quarters">
                            <CumulativeGraph 
                                width={this.state.cum_width} 
                                height={this.state.cum_height} 
                                field="deaths"  
                                max_count={this.state.max_count}  
                                case_start={this.state.death_start}
                                scale={this.state.death_scale}  
                                growth={this.state.death_growth}
                                countries_to_graph={this.state.death_graph_countries}
                            />  
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-narrow is-one-third">
                            <div className="box has-background-success is-full">
                                <h3 className="is-size-3 has-text-white title">World Overview</h3>
                                <p className="is-size-5 subtitle has-text-white">Sort using any column. Data updated at <strong className="has-text-white">{this.state.update_time}</strong>.</p>
                                <p className="is-size-7 has-text-white">
                                    Populations must be larger than 1 million with 10 confirmed cases
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <StyledTable className="column is-full">
                            <EnhancedTable tidy={this.state.numberFormat}/>
                        </StyledTable>
                    </div>
                </IndexContainer>
            </div>
            <Footer/>
        </>
    )
}


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
