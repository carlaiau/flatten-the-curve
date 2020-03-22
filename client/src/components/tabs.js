import React from "react"

export default class Tabs extends React.Component{

    constructor(props){
		super(props);
		this.state = {
            active: 'welcome',
            update_time: '5:12pm 22 March NZT',
            nz_time: '1:14pm 22 March NZT'
        }
    }

    render(){
        const {country_name} = this.props
        const {active, update_time, nz_time} = this.state
        return (
            <div className="box tab-container">
                <div className={active == 'welcome' ? '' : 'is-hidden'}>
                    <h2 className="is-size-3"><strong>We must act now!</strong></h2>
                    <h3 className="is-size-4 subtitle">
                        Compare your country to evolving situations in the rest of the world
                    </h3>
                    { ! country_name ?
                    <>
                        <p className="is-size-6">
                            If you are currently at the bottom of the curve you can use our tool to see how your situation may develop.
                            You can compare yourself to other countries that have already been in your position and observe how things esculate. 
                            
                        </p>
                        <p className="is-size-6">
                            Because of this explosive growth, it is critical we all do our best to flatten the curve, even when these early measures feel extreme.
                            Slowing the spread is our best tool to prevent catastrophic collapse of our medical systems.
                        </p>
                    

                        <p className="is-size-6" style={{marginBottom: '20px'}}>
                            For actionable steps to slow the spread please visit <a href="https://flattenthecurve.com/" target="_blank" rel="noopener noreferrer">Flattenthecurve.com</a>. 
                        </p>
                    </>
                    :
                    <></>
                    }
                    
                    <p className="is-size-7">Global data updated at <strong>{update_time}</strong></p>
                    
                    {country_name == 'New Zealand' ?
                    <p className="is-size-7"><strong>New Zealand</strong> data updated at <strong>{nz_time}</strong></p>
                    :
                    <></>
                    }
                    
                    { ! country_name ?
                    <>
                        <p className="is-size-7">
                            Please use the dropdown in the header for country-specific comparisons and projections. 
                            
                        </p>
                        
                    </>
                    :
                    <></>
                    }
                    <p className="is-size-7">We present data for countries that have populations larger than 1 million and at least 10 confirmed cases.</p>
                    
                    
                    
                </div>
                <div className={active =='about' ? '' : 'is-hidden'}>
                <p className="is-size-6">
                        This is a work in Progress. Code is freely available on <a href="https://github.com/carlaiau/flatten-the-curve"  target="_blank" rel="noopener noreferrer">
                        GitHub</a> and pull requests are welcome.
                    </p>
                    <p className="is-size-6">
                        COVID-19 Data belongs to <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank" rel="noopener noreferrer">Johns Hopkins University</a> 
                    </p>
                    <p className="is-size-6">
                        If your country is not shown but should be, please contact us!
                    </p>
                </div>
                <div className={active =='forecast' ? '' : 'is-hidden'}>
                
                    <p className="is-size-6">
                    The forecasts below show a future projection of COVID-19 in the selected country of {country_name}. 
                    This is based on the historical growth data of each country that is currently ahead of {country_name} in the outbreak.
                    </p>
                    <p className="is-size-6">
                    Viewing this can offer unique insights into the range of possible outcomes. The forecast is not based on epidemiological models, just on historical data experienced by other countries.
                    </p>
                    <p className="is-size-6">
                        The forecast does not take into account the relative doubling time of each country.
                    </p>
                    <p className="is-size-6">
                        Forecasting accuracy depends on a multitude of factors such as the number and speed of tests done, the quality of the case tracking, the testing of tracked cases, and the support given to those who need to go into isolation.
                    </p>
                </div> 
            </div>
        )
    }
}
