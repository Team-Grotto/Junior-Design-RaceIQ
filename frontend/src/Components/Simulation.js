import React, { PureComponent } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Container, Col, Row, Button, Input, FormGroup, Label } from 'reactstrap';

import { ToastContainer } from 'react-toastify';
import Toasts from './Classes/Toasts';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar } from '@fortawesome/free-solid-svg-icons'

import './marker.css'

import API from '../api';

const mapStyle = {
    width: '100%',
    height: '85vh',
    float: 'center'
}

const mapboxApiKey = process.env.MAPBOX_KEY

const CustomPopup = ({ vehicle, closePopup, routes }) => {
    return (
        <Popup
            latitude={vehicle.location.lat}
            longitude={vehicle.location.lng}
            onClose={closePopup}
            closeButton={true}
            closeOnClick={false}
            offsetTop={-30}
        >
            <p className="pt-3"><b>{vehicle.vin}</b></p>
            <p>{routeToString(routes[getIndexFromRouteId(vehicle.assignedRoute, routes)])}</p>
        </Popup>
    )
};

const CustomMarker = ({ index, vehicle, openPopup }) => {
    return (
        <Marker
            longitude={vehicle.location.lng}
            latitude={vehicle.location.lat}>
            <div className="marker" onClick={() => openPopup(index)}>
                <span><b><FontAwesomeIcon icon={faCar} /></b></span>
            </div>
        </Marker>
    )
};

const getIndexFromRouteId = function (routeId, routes) {
    return routes.findIndex(route => route.id === routeId)
}

const routeToString = (route) => {
    return route.start + " --> " + route.end
}

class Simulation extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            viewport: {
                latitude: 33.7756,
                longitude: -84.3963,
                zoom: 14.8
            },
            vehicles: [],
            routes: [],
            selectedIndex: null,
            pollTimer: null,
            simspeed: 1.0
        };

        API.get("/config").then((res) => {
            if (res.data && res.data.routes && res.data.vehicles) {
                this.setState({
                    routes: res.data.routes
                })
            }
        })
    }

    setSelectedMarker = (index) => {
        this.setState({ selectedIndex: index })
    }

    closePopup = () => {
        this.setSelectedMarker(null)
    };

    openPopup = (index) => {
        this.setSelectedMarker(index)
    }

    poll = function () {
        console.log("Polling")
        API.get("/locations").then((res) => {
            this.setState({vehicles: res.data})
        })
    }

    startSimulation = function () {
        API.get("/start").then((res) => {
            Toasts.success(res.data.message)
            let pollTimer = setInterval(this.poll.bind(this), 1000)
            this.setState({pollTimer: pollTimer})
        })
    }

    stopSimulation = function () {
        API.get("/stop").then((res) => {
            Toasts.success(res.data.message)
            clearInterval(this.state.pollTimer)
            this.setState({pollTimer: null})
            window.location.reload();
        })
    }

    render() {
        const { viewport, vehicles } = this.state;
        return (
            <Container fluid={true}>
                <ToastContainer />
                <Row>
                    <Col><h2>Simulation</h2></Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        <Button color="primary" className="me-2" onClick={this.startSimulation.bind(this)}>Start Simulation!</Button>
                        <Button color="primary" className="me-2" onClick={this.stopSimulation.bind(this)}>Stop Simulation!</Button>
                    </Col>
                    <Col>
                        <FormGroup className="w-50">
                            <Label for="simspeed">
                                Simulation Speed: {this.state.simspeed}
                            </Label>
                            <Input
                                id="simspeed"
                                name="simspeed"
                                type="range"
                                min="0.25"
                                max="4"
                                step="0.25"
                                value={this.state.simspeed}
                                onChange={e => this.setState({ simspeed: e.target.value })}
                            />
                        </FormGroup>
                    </Col>
                    <Col />
                </Row>
                <Row>
                    <Col>
                        <ReactMapGL
                            mapboxApiAccessToken={mapboxApiKey}
                            mapStyle="mapbox://styles/mapbox/streets-v11"
                            {...viewport}
                            {...mapStyle}
                            onViewportChange={(viewport) => this.setState({ viewport })}
                        >
                            {
                                this.state.vehicles.map((vehicle, index) => {
                                    return (
                                        <CustomMarker
                                            key={`marker-${index}`}
                                            index={index}
                                            vehicle={vehicle}
                                            openPopup={this.openPopup}
                                        />
                                    )
                                })
                            }
                            {
                                this.state.selectedIndex !== null &&
                                <CustomPopup
                                    vehicle={vehicles[this.state.selectedIndex]}
                                    closePopup={this.closePopup}
                                    routes={this.state.routes}
                                />
                            }
                        </ReactMapGL>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Simulation;