import React from 'react'
import { navigate } from "@reach/router"
const Hero = ({selected_country, countries, changeFn}) => {

  return (
    <section className="hero is-info ">
      <div className="hero-body">
        <div className="container">
          <div className="columns">
            <div className="column">
              <h1 className="title">
                Flatten The Curve
              </h1>
              <p className="subtitle is-size-5">COVID-19 by the numbers</p>  
              <p className="is-size-6">Data updated at <strong className="has-text-white">4:13pm March 19 2020 NZT</strong></p>
            </div>
            <div className="column is-narrow">
              <div className="field">
                <label className="label has-text-white is-size-5">Choose your country</label>
                <div className="control">
                  <div className="select is-medium">
                    <select value={selected_country} onChange={(e) => {
                      navigate(`/${e.target.value.toLowerCase().replace(/\s+/g, "-")}`)
                    }}>
                      {countries.map( ({country_name } ) => (
                        <option key={country_name} value={country_name}>{country_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>  
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default Hero