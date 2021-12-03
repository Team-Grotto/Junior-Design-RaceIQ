import React, {Component} from 'react'

import Route from './Classes/Route';
import Vehicle from './Classes/Vehicle';
import Toasts from './Classes/Toasts'

import Modal from 'react-modal';
import { Button } from 'reactstrap';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { ToastContainer, toast } from 'react-toastify';
import API from '../api';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

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

const routeToString = (route) => {
    return route.start + " --> " + route.end
}

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
            editingRouteId: null,
            filename: "",
            savedFiles: []
        };

        API.get("/config").then((res) => {
            if (res.data && res.data.routes && res.data.vehicles) {
                this.setState({
                    routes: res.data.routes,
                    vehicles: res.data.vehicles
                })
            }
        })

        API.get("/getConfigs").then((res) => {
            if (res.data) {
                this.setState({
                    savedFiles: res.data
                })
            }
        })
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

        // TODO: SO INPUT VALIDATION!
        API.post("/addVehicle", new Vehicle(vin, assignedRoute)).then((res) => {
            this.setState({vehicles: res.data.vehicles})
            this.closeAddVehicleModal()
            Toasts.addVehicleSuccess()
        })

        // TODO: State sanitization

    }

    // Make POST to backend and update state
    editVehicle(event) {
        event.preventDefault() // Prevents weird stuff that usually happens after onSubmit

        let vin = event.target.elements.vin.value
        let assignedRoute = event.target.elements.assignedRoute.value

        // TODO: DO INPUT VALIDATION!
        API.post("/editVehicle", { vehicle: new Vehicle(vin, assignedRoute), oldVIN: this.state.editingVehicleId }).then((res) => {
            this.setState({
                vehicles: res.data.vehicles,
                editingVehicleId: null
            })
            this.closeEditVehicleModal()
            Toasts.success(res.data.message)
        })
    }

    // Make POST to backend and update state
    deleteVehicle(vin) {
        API.delete("/deleteVehicle", vin).then((res) => {
            this.setState({
                vehicles: res.data.vehicles,
            })
            Toasts.success(res.data.message)
        })
    }

    // Make POST to backend and update state
    addRoute = (event) => {
        event.preventDefault() // Prevents weird stuff that usually happens after onSubmit

        let start = event.target.elements.start.value
        let end = event.target.elements.end.value

        // FIXME: SCUFFED WAY OF CHOOSING A NEW ID?
        let id = (Math.max(...this.state.routes.map(r => r.id), -1) + 1).toString();


        // TODO: INPUT VALIDATION!
        // TODO: UUIDs
        API.post("/addRoute", new Route(id, start, end)).then((res) => {
            this.setState({routes: res.data.routes})
            this.closeAddRouteModal()
            Toasts.addRouteSuccess()
        })

        // TODO: State sanitization
    }

    // Make POST to backend and update state
    editRoute(event) {
        event.preventDefault();

        let start = event.target.elements.start.value;
        let end = event.target.elements.end.value;

        // TODO: INPUT VALIDATION!
        API.post("/editRoute", new Route(this.state.editingRouteId, start, end)).then((res) => {
            this.setState({
                routes: res.data.routes,
                editingRouteId: null
            })
            this.closeEditRouteModal()
            Toasts.success(res.data.message)
        })
    }

    // Make POST to backend and update state
    deleteRoute(routeId) {
        
        API.delete("/deleteRoute", routeId).then((res) => {
            this.setState({
                routes: res.data.routes,
            })
            Toasts.success(res.data.message)
        })
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

    openEditVehicleModal(vin) {
        this.setState({
            editingVehicleId: vin,
            showEditVehicleModal: true
        });
    }

    closeEditVehicleModal() {
        this.setState({
            showEditVehicleModal: false,
            editingVehicleId: null
        })
    }

    vehicleModal() {
        return (
            <Modal
                isOpen={this.state.showAddVehicleModal}
                // onRequestClose={this.closeAddVehicleModal.bind(this)}
                contentLabel="Add a Vehicle"
                style={modalStyles}
            >
                <div className="d-flex justify-content-center ps-4 pe-4">
                    <h1>Add a Vehicle</h1>
                </div>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-link btn-sm" onClick={this.closeAddVehicleModal.bind(this)}><FontAwesomeIcon icon={faTimes} /></button>
                </div>
                <form onSubmit={this.addVehicle}>
                    <div className="form-group">
                        <label htmlFor="addVin">VIN:</label>
                        <input type="text" id="addVin" name="vin" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="addAssignedRoute">Assigned Route:</label>
                        <select id="addAssignedRoute" name="assignedRoute" className="form-control">
                            {this.state.routes.map((route) => 
                                <option key={route.id} value={route.id}>{routeToString(route)}</option>
                            )}
                        </select>
                    </div>
                    <br />
                    <button type="submit" className="btn btn-primary mb-2">Submit</button>
                </form>
            </Modal>
        )
    }

    vehicleEditModal() {
        if (!this.state.editingVehicleId) {
            return;
        }
        const vehicle = this.state.vehicles[this.getIndexFromVin(this.state.editingVehicleId)];
        return (
            <Modal
                isOpen={this.state.showEditVehicleModal}
                // onRequestClose={this.closeEditVehicleModal.bind(this)}
                contentLabel="Editing Vehicle"
                style={modalStyles}
            >
                <div className="d-flex justify-content-center ps-4 pe-4">
                    <h1>Edit Vehicle</h1>
                </div>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-link btn-sm" onClick={this.closeEditVehicleModal.bind(this)}><FontAwesomeIcon icon={faTimes} /></button>
                </div>
                <form onSubmit={(event) => this.editVehicle(event, vehicle.vin)}>
                    <div className="form-group">
                        <label htmlFor="editVin">VIN:</label>
                        <input type="text" defaultValue={vehicle.vin} id="editVin" name="vin" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="editAssignedRoute">Assigned Route:</label>
                        <select id="editAssignedRoute" defaultValue={vehicle.assignedRoute} name="assignedRoute" className="form-control">
                            {this.state.routes.map((route) => 
                                <option key={route.id} value={route.id}>{routeToString(route)}</option>
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

    openEditRouteModal(routeID) {
        this.setState({
            editingRouteId: routeID,
            showEditRouteModal: true
        })
    }

    closeEditRouteModal() {
        this.setState({
            showEditRouteModal: false,
            editingRouteId: null
        })
    }

    disableRouteDelete(id) {
        return this.state.vehicles.some(e => e.assignedRoute == id);
    }

    clearAll() {
        API.get("/clearAll").then(res => {
            this.setState({
                routes: res.data.routes,
                vehicles: res.data.vehicles
            })
            Toasts.success(res.data.message)
        })
    }

    saveConfig() {
        if (this.state.filename.length > 0) {
            API.post("/saveConfig", { filename: this.state.filename }).then(res => {
                Toasts.success(res.data.message)
            })
        }
    }

    loadConfig() {
        if (this.state.filename.length > 0) {
            API.post("/loadConfig", { filename: this.state.filename }).then((res) => {
                if (res.data && res.data.routes && res.data.vehicles) {
                    this.setState({
                        routes: res.data.routes,
                        vehicles: res.data.vehicles
                    })
                    Toasts.success(res.data.message)
                }
            })
        }
    }

    routeModal() {
        return (
            <Modal
                isOpen={this.state.showAddRouteModal}
                // onRequestClose={this.closeAddRouteModal.bind(this)}
                contentLabel="Add a Route"
                style={modalStyles}
            >
                <div className="d-flex justify-content-center ps-4 pe-4">
                    <h1>Add a Route</h1>
                </div>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-link btn-sm" onClick={this.closeAddRouteModal.bind(this)}><FontAwesomeIcon icon={faTimes} /></button>
                </div>
                <form onSubmit={this.addRoute}>
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

    editRouteModal() {
        if (!this.state.editingRouteId) {
            return;
        }
        const route = this.state.routes[this.getIndexFromRouteId(this.state.editingRouteId)];
        return (
            <Modal
                isOpen={this.state.showEditRouteModal}
                // onRequestClose={this.closeEditRouteModal.bind(this)}
                contentLabel="Edit Route"
                style={modalStyles}
            >
                <div className="d-flex justify-content-center ps-4 pe-4">
                    <h1>Edit Route</h1>
                </div>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-link btn-sm" onClick={this.closeEditRouteModal.bind(this)}><FontAwesomeIcon icon={faTimes} /></button>
                </div>
                <form onSubmit={this.editRoute.bind(this)}>
                    <div className="form-group">
                        <label htmlFor="addStart">Start Address:</label>
                        <input type="text" defaultValue={route.start} id="addStart" name="start" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="addEnd">End Address:</label>
                        <input type="text" defaultValue={route.end} id="addEnd" name="end" className="form-control" />
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
                                        <button className="btn btn-secondary btn-sm me-2" onClick={() => {this.openEditRouteModal(route.id)}}>Edit</button>
                                        <Button color="danger" size='sm' onClick={() => {this.deleteRoute(route.id)}} disabled = {this.disableRouteDelete(route.id)}>Delete</Button>
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
                {this.editRouteModal()}
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

            return routeToString(route)
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
                                        <button className="btn btn-secondary btn-sm me-2" onClick={() => this.openEditVehicleModal(vehicle.vin)}>Edit</button>
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
                {this.vehicleEditModal()}
                {content}
                <button className="btn btn-primary mb-4" onClick={this.openAddVehicleModal.bind(this)}>Add Vehicle</button>
                <br />
            </>
        )
    }

    render() {
        return (
            <div className="container">
                <ToastContainer />
                <h1>Simulation Configuration</h1>
                <hr />
                <button className="btn btn-secondary mb-2" onClick={this.clearAll.bind(this)}>Clear All</button>
                <h2>Add Routes</h2>
                {this.renderRoutes()}
                <h2>Add Vehicles</h2>
                {this.renderVehicles()}

                <div className="d-flex justify-content-center">
                    <a href="/#/simulation" className="btn btn-primary btn-lg mb-4">Start Simulation!</a>
                </div>
                <label htmlFor="filename">Filename:</label>
                <div className="input-group w-75">
                    <UncontrolledDropdown>
                        <DropdownToggle caret>
                            Saved Files
                        </DropdownToggle>
                        <DropdownMenu>
                            {this.state.savedFiles.map((file, index) =>
                                <DropdownItem key={index} onClick={() => {this.setState({filename: file})}}>{file}</DropdownItem>
                            )}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <input type="text" id="filename" name="filename" value={this.state.filename} onChange={(e) => {this.setState({ filename: e.target.value })}} className="form-control" />
                </div>
                <br />
                <button className="btn btn-secondary me-2" onClick={this.saveConfig.bind(this)}>Save Config</button>
                <button className="btn btn-secondary" onClick={this.loadConfig.bind(this)}>Load Config</button>
            </div>
        );
    }
}
export default Configuration;