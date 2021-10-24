import ReactDOM from 'react-dom';
import React from 'react';
import Routes from "./router"

import Modal from 'react-modal'

import 'bootstrap/dist/css/bootstrap.min.css';

Modal.setAppElement('#root');

ReactDOM.render(
    <Routes />
    , document.getElementById('root'));