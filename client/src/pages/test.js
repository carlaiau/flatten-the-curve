import React from 'react'
import Hero from '../components/hero'
import CumulativeGraph from '../components/cumulative-graph'

import 'bulma/css/bulma.css'
import '../styles/custom.css'



export default class TestPage extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
          selected_country: '',
          numberFormat: new Intl.NumberFormat(),
          limit: 60,
          width:  800,
          height: 182,
          scale: 'linear'
      }
    }

    render(){
        
        return(<>
            <Hero selected_country=''/>
            <div className="container">
                <div className="columns" style={{marginTop: '10px'}}>
                    <div className="column is-full">
                        <div className="box">
                            <div className="field">
                                <div className="control">
                                    <div className="select">
                                    <select value={this.state.scale} onChange={e => {this.setState({scale: e.target.value})}}>
                                        <option value='linear'>Linear</option>
                                        <option value='log'>Log</option>
                                    </select>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
                <div className="columns" style={{paddingTop: '30px', alignItems: 'center'}}>
                    <div className="column">
                        <div className="box has-background-success">
                            <h3 className="is-size-2 has-text-white title">
                                Cumulative number of cases
                            </h3>
                            <p className="is-size-5 subtitle has-text-white">
                                by number of days since 100th case
                            </p>
                        </div>
                    </div>
                    <div className="column is-three-quarters">
                        <CumulativeGraph scale={this.state.scale}/>
                    </div>
                </div>

                <div className="columns" style={{paddingTop: '30px', paddingBottom: '30px', alignItems: 'center'}}>
                    <div className="column">
                        <div className="box has-background-success">
                            <h3 className="is-size-2 has-text-white title">
                            Cumulative number of deaths
                            </h3>
                            <p className="is-size-5 subtitle has-text-white">
                            by numbers of days since 10th deaths
                            </p>
                        </div>
                    </div>
                    <div className="column is-three-quarters">
                        <CumulativeGraph field="deaths" scale={this.state.scale}/>  
                    </div>
                </div>
            </div>
        </>
    )
    }
    
}
