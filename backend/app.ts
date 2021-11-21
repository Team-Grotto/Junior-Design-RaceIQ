import {Client, LatLng, LatLngLiteral} from "@googlemaps/google-maps-services-js";
import { exit } from "process";

import { decode, LatLngTuple } from "@googlemaps/polyline-codec";

class Route {
    id: string
    start: string
    end: string
    waypoints: string[]

    constructor(id: string, start="", end="", waypoints=[]) {
        this.id = id
        this.start = start;
        this.end = end;
        this.waypoints = waypoints;
    }
}

interface ParsedRoute {
    id: string
    points: LatLngTuple[]
    duration: number
}

interface Vehicle {
    vin: string
    assignedRoute: string
    location?: LatLng
}

/**
 * Queries Google Maps APIs and returns a list of parsed routes
 * @param API_KEY API Key for Google Maps Platform
 * @param routes Human readable list of routes (strings) - [start, end]
 * @returns Queries Google Maps API and returns a list of parsed routes
 */
async function fetchDirections(API_KEY: string, client: Client, routes: Route[]) {

    let parsedRoutes: ParsedRoute[] = []

    for (const route of routes) {
        const directions = await client.directions({
            params: {
              origin: route.start,
              destination: route.end,
              key: API_KEY,
            },
            timeout: 1000, // milliseconds
          })

        const fetchedRoutes = directions.data.routes

        let duration = 0

        for (const leg of fetchedRoutes[0].legs) {
            duration += leg.duration.value
        }
        
        // Right now, we are only interpolating the vehicle between points returned in overview_polyline
        // We can change this to use the points from each leg, if needed
        // This approach works for now, because the expected granularity for the simulation is not too precise
        let parsedRoute: ParsedRoute = {
            id: route.id,
            points: decode(fetchedRoutes[0].overview_polyline.points),
            duration: duration
        }
        parsedRoutes.push(parsedRoute)
    }

    return parsedRoutes
}

/**
 * Starts simulation and interpolation of simulated vehicles across points in routes
 * @param parsedRoutes List of parsed routes returned by a call to fetchDirections
 * @param updateInterval Number of milliseconds to update vehicle positions (default: 1)
 * @param simulationSpeed Multiplier on speed to run simulation at (default: 1)
 */
async function startSimulation(parsedRoutes: ParsedRoute[], updateInterval=1, simulationSpeed=1) {
    let elapsedIntervals = 0

    // Initialize locations
    for (const vehicle of vehicles) {
        const route = parsedRoutes.find(parsedRoute => parsedRoute.id === vehicle.assignedRoute)
        if (route) {
            let location: LatLng = {
                lat: route.points[0][0],
                lng: route.points[0][1]
            }
            vehicle.location = location
        } else {
            console.error("Vehicle was assigned to an invalid route!")
        }
    }

    let interval = setInterval(() => {
        console.log(`At time ${elapsedIntervals * updateInterval}:`)

        parsedRoutes.forEach((parsedRoute, idx) => {
            let points = parsedRoute.points, duration = parsedRoute.duration

            let pointIdx = points.length * updateInterval * elapsedIntervals / duration

            if (pointIdx < points.length - 1) {
                let whole = Math.floor(pointIdx)
                let partial = pointIdx - whole

                let locationDiff = [points[whole + 1][0] - points[whole][0], points[whole + 1][1] - points[whole][1]]
                let latDelta = locationDiff[0] * partial
                let lngDelta = locationDiff[1] * partial

                let pos: LatLngLiteral = {
                    lat: points[whole][0] + latDelta,
                    lng: points[whole][1] + lngDelta
                }

                vehicles.filter(vehicle => vehicle.assignedRoute === parsedRoute.id).forEach(vehicle => {
                    vehicle.location = pos
                    console.log(`\tVehicle ${vehicle.vin} at location (${pos.lat}, ${pos.lng})`)
                })
            } else {
                let pos: LatLngLiteral = {
                    lat: points[points.length - 1][0],
                    lng: points[points.length - 1][1]
                }

                vehicles.filter(vehicle => vehicle.assignedRoute === parsedRoute.id).forEach(vehicle => {
                    vehicle.location = pos
                    console.log(`\tVehicle ${vehicle.vin} at location (${pos.lat}, ${pos.lng})`)
                })
            }
        })

        elapsedIntervals++
    }, (updateInterval * 1000) / simulationSpeed)

    return interval
}

function stopSimulation(interval: NodeJS.Timer) {
    clearInterval(interval)
}

require('dotenv').config()

const client = new Client({});
const API_KEY = process.env["API_KEY"]

let simulation: (undefined|NodeJS.Timer)

// const routes: Route[] = [
//     new Route("0", "Cloudman Residence Hall", "McCamish Pavilion"),
//     new Route("1", "Georgia Tech Campus Recreation Center", "North Avenue Apartments")
// ]

const routes: Route[] = []

// var vehicles: Vehicle[] = [
//     {
//         vin: "JHLRE48577C044959",
//         assignedRoute: "0"
//     },
//     {
//         vin: "2MEFM75W4XX622535",
//         assignedRoute: "1"
//     }
// ]

var vehicles: Vehicle[] = []

if (!API_KEY) {
    console.log("Couldn't find Google Maps Platform API Key!")
    exit(1)
}

const express = require("express")
const cors = require("cors");
const app = express()
const port = 8080 // default port to listen

app.use(cors())
app.use(express.json())    // <==== parse request body as JSON

app.get("/", (req: any, res: any) => {
    res.json({message: "Backend API for RaceIQ Simulation Platform"})
})

app.get("/start", async (req: any, res: any) => {

    // TODO: Validate whether there is >1 route and all vehicles are assigned a route
    let parsedRoutes = await fetchDirections(API_KEY, client, routes)

    // Prevents starting multiple times
    if (!simulation) {
        simulation = await startSimulation(parsedRoutes)
        res.json({
            message: "Simulation started!"
        })
    } else {
        res.status(400).json({
            message: "Existing simulation already running! Please stop the simulation in order to start a new one."
        })
    }
})

// Returns the current configuration of the simulation
app.get("/config", async (req: any, res: any) => {
    res.json({
        routes: routes,
        vehicles: vehicles
    })
})

// POST a new route
app.post("/addRoute", async (req: any, res: any) => {
    // TODO: UUIDs
    console.log("adding route")
    if (req.body) {
        const newRoute: Route = req.body

        if (!newRoute.id || routes.find(route => route.id === newRoute.id)) {
            res.status(400).json({
                message: "Bad request, route has missing/duplicate id"
            })
            return
        }

        routes.push(newRoute)
        res.json({
            routes: routes
        })
    } else {
        res.status(400).json({
            message: "Bad request, no route object was provided"
        })
    }
})

// POST a new vehicle
app.post("/addVehicle", async (req: any, res: any) => {
    if (req.body) {
        const newVehicle: Vehicle = req.body

        if (!newVehicle.vin || vehicles.find(vehicle => vehicle.vin === newVehicle.vin)) {
            res.status(400).json({
                message: "Bad request, vehicle has missing/duplicate id"
            })
            return
        }

        
        vehicles.push(req.body)
        console.log(vehicles)
        res.json({
            vehicles: vehicles
        })
    } else {
        res.status(400).json({
            message: "Bad request, no vehicle object was provided"
        })
    }
})

app.get("/locations", async (req: any, res: any) => {
    // Prevents starting multiple times!
    if (!simulation) {
        // No simulation to send vehicle location data for
        res.status(400).json({
            message: "No running simulation to send data for!"
        })
    } else {
        res.json(vehicles)
    }
})

app.get("/stop", (req: any, res: any) => {
    if (simulation) {
        stopSimulation(simulation)
        res.json({
            message: "Simulation stopped!"
        })
    } else {
        res.status(400).json({
            message: "No running simulation to stop!"
        })
    }
    simulation = undefined
})

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})