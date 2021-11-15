import React, {Component} from 'react'
import { Router, Switch, Route, HashRouter } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Home from './Components/Home';
import Configuration from './Components/Configuration';
// import Simulation from './Components/Simulation';

class Routes extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/configuration" component={Configuration} />
                    {/* <Route path="/simulation" component={Simulation} /> */}
                    <Route><h1>The requested page was not found.</h1></Route>
                </Switch>
            </HashRouter>
        )
    }
}

export default Routes;