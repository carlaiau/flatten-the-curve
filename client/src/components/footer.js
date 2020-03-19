import React from 'react'

const Footer = () => (
    <section className="section  has-background-dark has-text-white footer">
        <div className="container">
            <h2 className="is-size-4">This is work in progress</h2>
            <p className="is-size-7">COVID daily updated infection data is from the <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank" rel="noopener noreferrer">John Hopkins repo</a></p>
            <p className="is-size-7">Population data sourced from Population data sourced from <a href="https://data.worldbank.org/indicator/SP.POP.TOTL" target="_blank" rel="noopener noreferrer">The World Bank</a></p>
            <p className="is-size-7">Favicon sourced from {' '}
              <a href="https://www.iconfinder.com/becris" target="_blank" rel="noopener noreferrer">
                becris
              </a> {' '}
              via Iconfinder's {' '}
              <a href="https://www.iconfinder.com/p/coronavirus-awareness-icons" target="_blank" rel="noopener noreferrer">
                Coronavirus Awareness Icon Campaign
              </a>
            </p>
            <p className="is-size-4" style={{marginTop: '10px'}}>Code available at  <a href="https://github.com/carlaiau/flatten-the-curve" target="_blank" rel="noopener noreferrer">Github</a>.</p>
            <p className="is-size-4">
              Currently in development by <a href="https://carlaiau.com/">Carl Aiau</a>
            </p>
        </div>
    </section>
)
export default Footer