import React, {Component} from 'react'
import Location from './Classes/Location';
import Vehicle from './Classes/Vehicle';
import Route from './Classes/Route';



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

    addVehcileForm() {
        return (
            <>
                <form id="addVehicle">
                    <input type="text" />
                </form>
            </>
        );
    }

    addRouteForm() {
        return (
            <>
                <form id="addRoute">
                    <input type="text" />
                    <input type="text" />
                </form>
            </>
        );
    }

    addPairForm() {
        return (
            <>
                <form id="addPair">
                    <input type="text" />
                    <input type="text" />
                    <input type="text" />
                </form>
            </>
        );
    }

    render() {
        var x = document.getElementById("addVehicle");
        console.log(x);
        return (
            <>
            <h1>This is the configuration page</h1>
            <button onClick={() => this.addVehicle()}>Add Vehicle</button>
            <button onClick={() => this.addRoute()}>Add Route</button>
            <button onClick={() => this.addPair()}>Pair Vehicle with route</button>
            <hr />
            <form id="addVehicle">
                <input type="text" />
            </form>
            {this.addVehcileForm()}
            {this.addRouteForm()}
            {this.addPairForm()}
            </>
        );
    }
}
export default Configurations;