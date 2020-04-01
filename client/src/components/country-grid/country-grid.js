import React from "react"

import GridBar from "./grid-bar"
import GridItem from "./grid-item"
import GetTopCountries from '../../utils/get-top-countries'

export default class CountryGrid extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            max_count: 30,
            field: this.props.field || 'confirmed',
            per: this.props.per || 'total',
            sort: this.props.sort || 'worst'
        }
    }


    render(){
        const active_country = this.props.active_country
        
        const { per, field, sort, } = this.state
        let full_field_name = field === 'confirmed' ? 
            per === 'total' ? 'confirmed' : 'confirmed_per_mil' :
            per === 'total' ? 'deaths' : 'deaths_per_mil'

    
        const topCountries = GetTopCountries({ 
            max_count: this.state.is_mobile ? this.state.max_count : 100,
            countries: this.props.countries,
            active_country, 
            field: full_field_name, 
            sort, 
        })


        return ( 
        <>
            <GridBar 
                active_name={active_country.name}
                max_count={this.props.is_mobile ? this.state.max_count : 100}
                per={per}
                field={field}
                sort={sort}
                length={topCountries.length}
                fieldFn={e => this.setState({field: e.target.value})}
                perFn={e => this.setState({per: e.target.value})}
                sortFn={e => this.setState({sort: e.target.value})}
            />
            <section className="section">
                <div className="container">
                    <div className="columns" style={{flexWrap: 'wrap'}}>
                        { topCountries.map( (country, i) => (
                            <GridItem 
                            country={country} 
                            key={i}
                            active_country={active_country} 
                            per={per}
                            field={field}
                            tidy={this.props.tidy}
                            width={this.props.grid_width}
                            height={this.props.grid_height}
                            />
                        ))}              
                    </div>
                </div>
            </section>
            </>)
    }


}