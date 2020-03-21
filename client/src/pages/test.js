import React from 'react'
import Hero from '../components/hero'
import CumulativeGraph from '../components/cumulative-graph'

import 'bulma/css/bulma.css'
import '../styles/custom.css'



export default class TestPage extends React.Component{
    

    render(){
        
        return(<>
            <Hero selected_country=''/>
            <div className="container">
        
                <div className="columns" style={{paddingTop: '30px', alignItems: 'center'}}>
                    <div className="column">
                        <h3 className="is-size-3">
                            Cumulative number of cases
                        </h3>
                        <p className="is-size-5">
                            by number of days since 100th case
                        </p>
                    </div>
                    <div className="column is-three-quarters">
                        <div className="box"><CumulativeGraph/></div>
                    </div>
                </div>

                <div className="columns" style={{paddingTop: '30px', alignItems: 'center'}}>
                    <div className="column">
                        <h3 className="is-size-3">
                            Cumulative number of cases
                        </h3>
                        <p className="is-size-5">
                            by number of days since 100th case
                        </p>
                    </div>
                    <div className="column is-three-quarters">
                        <div className="box"><CumulativeGraph scale="linear"/></div>
                    </div>
                </div>

                <div className="columns" style={{paddingTop: '30px', paddingBottom: '30px', alignItems: 'center'}}>
                    <div className="column">
                        <h3 className="is-size-3">
                            Cumulative number of deaths
                        </h3>
                        <p className="is-size-5">
                            by numbers of days since 10th deaths
                        </p>
                    </div>
                    <div className="column is-three-quarters">
                        <div className="box">
                            <CumulativeGraph field="deaths"/>  
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    }
    
}
