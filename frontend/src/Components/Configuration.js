import React, {Component} from 'react'
import Config from './Classes/Config';

import Route from './Classes/Route';
import Vehicle from './Classes/Vehicle';

import Modal from 'react-modal';

class Configuration extends Component {
    
    constructor(props) {
        
        super(props);
        this.state = {
            routes: [],
            vehicles: []
        };

        // NOTE: Modifying state like this can *probably* safely be done only in the constructor
        this.state.routes.push(new Route(1, "Cloudman", "CRC"))
        this.state.vehicles.push(new Vehicle("ABCDXYZ1234", 1))
    }

    newVehicleModal() {
        return null
    }

    renderRoutes() {
        return (
            <>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Route #</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.routes.map((route, index) => 
                            <tr key={index + 1}>
                                <td>{index + 1}</td>
                                <td>{route.start}</td>
                                <td>{route.end}</td>
                                <td>
                                    <button className="btn btn-secondary btn-sm me-2">Edit</button>
                                    <button className="btn btn-secondary btn-sm">Delete</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button className="btn btn-primary mb-4">Add Route</button>
                <br />
            </>
        )
    }

    renderVehicles() {
        return (
            <>
                <table className="table">
                    <thead>
                        <tr>
                            <th>VIN</th>
                            <th>Asssigned Route</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.vehicles.map((vehicle, index) => 
                            <tr key={index}>
                                <td>{vehicle.vin}</td>
                                <td>{vehicle.assignedRoute}</td>
                                <td>
                                    <button className="btn btn-secondary btn-sm me-2">Edit</button>
                                    <button className="btn btn-secondary btn-sm">Delete</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button className="btn btn-primary mb-4">Add Vehicle</button>
                <br />
            </>
        )
    }

    render() {
        return (
            <div className="container">
                <h1>Simulation Configuration</h1>
                <hr />
                <button className="btn btn-primary mb-2">Clear All</button>
                <h2>Add Routes</h2>
                {this.renderRoutes()}
                <h2>Add Vehicles</h2>
                {this.renderVehicles()}

                <div className="d-flex justify-content-center">
                    <button className="btn btn-primary btn-lg mb-4">Start Simulation!</button>
                </div>

                <br />
                <button className="btn btn-secondary me-2">Save Config</button>
                <button className="btn btn-secondary">Load Config</button>
            </div>
        );
    }
}
export default Configuration;