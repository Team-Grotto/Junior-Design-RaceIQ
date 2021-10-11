import React, {Component} from 'react'
import Location from './Classes/Location';
import Vehicle from './Classes/Vehicle';
import Route from './Classes/Route';
import AddVehicle from './addVehicle';
import AddRoute from './AddRoute';
import AddPair from './AddPair';

class Configurations extends Component {
    
    constructor(props) {
        
        super(props);
        this.state = {
            // addState refers to what we are adding in the file:
            // 0 - nothing, 1 - vehicle, 2 - Route, 3 - Pair
            addState: 0,
            vehicleList: [],
            routeList: []

        };
    }
    
    addVehicle() {
        this.setState({addState: 1});
    }
    addRoute() {
        this.setState({addState: 2});
    }
    addPair() {
        this.setState({addState: 3});
    }

    addJSX() {
        if (this.state.addState === 1) {
            return <AddVehicle />;
        } else if(this.state.addState === 2) {
            return <AddRoute />
        } else if(this.state.addState === 3) {
            return <AddPair />
        } else {
            return null;
        }
    }

    render() {
        var x = document.getElementById("addVehicle");
        console.log(x);
        return (
            <div>
                <h1>This is the configuration page</h1>
                <button onClick={() => this.addVehicle()}>Add Vehicle</button>
                <button onClick={() => this.addRoute()}>Add Route</button>
                <button onClick={() => this.addPair()}>Pair Vehicle with route</button>
                <hr />
                {this.addJSX()}
            </div>
        );
    }
}
export default Configurations;