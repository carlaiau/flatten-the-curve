import React from 'react'
import styled from '@emotion/styled'
import Hero from "../components/hero"
import SEO from "../components/seo"
import CountryOverviewGraph from "../components/country-overview-graph"
import Footer from "../components/footer"
import SetupCountry from '../utils/setup-country'
import SetupAdvancedCountryTable from '../utils/setup-advanced-country-table'

import EnhancedTable from '../components/enhanced-table'

import 'bulma/css/bulma.css'
import '../styles/custom.css'

export default class AdvancedCountryPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            countries: props.countries,
            all: props.all,
            cum: props.cum,
            field: 'confirmed',
            per: 'total',
            scale: 'linear',
            overview_width: 0,
            overview_height: 0,
            country: props.all.filter(state => state.name == 'All')[0],
            selectedStates: ['All'],
            numberFormat: new Intl.NumberFormat(),
        }   
    }


    render(){
        const {field, per, country} = this.state
        let full_field_name = field === 'confirmed' ? 
        per === 'total' ? 'confirmed' : 'confirmed_per_mil' :
        per === 'total' ? 'deaths' : 'deaths_per_mil'


        const active_country = SetupCountry({
            country: country,
            field: full_field_name
          })

        const {rows, headCells} = SetupAdvancedCountryTable(this.props.all)



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

        return (<>
            <SEO title="COVID19: United States Update"/>
            <Hero selected_country="United States"/>
            <section className="section">
                <div className="container">
                    <div className="columns info">
                        <div className="column is-two-thirds"> 
                            <h2 className="is-size-3 title">United States</h2>
                            <p className="is-size-4 subtitle">
                            {
                                // Notice use of country wide constant variable, not dynamically based on highest. due to sorting
                            country.highest_confirmed ? country.highest_confirmed + ' Cases' : ''}
                            <span style={{float: 'right'}}>
                                {country.highest_deaths ? country.highest_deaths + ' Deaths' : ''}
                            </span>
                            </p>  
                            <CountryOverviewGraph 
                                active_country={active_country}
                                scale={this.state.overview_scale}   
                                field={field}   
                                full_field_name={full_field_name}
                                width={this.state.overview_width}     
                                height={this.state.overview_height}
                            />
                        </div>
                        <div className="column is-one-third">
                            <div className="field is-grouped is-horizontal">
                                <div className="control">
                                    <div className="select">
                                    <select value={this.state.field} onChange={e => this.setState({field: e.target.value})}>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="deaths">Deaths</option>
                                    </select>
                                    </div>
                                </div>
                                <div className="control">
                                    <div className="select">
                                    <select value={this.state.per} onChange={e => this.setState({per: e.target.value})}>
                                        <option value="total">Total</option>
                                        <option value="per_million">Per Mil</option>
                                    </select>
                                    </div>
                                </div>
                                <div className="control">
                                    <div className="select">
                                    <select value={this.state.overview_scale} onChange={e => this.setState({overview_scale: e.target.value})}>
                                        <option value="linear">Linear Scale</option>
                                        <option value="log">Log Scale</option>
                                    </select>
                                    </div>
                                </div>
                            </div>
                            <label className="label">States</label>
                                <div className="check-container">
                                    {this.state.all.map(s => (
                                        <label className="checkbox" key={s.name}>
                                            <input 
                                                type="checkbox" name={s.name} 
                                                value={s.name} 
                                            />{s.name}
                                        </label>
                                    ))}
                                </div>
                        
                        </div>
                    </div>
                </div>                
        </section>
            <section className="section">

                <StyledTable className="container">
                    <EnhancedTable rows={rows} headCells={headCells} pageTemplate="advanced-country" tidy={this.state.numberFormat}/>
                </StyledTable>
            </section>
            <Footer/>
        </>)
    }


    /**
   * Calculate & Update state of new dimensions
   */
  updateDimensions = () => {  

    let overview_width =  860
    let overview_height = 500
    let is_mobile = false
    
    if(window.innerWidth < 1408){ // FullHD
      overview_width =  740
      overview_height = 550
      is_mobile = false
    }
    if(window.innerWidth < 1216){ // Desktop
      overview_width =  600
      overview_height = 400
      is_mobile = false
    }
    if(window.innerWidth < 1024){
      overview_width =  450
      overview_height = 400
      is_mobile = false
    }

    if(window.innerWidth < 769){
      overview_width =  650
      overview_height = 450
      is_mobile = true   
    }
    if(window.innerWidth < 480){
      overview_width = 300
      overview_height = 300
       
    }

    //window.innerHeight
    
    this.setState({ overview_width, overview_height, is_mobile });
  
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