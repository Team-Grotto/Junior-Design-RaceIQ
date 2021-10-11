import React, {Component} from 'react'
import Location from './Classes/Location';
import Vehicle from './Classes/Vehicle';
import Route from './Classes/Route';

class Configurations extends Component {
    addVehicle() {
        console.log("test vehicle");
    }
    addRoute() {
        console.log("test route");
    }


    render() {
        return (
            <>
            <h1>This is the configuration page</h1>
            <button onClick={() => this.addVehicle()}>Add Vehicle</button>
            <button onClick={() => this.addRoute()}>Add Route</button>
            <button onClick={() => this.addEmptyItem()}>Pair Vehicle with route</button>
            </>
        );
    }
}
export default Configurations;