
import React from "react"
import Hero from "./hero"
import Footer from "./footer"
export default class Layout extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            overview_width: 0,
            overview_height: 0,
            grid_width: 0,
            grid_height: 0,
            cum_width: 0,
            cum_height: 0,
            is_mobile: 0,
        }
    }


    // Add the responsive related props to the children
    render(){
        const {overview_width, overview_height, grid_width, grid_height, cum_width, cum_height, is_mobile} = this.state
        return (
            <>
            <Hero 
                selected_country={this.props.selected_country}
            />
            {React.Children.map(this.props.children, child => React.cloneElement(child, {
                overview_width,
                overview_height,
                grid_width,
                grid_height,
                cum_width,
                cum_height,
                is_mobile,
            }))}
            <Footer/>
            </>
        )
    }

    /**
    * Calculate & Update state of new dimensions
    */
    updateDimensions = () => {  

        let overview_width =  860
        let overview_height = 500
        let cum_width =  1000
        let cum_height = 500
        let grid_width = 391
        let grid_height = 200
        let is_mobile = 0
        
        if(window.innerWidth < 1408){ // FullHD
            overview_width =  740
            overview_height = 550
            cum_width = 860
            cum_height = 430
            grid_width = 350
            grid_height = 180
            is_mobile = 1
        }
        if(window.innerWidth < 1216){ // Desktop
            overview_width =  600
            overview_height = 400
            cum_width = 720
            cum_height = 360
            grid_width = 285
            grid_height = 160
            is_mobile = 1
        }
        if(window.innerWidth < 1024){
            overview_width =  450
            overview_height = 400
            cum_width = 565
            cum_height = 300
            grid_width = 200
            grid_height = 120
            is_mobile = 1
        }

        if(window.innerWidth < 769){
            overview_width =  650
            overview_height = 450
            cum_width = 740
            cum_height = 450
            grid_width = 600
            grid_height = 300
            is_mobile = 1
        }
        if(window.innerWidth < 480){
            overview_width = 300
            overview_height = 300
            cum_width = 350
            grid_width = 280
            grid_height = 150  
            cum_height = 300
        }    
        this.setState({ overview_width, overview_height,cum_height, grid_width, grid_height, cum_width, is_mobile });
  
    }

    /**
    * Add event listener
    */
    componentDidMount = () => {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }

    /**
    * Remove event listener
    */
    componentWillUnmount = () => {
        window.removeEventListener("resize", this.updateDimensions);
    }
}