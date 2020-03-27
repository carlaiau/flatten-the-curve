import React from 'react'
import Hero from '../components/hero'
import Footer from '../components/footer'

import EnhancedTable from '../components/enhanced-table'
import UpdateTable from '../components/update-times'
import styled from '@emotion/styled'
import 'bulma/css/bulma.css'
import '../styles/custom.css'
import SEO from '../components/seo'
import CumulativeGraphContainer from '../components/cumulative-graph/cumulative-graph-container'



export default class IndexPage extends React.Component{
    
    constructor(props){
        super(props);

        

        this.state = {
            selected_country: '',
            numberFormat: new Intl.NumberFormat(),
            cum_width:  800,
            cum_height: 182
            
        }
    }


    render(){
        
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
                <UpdateTable/>
                
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
                <div className="container">
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
                                    by number of days since nth case
                                </p>
                            </div>
                        </div>
                    </div>
                    <CumulativeGraphContainer 
                        width={this.state.cum_width} 
                        height={this.state.cum_height} 
                        field="confirmed"
                        checkedAreas={[
                            'Singapore',
                            'China',
                            'Italy',
                            'Spain',
                            'Iran',
                            'South Korea',
                            'Australia',
                            'United States',
                            'United Kingdom',
                        ]}
                        accumulateFrom={100}
                        accumulateOptions={[50, 100, 200, 300, 400, 500, 750, 1000]}
                        
                        
                    />  
                    <div className="columns">
                        <div className="column is-narrow">
                            <div className="box has-background-success is-full">
                                <h3 className="is-size-3 has-text-white title">Cumulative number of deaths</h3>
                                <p className="is-size-5 subtitle has-text-white">by numbers of days since nth death</p>
                            </div>
                        </div>
                    </div>
                    <CumulativeGraphContainer 
                        width={this.state.cum_width} 
                        height={this.state.cum_height} 
                        field="deaths"
                        checkedAreas={[
                            'Singapore',
                            'China',
                            'Italy',
                            'Spain',
                            'Iran',
                            'South Korea',
                            'Australia',
                            'United States',
                            'United Kingdom',
                        ]}
                        accumulateFrom={10}
                        accumulateOptions={[10, 20, 30, 40, 50, 75, 100, 200, 300, 400, 500]}   
                          
                    /> 
                    <div className="columns">
                        <div className="column is-narrow is-one-third">
                            <div className="box has-background-success is-full">
                                <h3 className="is-size-3 has-text-white title">World Overview</h3>
                                <UpdateTable color="white"/>
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
                </div>
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
