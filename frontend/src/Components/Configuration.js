import React, {Component} from 'react'

import Route from './Classes/Route';
import Vehicle from './Classes/Vehicle';

import Modal from 'react-modal';

const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: "40%"
    },
};

class Configuration extends Component {
    
    constructor(props) {
        
        super(props);
        this.state = {
            routes: [],
            vehicles: [],
            showAddVehicleModal: false,
            showEditVehicleModal: false,
            showAddRouteModal: false,
            showEditRouteModal: false,
            editingVehicleId: null,
            editingRouteId: null
        };

        // NOTE: Modifying state like this can *probably* safely be done only in the constructor
        this.state.routes.push(new Route("1", "Cloudman", "CRC"))
        // this.state.vehicles.push(new Vehicle("ABCDXYZ1234", 1))
    }

    getIndexFromRouteId(routeId) {
        return this.state.routes.findIndex(route => route.id === routeId)
    }

    getIndexFromVin(vin) {
        return this.state.vehicles.findIndex(vehicle => vehicle.vin === vin)
    }

    // Make POST to backend and update state (called by a submit call)
    addVehicle = (event) => {
        event.preventDefault() // Prevents weird stuff that usually happens after onSubmit

        let vin = event.target.elements.vin.value
        let assignedRoute = event.target.elements.assignedRoute.value

        // TODO: MAKE POST REQUEST AND DO INPUT VALIDATION!

        // If all checks pass...
        // Placeholder code - usually would be returned by backend
        if (true) {
            let newVehicles = this.state.vehicles.concat(new Vehicle(vin, assignedRoute))
            this.setState({
                vehicles: newVehicles
            })
            this.closeAddVehicleModal()
        }

    }

    // Make POST to backend and update state
    editVehicle(vin) {
        // TODO: Implement this!
    }

    // Make POST to backend and update state
    deleteVehicle(vin) {
        // TODO: MAKE POST REQUEST

        // If all checks pass...
        if (true) {
            // This is placeholder code, normally we would use the values returned by backend
            // Deep copy for safety
            let newVehicles = JSON.parse(JSON.stringify(this.state.vehicles))
            let idx = this.getIndexFromVin(vin)
            newVehicles.splice(idx, 1)
            this.setState({
                vehicles: newVehicles
            })
        }
    }

    // Make POST to backend and update state
    addRoute = (event) => {
        event.preventDefault() // Prevents weird stuff that usually happens after onSubmit

        let start = event.target.elements.start.value
        let end = event.target.elements.end.value

        // FIXME: SCUFFED WAY OF CHOOSING A NEW ID?
        let id = Math.max(...this.state.routes.map(r => r.id), -1) + 1

        // TODO: MAKE POST REQUEST AND DO INPUT VALIDATION!

        // If all checks pass...
        // Placeholder code - usually would be returned by backend
        if (true) {

            let newRoutes = this.state.routes.concat(new Route(id, start, end))
            this.setState({
                routes: newRoutes
            })
            this.closeAddRouteModal()
        }

    }

    // Make POST to backend and update state
    editRoute(routeId) {
        // TODO: Implement this!
    }

    // Make POST to backend and update state
    deleteRoute(routeId) {
        // TODO: MAKE POST REQUEST

        // If all checks pass...
        if (true) {
            // This is placeholder code, normally we would use the values returned by backend
            // Deep copy for safety
            let newRoutes = JSON.parse(JSON.stringify(this.state.routes))
            let idx = this.getIndexFromRouteId(routeId)
            newRoutes.splice(idx, 1)
            this.setState({
                routes: newRoutes
            })
        }
    }

    openAddVehicleModal() {
        this.setState({
            showAddVehicleModal: true
        })
    }

    closeAddVehicleModal() {
        this.setState({
            showAddVehicleModal: false
        })
    }

    vehicleModal() {
        return (
            <Modal
                isOpen={this.state.showAddVehicleModal}
                onRequestClose={this.closeAddVehicleModal.bind(this)}
                contentLabel="Add a Vehicle"
                style={modalStyles}
            >
                <div className="d-flex justify-content-center ps-4 pe-4">
                    <h1>Add a Vehicle</h1>
                </div>
                <form onSubmit={this.addVehicle}>
                    <button className="btn btn-secondary btn-sm" onClick={this.closeAddVehicleModal.bind(this)}>close</button>
                    <div className="form-group">
                        <label htmlFor="addVin">VIN:</label>
                        <input type="text" id="addVin" name="vin" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="addAssignedRoute">Assigned Route:</label>
                        <select id="addAssignedRoute" name="assignedRoute" className="form-control">
                            {this.state.routes.map((route) => 
                                <option key={route.id} value={route.id}>{route.toString()}</option>
                            )}
                        </select>
                    </div>
                    <br />
                    <button type="submit" className="btn btn-primary mb-2">Submit</button>
                </form>
            </Modal>
        )
    }

    openAddRouteModal() {
        this.setState({
            showAddRouteModal: true
        })
    }

    closeAddRouteModal() {
        this.setState({
            showAddRouteModal: false
        })
    }

    routeModal() {
        return (
            <Modal
                isOpen={this.state.showAddRouteModal}
                onRequestClose={this.closeAddRouteModal.bind(this)}
                contentLabel="Add a Route"
                style={modalStyles}
            >
                <div className="d-flex justify-content-center ps-4 pe-4">
                    <h1>Add a Route</h1>
                </div>
                <form onSubmit={this.addRoute}>
                    <button className="btn btn-secondary btn-sm" onClick={this.closeAddRouteModal.bind(this)}>close</button>
                    <div className="form-group">
                        <label htmlFor="addStart">Start Address:</label>
                        <input type="text" id="addStart" name="start" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="addEnd">End Address:</label>
                        <input type="text" id="addEnd" name="end" className="form-control" />
                    </div>
                    <br />
                    <button type="submit" className="btn btn-primary mb-2">Submit</button>
                </form>
            </Modal>
        )
    }

    renderRoutes() {
        let content;

        if (this.state.routes.length > 0) {
            content = <table className="table">
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
                                        <button className="btn btn-secondary btn-sm me-2 disabled" onCLick={() => {this.editRoute(route.id)}}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => {this.deleteRoute(route.id)}}>Delete</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
        } else {
            content = <div className="alert alert-dark" role="alert">No routes added!</div>
        }

        return (
            <>
                {this.routeModal()}
                {content}
                
                <button className="btn btn-primary mb-4" onClick={this.openAddRouteModal.bind(this)}>Add Route</button>
                <br />
            </>
        )
    }

    renderVehicles() {
        let content;

        const renderAssignedRoute = (assignedRoute) => {
            let idx = this.getIndexFromRouteId(assignedRoute)
            let route = this.state.routes[idx]

            return route.toString()
        }

        if (this.state.vehicles.length > 0) {
            content = <table className="table">
                        <thead>
                            <tr>
                                <th>VIN</th>
                                <th>Assigned Route</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.vehicles.map((vehicle, index) => 
                                <tr key={index}>
                                    <td>{vehicle.vin}</td>
                                    <td>{renderAssignedRoute(vehicle.assignedRoute)}</td>
                                    <td>
                                        <button className="btn btn-secondary btn-sm me-2 disabled">Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => {this.deleteVehicle(vehicle.vin)}}>Delete</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
        } else {
            content = <div className="alert alert-dark" role="alert">No vehicles added!</div>
        }

        return (
            <>
                {this.vehicleModal()}
                {content}
                <button className="btn btn-primary mb-4" onClick={this.openAddVehicleModal.bind(this)}>Add Vehicle</button>
                <br />
            </>
        )
    }

    render() {
        return (
            <div className="container">
                <h1>Simulation Configuration</h1>
                <hr />
                <button className="btn btn-secondary mb-2">Clear All</button>
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