import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookSquare, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { Link } from "gatsby"
import styled from '@emotion/styled'
import logo from '../images/icon_green_180.png'
import {GlobalStateContext} from "../context/GlobalContextProvider"
import { navigate } from "@reach/router"


const Hero = ({selected_country, selectFn}) => {

  const {select_countries} = useContext(GlobalStateContext)
  const links = [
    {   path: '/',                label: 'World'    },
    {   path: '/new-zealand',     label: 'NZL'       },
    {   path: '/australia',       label: 'AUS'       },
    {   path: '/united-kingdom',  label: 'GBR'       },
    {   path: '/united-states',   label: 'USA'       },
    {   path: '/sweden',   label: 'SWE'       },
    {   path: '/canada',          label: 'CAN'       },
    {   path: '/italy',           label: 'ITA'       },
    {   path: '/spain',           label: 'ESP'       },
    {   path: '/germany',         label: 'DEU'       },
    {   path: '/france',          label: 'FRA'       },
    {   path: '/china',           label: 'CHN'       },
    {   path: '/south-korea',     label: 'KOR' },
    
  ]

  const Share = styled('div')`
    p{
      margin: 0;
      margin-right: 5px;
      text-transform: uppercase;
      font-weight: 700;
      @media screen and (max-width: 768px){
        margin-top: -4px;
      }
    }
    .icon{
      &.facebook{
          color: #3b5998;
      }
      &.twitter{
          color: #1DA1F2;
      }
      
    }
    .navbar-item{
      transition: 0.25s;
      &:hover{
        color: inherit;
        border-radius: 0 0 5px 5px;
        background: #fff;
      }
    }
    padding-right: 5px;
    padding-bottom: 0;
    @media screen and (max-width: 768px){
      padding-top: 10px;
    }
  `
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
                      <Link key={i} to={link.path} className="navbar-item is-size-7" activeClassName="is-active">{link.label}</Link>
                    ))

                  }
                </div>
              </div>
              <div className="country-selector is-narrow navbar-item">
                <div className="field">
                  <div className="control">
                    <div className="select" style={{color: "#363636"}}>
                      <select value={selected_country} onChange={e => {
                          if(e.target.value) navigate(`/${e.target.value.toLowerCase().replace(/\s+/g, "-")}`)
                          else navigate('/')
                      }}
                      >
                        <option value=''>World</option>
                        {select_countries.map( ({name } ) => (
                          <option key={name} value={name}>{name}</option>
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
      <div className="section" style={{paddingTop: 0, paddingBottom: 0}}>
        <div className="container">
          <div className="columns">
            <div className="column">
              <Share style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
                <p className="is-size-7">Share {selected_country ? selected_country: ''}</p>
                  <a 
                    className="navbar-item" 
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://flattenthecurve.co.nz/${selected_country ? 
                      selected_country.toLowerCase().replace(/\s+/g, "-"): ''}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span className="icon facebook">
                      <FontAwesomeIcon icon={faFacebookSquare} size="lg"/>
                    </span>
                  </a>
                  <a className="navbar-item"
                    href={`https://twitter.com/intent/tweet?url=https://flattenthecurve.co.nz/${selected_country ? 
                      selected_country.toLowerCase().replace(/\s+/g, "-"): ''}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <span className="icon twitter">
                      <FontAwesomeIcon icon={faTwitter} size="lg"/>
                    </span>
                  </a>  
              </Share>
            </div> 
          </div>
        </div>
      </div>
      
    </React.Fragment>
    

  )
}
export default Hero