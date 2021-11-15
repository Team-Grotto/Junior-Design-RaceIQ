import React, { PureComponent } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Container, Col, Row, Button, Input, FormGroup, Label } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar } from '@fortawesome/free-solid-svg-icons'

import './marker.css'

const mapStyle = {
    width: '100%',
    height: '85vh',
    float: 'center'
}

const mapboxApiKey = process.env.MAPBOX_KEY

const CustomPopup = ({ index, marker, closePopup, remove }) => {
    return (
        <Popup
            latitude={marker.latitude}
            longitude={marker.longitude}
            onClose={closePopup}
            closeButton={true}
            closeOnClick={false}
            offsetTop={-30}
        >
            <p className="pt-3"><b>{marker.title}</b></p>
            <p>{marker.subtitle}</p>
        </Popup>
    )
};

const CustomMarker = ({ index, marker, openPopup }) => {
    return (
        <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}>
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
            tempMarker: null,
            markers: [{latitude: 33.77692, longitude: -84.3943, title: "VIN: 2GNFLFEK7F6202470", subtitle: "Assigned Route: Cloudman Residence Hall --> Campus Recreation Center"}],
            selectedIndex: null
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

    onSelected = (viewport, item) => {
        this.setState({
            viewport,
            tempMarker: {
                name: item.place_name,
                longitude: item.center[0],
                latitude: item.center[1]
            }
        })
    }

    add = () => {
        var { tempMarker } = this.state

        this.setState(prevState => ({
            markers: [...prevState.markers, tempMarker],
            tempMarker: null
        }))
    }

    remove = (index) => {
        this.setState(prevState => ({
            markers: prevState.markers.filter((marker, i) => index !== i),
            selectedIndex: null
        }))
    }

    render() {
        const { viewport, tempMarker, markers } = this.state;
        return (
            <Container fluid={true}>
                <Row>
                    <Col><h2>Simulation</h2></Col>
                </Row>
                <Row className="mb-2">
                    <Col>
                        <Button color="primary">Start Simulation!</Button>
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
                                this.state.markers.map((marker, index) => {
                                    return (
                                        <CustomMarker
                                            key={`marker-${index}`}
                                            index={index}
                                            marker={marker}
                                            openPopup={this.openPopup}
                                        />
                                    )
                                })
                            }
                            {
                                this.state.selectedIndex !== null &&
                                <CustomPopup
                                    index={this.state.selectedIndex}
                                    marker={markers[this.state.selectedIndex]}
                                    closePopup={this.closePopup}
                                    remove={this.remove}
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