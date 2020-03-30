import React from 'react'
import styled from '@emotion/styled'
import Hero from "../components/hero"
import SEO from "../components/seo"
import CountryOverviewGraph from "../components/country-overview-graph"
import CumulativeGraphContainer from "../components/cumulative-graph/cumulative-graph-container"
import Footer from "../components/footer"
import SetupCountry from '../utils/setup-country'
import SetupAdvancedCountryTable from '../utils/setup-advanced-country-table'
import UpdateTable from '../components/update-times'

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
            overview_width: 0,
            overview_height: 0,
            overview_scale: 'log',
            country: props.all.filter(state => state.name == 'All')[0],
            selectedStates: ['All'],
            numberFormat: new Intl.NumberFormat(),
            cum_width:  800,
            cum_height: 182,
            max_area_count: 60
        }   
    }


    render(){
        const {field, per, country} = this.state
        const update_times = this.props.update_times

        let full_field_name = field === 'confirmed' ? 
        per === 'total' ? 'confirmed' : 'confirmed_per_mil' :
        per === 'total' ? 'deaths' : 'deaths_per_mil'


        const active_country = SetupCountry({
            country: country,
            field: full_field_name
          })
        

        const {rows, headCells} = SetupAdvancedCountryTable(this.props.country_name, this.props.all)



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
                    width: 90%;
                    margin-left: 20px;
                    .MuiToolbar-root{
                        .MuiTypography-body2{
                            font-size: 9px;
                        }
                    }
                }
            }

        `
        
        /*
        This will replace content block when in place
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
        */          
       
       const ContentBlock = () => {
        const {name, highest} = active_country
        const {confirmed, deaths} = highest
        return (
        <div className="box">
            <h3 className="is-size-4 title">{this.props.country_name} must act now</h3>
            
            <p className="is-size-6">
              Because of the explosive growth, it is critical we all do our best to flatten the curve, even when these early measures feel extreme. 
              Slowing the spread is our best tool to prevent catastrophic collapse of our medical systems.
            </p>
            { (confirmed > 100 ||deaths > 10) && per == 'total' ?
            <p className="is-size-6"style={{marginTop: '10px'}}>
              The <strong>{field =='confirmed' ? 'Cases' :'Deaths'} double every 3 days</strong> 
              comparison is based on compounding daily growth starting from when the {this.props.country_name} daily figure first exceeded{' '}
              { confirmed > 100 && field =='confirmed'? <strong>100 confirmed cases</strong> : <></> }{' '}
              { deaths > 10 && field != 'confirmed' ? <strong>10 deaths</strong> : <></> }
            </p>
            : <></> }
            <div style={{marginTop: '10px', marginBottom: '10px'}}>
              <p className="is-size-6">
                Global data updated at <strong>{update_times.global}</strong>
              </p>
              {this.props.country_name == 'United States' ? 
                <p className="is-size-6">
                    {this.props.country_name} data updated at <strong>{update_times.us}</strong>
                </p>
                : <></>}
            </div>
            {this.props.country_name == 'United States' ?
            <div>
                 
                <p className="is-size-7">
                The United States total and state level COVID-19 data is sourced from the
                {' '}<a href="https://covidtracking.com/" target="_blank" rel="noopener noreferrer">
                  COVID Tracking Project
                </a>. This page is in active development.
                </p>
            </div>
            : <></>}
            
        </div>
        )
    }


        return (<>
            <SEO title={`${this.props.country_name} COVID-19 Update: State level cumulative graphs and comparisons`}/>
            <Hero selected_country={this.props.country_name}/>
            <section className="section">
                <div className="container">
                    <div className="columns info">
                        <div className="column is-two-thirds"> 
                            <h2 className="is-size-3 title">{this.props.country_name}</h2>
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
                                max_area_count={this.state.max_area_count}
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
                                        <option value="linear">Linear</option>
                                        <option value="log">Log</option>
                                    </select>
                                    </div>
                                </div>
                            </div>
                            <ContentBlock/>
                        
                        </div>
                    </div>
                </div>                
        </section>
            
            <section className="section cum">
                <div className="container">
                <div className="columns">
                            <div className="column is-narrow">
                                <div className="box has-background-success">
                                    <h3 className="is-size-3 has-text-white title">
                                        Cumulative number of cases by state
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
                            areas={this.state.cum}
                            field="confirmed"
                            type_of_area="state"
                            checkedAreas={this.props.checkedAreas}
                            accumulateFrom={100}
                            accumulateOptions={[50, 100, 200, 300, 400, 500, 750, 1000]}
                            max_area_count={this.state.max_area_count}
                            
                            
                        />  
                        <div className="columns">
                            <div className="column is-narrow">
                                <div className="box has-background-success is-full">
                                    <h3 className="is-size-3 has-text-white title">Cumulative number of deaths by state</h3>
                                    <p className="is-size-5 subtitle has-text-white">by numbers of days since nth death</p>
                                </div>
                            </div>
                        </div>
                        <CumulativeGraphContainer 
                            width={this.state.cum_width} 
                            height={this.state.cum_height} 
                            areas={this.state.cum}
                            field="deaths"
                            type_of_area="state"
                            checkedAreas={this.props.checkedAreas}
                            accumulateFrom={10}
                            accumulateOptions={[10, 20, 30, 40, 50, 75, 100]}   
                        /> 
                </div>
            </section>
            <section className="section">
                <div className="container">
                    <div className="columns">
                        <div className="column is-narrow is-one-third">
                            <div className="box has-background-success is-full">
                                <h3 className="is-size-3 has-text-white title">{this.props.country_name} Overview</h3>
                                {this.props.country_name == 'United States' ? 
                                <p className="is-size-5 subtitle has-text-white">
                                Data is sourced from the
                {' '}<a href="https://covidtracking.com/" target="_blank" rel="noopener noreferrer" style={{color: '#fff', fontWeight: 700}}>
                  COVID Tracking Project
                </a>. This page is in active development</p>
                                :<></>}    
                                <UpdateTable color="white"/>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section">

                <StyledTable className="container">
                    <EnhancedTable 
                        rows={rows} 
                        headCells={headCells} 
                        pageTemplate="advanced-country" 
                        tidy={this.state.numberFormat}
                        country_name={this.props.country_name}
                    />
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
    let cum_width =  1000
    let cum_height = 500
    let is_mobile = false
    
    if(window.innerWidth < 1408){ // FullHD
      overview_width =  740
      overview_height = 550
      cum_width = 860
        cum_height = 430
      is_mobile = false
    }
    if(window.innerWidth < 1216){ // Desktop
      overview_width =  600
      overview_height = 400
      cum_width = 720
        cum_height = 360
      is_mobile = false
    }
    if(window.innerWidth < 1024){
      overview_width =  450
      overview_height = 400
      cum_width = 565
        cum_height = 300
      is_mobile = false
    }

    if(window.innerWidth < 769){
      overview_width =  650
      overview_height = 450
      cum_width = 740
        cum_height = 450
      is_mobile = true   
    }
    if(window.innerWidth < 480){
      overview_width = 300
      overview_height = 300
      cum_width = 350
        cum_height = 300
       
    }



    //window.innerHeight
    
    this.setState({ overview_width, overview_height,cum_height, cum_width, is_mobile });
  
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