import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Menu} from "semantic-ui-react";
import './App.css';
import {AuthUtils} from "./AuthUtils";
import {Login} from "./Login";
import {PrintImage} from "./PrintImage";
import {PrintText} from "./PrintText";

interface AppState {
    mode: "printText" | "printImage";
    loggedIn: boolean;
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}, context: any) {
        super(props, context);
        this.state = {mode: "printText", loggedIn: AuthUtils.getAPIKey() != null};
    }

    public render() {
        const {mode, loggedIn} = this.state;
        if (loggedIn) {
            return (
                <div>
                    <Menu>
                        <Menu.Item content="Text"
                                   active={mode == "printText"}
                                   onClick={() => this.setState({mode: "printText"})}/>
                        <Menu.Item content="Image"
                                   active={mode == "printImage"}
                                   onClick={() => this.setState({mode: "printImage"})}/>
                        <Menu.Menu position='right'>
                            <Menu.Item content="Sign Out"
                                       onClick={() => {
                                           AuthUtils.clearAPIKey();
                                           this.setState({loggedIn: false});
                                       }}/>
                        </Menu.Menu>
                    </Menu>
                    <div className="menu-content">
                        {mode == "printText" ? <PrintText /> : null}
                        {mode == "printImage" ? <PrintImage /> : null}
                    </div>
                </div>
            );
        } else {
            return (
                <Login onLogin={() => this.setState({loggedIn: true})}/>
            );
        }
    }
}

export default App;
