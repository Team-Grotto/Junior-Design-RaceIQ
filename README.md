# RaceIQ Delivery Fleet Simulator

This repository contains both the frontend simulation management portal and the backend simulatation engine and API. 

All frontend code and components are contained in the `frontend/` folder. This folder is a separate Node package built with React + webpack.

All backend code is contained in the `backend/` folder. THis folder is an independent Node package built with Typescript.

## Release Notes
> ### v1.0.0 (12/06/2021)
> 
> #### New Features:
> 
> - Real-time multi vehicle simulation
> - Comprehensive simulation management API
> - Automatic address geocoding
> - Ability to save/load simulation configurations for reuse
> - Smooth web portal flow to easily configure simulations
> - Dynamically rendered map to view simulation state
> 
> #### Bug Fixes:
> 
> - Google Maps polylines return too few points for simulation
> - Duplicate route IDs and vehicle VINs
> - Configuration page allows deletion of an in-use route
> - Stopping simulation button causes Toast spam
> - Refreshing configuration page removes all progress
> - Simulated vehicles not snapping to roads
> 
> #### Known Bugs/Issues:
> 
> - To improve simulation accuracy (over long distances), refactor simulation to use per leg polylines (and durations) instead of overview polylines
> - Add support for waypoints on both frontend and backend
> - Post simulation data to RaceIQ databases (add POST to `backend/app.ts` interval code).
> - Dynamically re-center the map view for frontend.

## Install Guide
Prerequisites: Install a modern version of Node (we used `12.16.2`) and NPM on your local machine. Then clone this GitHub repository to get a local copy of the source code.

### Frontend
Run the following commands:
```
cd frontend
npm install
```
This installs necessary dependencies for this project. You can view the complete list of libraries that are installed by executing `npm list` once you have completed the install.

Additionally, you must configure a Mapbox developer account and create an API access token. Then, place this token in a `.env` file in the `frontend` directory. Format the file like this:
```
MAPBOX_KEY=**YOUR KEY HERE**
```
We have also included a `.env.example` file that can be used as a template.

In order to launch the frontend web portal, run `npm start`. This will serve the development build of the site to `localhost` (port 80). Just visit `localhost` on any modern browser to view.

### Backend
Run the following commands:
```
cd backend
npm install
```
This installs necessary dependencies for this project. You can view the complete list of libraries that are installed by executing `npm list` once you have completed the install.

Additionally, you must configure a Google Cloud developer account, create a new project, and create an API access token. Follow the [official guide](https://developers.google.com/maps/documentation/directions/cloud-setup). Then, place this token in a `.env` file in the `backend` directory. Format the file like this:
```
API_KEY=**YOUR KEY HERE**
```
We have also included a `.env.example` file that can be used as a template.

By default, saved simulation configurations are stored in `backend/saved_configs`. This can be changed by modifying the base `directory` variable in `backend/app.ts`.

In order to start the backend web server, run `npm start`. This will serve the web server `localhost:8080` (port 8080). The frontend code is already configured to point to this address but this can be configured by modifying `frontend/src/api.js`.

If everything is working at this point, you should be able to visit `localhost` in your web browser to interact with the simulation.

### Troubleshooting
* If you encounter an error with `webpack-server`, you may be using an out of date version of Node or NPM. Try updating and re-running the installation.
* When working with the command line, make sure you are working from the `frontend` or `backend` subdirectories instead of the top level repo directory.
* Remember that you can't have multiple simulations running at once. If you get an error that a simulation is already running, click "Stop Simulation" and try again.
