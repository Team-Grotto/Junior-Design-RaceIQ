import React, { PureComponent } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Container, Col, Row, Button } from 'reactstrap';

import './marker.css'

const mapStyle = {
    width: '100%',
    height: 600,
    float: 'center'
}

const mapboxApiKey = process.env.REACT_APP_MAPBOX_KEY

const params = {
    country: "us"
}

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
            <p>{marker.name}</p>
            <div>
                <Button color="secondary" onClick={() => remove(index)}>Remove</Button>
            </div>
        </Popup>
    )
};

const CustomMarker = ({ index, marker, openPopup }) => {
    return (
        <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}>
            <div className="marker" onClick={() => openPopup(index)}>
                <span><b>{index + 1}</b></span>
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
            markers: [{latitude: 33.7756, longitude: -84.3963}],
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
                    <Col><h2>Geocoding Demo</h2></Col>
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
                            {/* <Marker
                                longitude={-84.3963}
                                latitude={33.7756}>
                                <div className="marker"><span></span></div>
                            </Marker> */}
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