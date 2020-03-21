import React from "react"

export default class Tabs extends React.Component{

    constructor(props){
		super(props);
		this.state = {
            active: 'welcome',
            update_time: '2:45pm 21 March NZT',
            nz_time: '11:26am 21 March NZT'
        }
    }

    render(){
        const {country_name, min_days} = this.props
        const {active, update_time, nz_time} = this.state
        return (
            <div className="box tab-container">
                <div className="tabs">
                    <ul>
                        <li className={active == 'welcome' ? 'is-active' : ''}>
                            <a onClick={(e)=> this.setState({active: 'welcome'})}>Welcome</a>
                        </li>
                        <li className={active == 'about' ? 'is-active' : ''}>
                        <a onClick={(e)=> this.setState({active: 'about'})}>About</a>
                        </li>
                        <li className={active == 'forecast' ? 'is-active' : ''}>
                        <a onClick={(e)=> this.setState({active: 'forecast'})}>Forecasts</a>
                        </li>
                    </ul>
                </div>
                <div className={active == 'welcome' ? '' : 'is-hidden'}>
                    <p className="is-size-6">The goal of this site is to motivate people to take actionable steps now to slow the spread of COVID-19.</p>
                    
                    <p className="is-size-6">Global data updated at <strong>{update_time}</strong></p>
                    {country_name == 'New Zealand' ?
                    <p className="is-size-6"><strong>New Zealand</strong> data updated at <strong>{nz_time}</strong></p>
                    :
                    <></>
                    }
                    <p className="is-size-6">
                        Inspired by <a href="https://flattenthecurve.com/" target="_blank" rel="noopener noreferrer">Flattenthecurve.com</a>. 
                        Please visit this site for actionable steps to slow the spread.
                    </p>
                    
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
                        We support countries with over 1 million population and 10 confirmed cases. 
                        If your country is not shown but should be, please contact us!
                    </p>
                    <p>Countries below were at a similar level as {country_name} at least {min_days} days ago.</p>
                </div>
                <div className={active =='forecast' ? '' : 'is-hidden'}>
                
                    <p className="is-size-6">
                    The forecasts below show a future projection of COVID-19 in the selected country of {country_name}. 
                    This is based on the historical growth data of each country that is currently ahead of {country_name} in the outbreak.
                    </p>
                    <p className="is-size-6">
                    Viewing this can offer unique insights into the range of possible outcomes. Not based on epidemiological models, only on historical data experienced by other countries.
                    </p>
                    <p className="is-size-6">
                        The potential forecast does not take into account the relative doubling time of each country.
                    </p>
                    <p className="is-size-6">
                        The true forecast depends on a multitude of factors such as the number and speed of tests done, the quality of the case tracking, the testing of tracked cases, and the support given to those who need to go into isolation.
                    </p>
                </div> 
            </div>
        )
    }
}