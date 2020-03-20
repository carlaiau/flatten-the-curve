import React from 'react'
import { navigate } from "@reach/router"
import { Link } from "gatsby"
import logo from '../images/icon_512.png'

const Hero = ({selected_country, countries}) => {
  const links = [
    //{   path: '/',                label: 'World'    },
    {   path: '/new-zealand',     label: 'NZ'       },
    {   path: '/australia',       label: 'AU'       },
    {   path: '/united-kingdom',  label: 'UK'       },
    {   path: '/united-states',   label: 'US'       }
    
  ]
  return ( 
    <React.Fragment>
      <section class="hero is-white is-medium">
        <div class="hero-head">
          <nav class="navbar">
            <div class="container">
              <div class="navbar-brand">
                <a class="navbar-item">
                  <img src={logo} alt="Logo"/>
                    <div>
                    <h1 className="title is-size-5">Flatten The Curve</h1>
                  </div>
                  
                </a>
              </div>
              <div class="navbar-menu">
                <div class="navbar-end">
                  {
                    links.map( link => (
                      <Link to={link.path} className="navbar-item" activeClassName="is-active">{link.label}</Link>
                    ))

                  }
                </div>
              </div>
              <div className="country-selector is-narrow navbar-item">
                    <div className="field">
                      <div className="control">
                        <div className="select">
                          <select value={selected_country} onChange={(e) => {
                            if(e.target.value) navigate(`/${e.target.value.toLowerCase().replace(/\s+/g, "-")}`)
                          }}>
                            <option value=''>Choose your country</option>
                            {countries.map( ({country_name } ) => (
                              <option key={country_name} value={country_name}>{country_name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>  
                  </div>
            </div>
          </nav>
        </div>
      </section>
    </React.Fragment>
    

  )
}
export default Hero