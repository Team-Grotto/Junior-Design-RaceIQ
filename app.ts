import {Client, LatLng} from "@googlemaps/google-maps-services-js";
import { exit } from "process";

import { decode, LatLngTuple } from "@googlemaps/polyline-codec";

interface ParsedRoute {
    points: LatLngTuple[]
    duration: number
}

/**
 * Queries Google Maps APIs and returns a list of parsed routes
 * @param API_KEY API Key for Google Maps Platform
 * @param routes Human readable list of routes (strings) - [start, end]
 * @returns Queries Google Maps API and returns a list of parsed routes
 */
async function fetchDirections(API_KEY: string, client: Client, routes: [[string, string]]) {

    let parsedRoutes: ParsedRoute[] = []

    for (const route of routes) {
        const directions = await client.directions({
            params: {
              origin: route[0],
              destination: route[1],
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

                let pos: LatLng = {
                    lat: points[whole][0] + latDelta,
                    lng: points[whole][1] + lngDelta
                }

                console.log("\tVehicle %d at location (%f, %f)", idx, pos.lat, pos.lng)
            } else {
                console.log("\tVehicle %d at location (%f, %f)", idx, points[points.length - 1][0], points[points.length - 1][1])
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

const routes: [[string, string]] = [
    ["Cloudman Residence Hall", "McCamish Pavilion"]
]

if (!API_KEY) {
    console.log("Couldn't find Google Maps Platform API Key!")
    exit(1)
}

const express = require("express")
const app = express()
const port = 8080 // default port to listen

app.get("/", (req: any, res: any) => {
    res.json(simulation);
})

app.get("/start", async (req: any, res: any) => {
    let parsedRoutes = await fetchDirections(API_KEY, client, routes)

    // Prevents starting multiple times!
    if (!simulation) {
        simulation = await startSimulation(parsedRoutes)
        res.send("Simulation started!")
    } else {
        res.send("Existing simulation already running! Please stop the simulation in order to start a new one.")
    }
})

app.get("/stop", (req: any, res: any) => {
    if (simulation) {
        stopSimulation(simulation)
        res.send("Simulation stopped!")
    } else {
        res.send("No running simulation to stop!")
    }
    simulation = undefined
})

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})