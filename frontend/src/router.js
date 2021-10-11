import React, {Component} from 'react'
import { Router, Switch, Route, HashRouter } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import Home from './components/Home';
import Configurations from './components/Configurations';
import Simulation from './components/Simulation';

class Routes extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/configurations" component={Configurations} />
                    <Route path="/simulation" component={Simulation} />
                    <Route><h1>The requested page was not found.</h1></Route>
                </Switch>
            </HashRouter>
        )
    }
}

export default Routes;