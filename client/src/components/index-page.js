import React from 'react'
import { Link } from "gatsby"
import EnhancedTable from './enhanced-table/enhanced-table'
import UpdateTable from './update-times'
import 'bulma/css/bulma.css'
import '../styles/custom.css'
import SEO from './seo'
import CumulativeGraphContainer from './cumulative-graph/cumulative-graph-container'



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
        const UpdateBlock = () => (
            <div className="box has-background-dark has-text-white updates">
                <h2 className="is-size-3">
                    <strong className="has-text-white">Updates: April 2</strong>
                </h2>
                <p>
                    <Link to='/united-states'>United States</Link>,{' '}
                    <Link to='/canada'>Canada</Link>,{' '} 
                    <Link to='/australia'>Australia</Link> and {' '}
                    <Link to='/china'>China</Link> pages now provide state level breakdowns and cumulative graphs.
                </p>
                <p>United States data includes hospitalizations and tests.</p>
                <p style={{marginTop: '15px'}}>
                    We are presently working on providing regional level data for {' '}
                    <Link to='/italy'>Italy</Link>, {' '}
                    <Link to='/spain'>Spain</Link>, and { }
                    <Link to='/new-zealand'>New Zealand</Link>. Please contact <a href="https://carlaiau.com/#section-4">us</a> with any feedback or requests.</p>
            </div>
        )

        return(
        <>
            <SEO title={' COVID-19: Showing why we must act early'}/>
            <div className="section">
                <div className="container">
                    <div className="columns">
                        <div className="column is-two-thirds">
                            <ContentBlock/>
                        </div>
                        <div className="column is-one-third">
                            <UpdateBlock/>

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
                        width={this.props.cum_width} 
                        height={this.props.cum_height} 
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
                        width={this.props.cum_width} 
                        height={this.props.cum_height} 
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
                    <EnhancedTable tidy={this.state.numberFormat}/>
                </div>
            </div>
    </>)
}

    
}
