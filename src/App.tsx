import * as React from 'react';
import 'semantic-ui-css/semantic.min.css';
import {Menu} from "semantic-ui-react";
import './App.css';
import {AuthUtils} from "./AuthUtils";
import {Login} from "./Login";
import {PrintImage} from "./PrintImage";
import {PrintImageURL} from "./PrintImageUrl";
import {PrintText} from "./PrintText";

interface AppState {
    mode: "printText" | "printImage" | "printImageURL";
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
                        <Menu.Item content="Image URL"
                                   active={mode == "printImageURL"}
                                   onClick={() => this.setState({mode: "printImageURL"})}/>
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
                        {mode == "printImageURL" ? <PrintImageURL /> : null}
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
