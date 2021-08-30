import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as actions from './store/actions/auth';
import BaseRouter from './routes';
import Sidepanel from './Containers/Sidepanel';
import Profile from './Containers/Profile';
import WebSocketInstance from './websocket';


class App extends React.Component {

    componentDidMount() {
        this.props.onTryAutoSignup();
        WebSocketInstance.connect();
    }

    render() {
        return(
            <Router>
                <div id="frame">
                    <BaseRouter />
                    <Sidepanel />
                    <div className="content">
                        <Profile />
                        <BaseRouter />
                    </div>
                </div>
            </Router>
        );
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onTryAutoSignup: () => dispatch(actions.authCheckState())
    }
}

export default connect(null, mapDispatchToProps)(App); 