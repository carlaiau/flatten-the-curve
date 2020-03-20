import React from 'react'
import { parseJSON, formatDistance } from "date-fns"
import GridItemDetail from './grid-item-detail'
import styled from '@emotion/styled'

export default class GridItem extends React.Component{

    constructor(props){
		super(props);
		this.state = {
            expanded: false,
            details_open: false
        }
    }

    

    render(){
        const TallyTable = styled('table')`
            width: 100%;
            background: none;
            color: #fff;
            thead{
                th{
                    font-weight: 400;
                    &.right{
                        text-align: right;
                        
                    }
                }
            }
            tbody{
                th{
                    font-weight: 700;
                }
                td{
                    font-weight: 700;
                    text-align:right;
                    padding-right: 0 !important;
                }
            }
            th, td{
                padding: 0.25em 0 !important;
                border: none !important;
                margin-left: 0;
                padding-left: 0;
                line-height: 1;
                color: #fff !important;
            }
        `
        const DeathToll = styled('div')`
            align-items: center;
            p{
                color: #fff;
                strong{
                    color: #fff;
                }
            }
            .tallies{
                p{
                    width: 100%;
                    text-align: right;
                    font-weight: 400;
                    strong{
                        font-weight: 700;
                        margin-left: 3px;
                    }
                    margin-bottom: 5px;
                }
                
            }
        `
        const { country, active_country, per, field, tidy } = this.props
        return (
        <>
        <div className='column is-one-third'>
            <div className="box has-background-success has-text-white country">
                <div className="content" style={{position: 'relative'}}>
                    <h2 className="is-size-3  has-text-white" style={{marginTop: 0}}>{country.country_name}</h2>
                    <p className="is-size-6 has-text-white">
                        {formatDistance(parseJSON(country.earliest.date), new Date() ) } ago 
                        {' '} had similar {per === 'total' ? ' total': 'per million'} 
                        {' '}{field === 'deaths' ? 'deaths': 'confirmed cases'} as
                        {' '} {active_country.country_name}
                    </p>
                    <DeathToll className="columns">
                        <div className="column is-narrow">
                            <p>
                                <strong className="is-size-4">{tidy((country.population / 1000000).toFixed(0))}</strong><br/>
                                million people
                            </p>
                        </div>
                        <div className="column tallies">
                            <p>
                                <strong>1</strong> case per
                                <strong>{tidy(( country.population / country.highest.confirmed ).toFixed(0))}</strong>
                            </p>
                            <p>
                                <strong>1</strong> death per 
                                <strong>{tidy(( country.population / country.highest.deaths ).toFixed(0))}</strong>
                            </p>
                        </div>
                    </DeathToll>
                    
                    
                    <TallyTable>
                        <thead>
                            <tr>
                                <th className={per != 'total' ? 'is-hidden': ''}>Total</th>
                                <th className={per == 'total' ? 'is-hidden': ''}>Per Million</th>
                                <th className="right">
                                    {formatDistance(parseJSON(country.earliest.date), new Date() ) } ago
                                </th>
                                <th className="right">Now</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tr>
                        <th>Confirmed</th>
                        <td className={per != 'total' ? 'is-hidden': ''}>
                            {tidy(country.earliest.confirmed)}
                        </td>
                        <td className={per != 'total' ? 'is-hidden': ''}>
                            {tidy(country.highest.confirmed)}
                        </td>

                        <td className={per == 'total' ? 'is-hidden': ''}>
                            {country.earliest.confirmed_per_mil ? country.earliest.confirmed_per_mil.toFixed(2): ''}</td>
                        <td className={per == 'total' ? 'is-hidden': ''}>
                            {country.highest.confirmed_per_mil ? country.highest.confirmed_per_mil.toFixed(2): ''}</td>
                        </tr>
                        <tr>
                        <th>Deaths</th>
                        <td className={per != 'total' ? 'is-hidden': ''}>
                            {tidy(country.earliest.deaths)}
                        </td>
                        <td className={per != 'total' ? 'is-hidden': ''}>
                            {tidy(country.highest.deaths)}
                        </td>
                        
                        
                        <td className={per == 'total' ? 'is-hidden': ''}>{country.earliest.deaths_per_mil ? country.earliest.deaths_per_mil.toFixed(2): ''}</td>
                        <td className={per == 'total' ? 'is-hidden': ''}>{country.highest.deaths_per_mil ? country.highest.deaths_per_mil.toFixed(2): ''}</td>
                        </tr>
                        <tr>
                        <th>Recovered</th>
                        <td className={per != 'total' ? 'is-hidden': ''}>{tidy(country.earliest.recovered)}</td>
                        <td className={per != 'total' ? 'is-hidden': ''}>{tidy(country.highest.recovered)}</td>
                        
                        <td className={per == 'total' ? 'is-hidden': ''}>{country.earliest.recovered_per_mil ? country.earliest.recovered_per_mil.toFixed(2): ''}</td>
                        <td className={per == 'total' ? 'is-hidden': ''}>{country.highest.recovered_per_mil ? country.highest.recovered_per_mil.toFixed(2): ''}</td>
                        </tr>
                    </tbody>

                    </TallyTable>
                    { country.highest.confirmed_per_mil > active_country.highest.confirmed_per_mil ?
                        <button className={`button ${this.state.expanded ? 'has-background-newt' : 'is-dark'} has-text-white`} onClick={() => this.setState({expanded: ! this.state.expanded})} style={{width: '100%', maxWidth: '100%', height: '40px', border: 'none'}}
                        >
                        { this.state.expanded ? 'Close Forecast and Progresion' : 'View Forecast and  Progression' }
                        </button>
                    :
                        <button className='button has-background-success is-size-7 has-text-white' style={{width: '100%', maxWidth: '100%', height: '40px'}}>
                        Insufficient confirmed cases per million for forecast
                        </button>
                    }
                </div>
            </div>
        </div>
        
        { this.state.expanded ?

            <GridItemDetail
                active={active_country} 
                compare={country}
                width={this.props.width}
                tidy={tidy}
                details_open={this.state.details_open}
                detailsFn={(() => this.setState({details_open: true}))}
                closeFn={() => this.setState({expanded: false})}
            />
        : ''
        }
        </>
        
        )
    }
}
