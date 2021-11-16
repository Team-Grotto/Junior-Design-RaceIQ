import React, { PureComponent } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Container, Col, Row, Button, Input, FormGroup, Label } from 'reactstrap';

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

const CustomPopup = ({ vehicle, closePopup }) => {
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
            <p>{vehicle.assignedRoute}</p>
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
            selectedIndex: null,
            pollTimer: null
        };

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
            console.log(res.data)
            this.setState({vehicles: res.data})
        }).catch((error) => {
            console.log(error)
        })
    }

    startSimulation = function () {
        API.get("/start").then((res) => {
            // TODO: TOAST OR SMT?
            let pollTimer = setInterval(this.poll.bind(this), 1000)
            this.setState({pollTimer: pollTimer})
        }).catch((error) => {
            console.log(error)
        })
    }


    stopSimulation = function () {
        API.get("/stop").then((res) => {
            clearInterval(this.state.pollTimer)
            this.setState({pollTimer: null})
        }).catch((error) => {
            console.log(error)
        })
    }

    render() {
        const { viewport, vehicles } = this.state;
        return (
            <Container fluid={true}>
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
                                Simulation Speed
                            </Label>
                            <Input
                                id="simspeed"
                                name="range"
                                type="range"
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
// TODO: VIK - "ONLY THE VEHICLES THAT HAVE A ROUTE WILL BE IN THE SIMULATION" (October 2021)
// class Simulation extends Component {
//     render() {
//         return (
//             <h1>This is where the simulator will be</h1>
//         );
//     }
// }
// export default Simulation;