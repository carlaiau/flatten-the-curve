import React, { useContext } from 'react'
import { Link } from "gatsby"
import logo from '../images/icon_green_180.png'
import {GlobalStateContext} from "../context/GlobalContextProvider"
import { navigate } from "@reach/router"


const Hero = ({selected_country, selectFn}) => {

  const {select_countries} = useContext(GlobalStateContext)
  const links = [
    {   path: '/',                label: 'World'    },
    {   path: '/new-zealand',     label: 'NZ'       },
    {   path: '/australia',       label: 'AU'       },
    {   path: '/united-kingdom',  label: 'UK'       },
    {   path: '/united-states',   label: 'US'       }
    
  ]
  return ( 
    <React.Fragment>
      <section className="hero is-dark is-medium">
        <div className="hero-head">
          <nav className="navbar">
            <div className="container">
              <div className="navbar-brand">
                <Link to='/' className="navbar-item">
                  <img src={logo} alt="Logo"/>
                    <div>
                      <h1 className="title is-size-5">Flatten The Curve</h1>
                    </div>
                </Link>
              </div>
              <div className="navbar-menu">
                <div className="navbar-end">
                  {
                    links.map( (link, i) => (
                      <Link key={i} to={link.path} className="navbar-item" activeClassName="is-active">{link.label}</Link>
                    ))

                  }
                </div>
              </div>
              <div className="country-selector is-narrow navbar-item">
                <div className="field">
                  <div className="control">
                    <div className="select">
                      <select value={selected_country} onChange={e => {
                          if(e.target.value) navigate(`/${e.target.value.toLowerCase().replace(/\s+/g, "-")}`)
                          else navigate('/')
                      }}
                      >
                        <option value=''>World</option>
                        {select_countries.map( ({country_name } ) => (
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