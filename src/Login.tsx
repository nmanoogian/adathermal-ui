import * as React from 'react';
import {Form, Message, Segment} from "semantic-ui-react";
import {AuthUtils} from "./AuthUtils";
import {API} from "./utils/Api";

interface LoginProps {
    onLogin(): void;
}

interface LoginState {
    apiKey: string | null;
    status: {key: "ready"} | {key: "loading"} | {key: "error", message: string};
}

export class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps, context: any) {
        super(props, context);
        this.state = {apiKey: null, status: {key: "ready"}};
    }

    public render() {
        const {apiKey, status} = this.state;
        return (
            <div className="login-container">
                <Segment>
                    <Form>
                        <Form.Input
                            label="API Key"
                            value={apiKey || ""}
                            onChange={(e, d) => this.setState({apiKey: d.value || null})}/>
                        <Form.Button
                            content="Go"
                            disabled={apiKey == null}
                            loading={status.key == "loading"}
                            onClick={() => {
                                if (apiKey == null) {
                                    return;
                                }
                                this.setState({status: {key: "loading"}});
                                API.checkAuth(apiKey, result => {
                                    if (result.success == true) {
                                        AuthUtils.setAPIKey(apiKey);
                                        this.props.onLogin();
                                    } else {
                                        this.setState({status: {key: "error", message: result.message}});
                                    }
                                });
                            }}
                        />
                        {status.key == "error" ? (
                            <Message negative content={status.message}/>
                        ) : null}
                    </Form>
                </Segment>
            </div>
        );
    }
}
