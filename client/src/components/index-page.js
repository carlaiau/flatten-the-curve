import React from 'react'
import { Link } from "gatsby"
import EnhancedTable from './enhanced-table/enhanced-table'
import UpdateTable from './update-times'
import 'bulma/css/bulma.css'
import '../styles/custom.css'
import SEO from './seo'
import CumulativeGraphContainer from './cumulative-graph/cumulative-graph-container'



export default class IndexPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected_country: '',
            numberFormat: new Intl.NumberFormat(),
            cum_width: 800,
            cum_height: 182

        }
    }


    render() {

        const ContentBlock = () => (
            <div className="box">
                <h2 className="is-size-3"><strong>Crushing The curve!</strong></h2>
                <p className="is-size-6" style={{ marginBottom: '20px' }}>
                    <strong>
                        Apologies for delays in updates. I was manually inputting the New Zealand daily updates.
                        I have removed the need for this which will allow for more consistent international updates.
                        If any developers want to continue active development of this project please get in touch.</strong>
                </p>
                <p className="is-size-6" style={{ marginBottom: '10px' }}>
                    For actionable steps to slow the spread please visit <a href="https://flattenthecurve.com/" target="_blank" rel="noopener noreferrer">Flattenthecurve.com</a>.
                </p>
                <p className="is-size-6" style={{ marginBottom: '20px' }}>
                    Please use the dropdown in the header for country-specific comparisons and projections.
                    We present data for countries that have populations larger than 1 million and at least 10 confirmed cases.
                </p>
                <UpdateTable />
            </div>
        )
        const UpdateBlock = () => (
            <div className="box has-background-dark has-text-white updates">
                <h2 className="is-size-3">
                    <strong className="has-text-white">Updates</strong>
                </h2>
                <p style={{ marginTop: '10px' }}><strong>August 7</strong></p>
                <p>Updated with recent data and changed the accumulation base values. Data not free from bugs.</p>
                <p style={{ marginTop: '10px' }}><strong>June 22</strong></p>
                <p><Link to='/new-zealand'>New Zealand</Link> has a few active cases. Site will be updated more regularly.</p>
                <p style={{ marginTop: '10px' }}><strong>June 8</strong></p>
                <p><Link to='/new-zealand'>New Zealand</Link> is offically out of lockdown with zero active cases. International and US data updated.</p>
            </div>

        )

        return (
            <>
                <SEO title={' COVID-19: Showing why we must act early'} />
                <div className="section">
                    <div className="container">
                        <div className="columns">
                            <div className="column is-two-thirds">
                                <ContentBlock />
                            </div>
                            <div className="column is-one-third">
                                <UpdateBlock />

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
                                'Italy',
                                'Germany',
                                'Sweden',
                                'Brazil',
                                'India',
                                'Spain',
                                'United States',
                                'United Kingdom',
                            ]}
                            accumulateFrom={50000}
                            accumulateOptions={[1000, 5000, 10000, 50000, 100000]}


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
                            accumulateFrom={1000}
                            accumulateOptions={[100, 500, 1000, 5000, 10000]}

                        />
                        <div className="columns">
                            <div className="column is-narrow is-one-third">
                                <div className="box has-background-success is-full">
                                    <h3 className="is-size-3 has-text-white title">World Overview</h3>
                                    <p className="is-size-6 has-text-white subtitle">
                                        Clicking on any country will navigate you to that country summary.
                                </p>
                                    <UpdateTable color="white" />
                                    <p className="is-size-7 has-text-white">
                                        Populations must be larger than 1 million with 10 confirmed cases
                                </p>
                                </div>
                            </div>
                        </div>
                        <EnhancedTable tidy={this.state.numberFormat} />
                    </div>
                </div>
            </>)
    }


}
