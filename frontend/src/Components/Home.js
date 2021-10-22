import React, {Component} from 'react'

class Home extends Component {
    render() {
        return (
            <>
                <h1>Welcome to our simulator!</h1>
                <a href="#/configuration" className="btn btn-link">Configuration Page</a>
                <br />
                <a href="#/simulation" className="btn btn-link">Simulation Page</a>
            </>
        );
    }
}
export default Home;