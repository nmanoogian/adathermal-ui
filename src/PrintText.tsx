import * as React from 'react';
import {Form} from "semantic-ui-react";
import {API} from "./utils/Api";

interface PrintTextState {
    text: string | null;
    status: {key: "ready"} | {key: "loading"} | {key: "error", message: string};
}

export class PrintText extends React.Component<{}, PrintTextState> {
    constructor(props: {}, context: any) {
        super(props, context);
        this.state = {text: null, status: {key: "ready"}};
    }

    private send() {
        const {text} = this.state;
        if (text == null) {
            return;
        }
        this.setState({status: {key: "loading"}});
        API.printText(text, result => {
            if (result.success == true) {
                this.setState({
                    status: {key: "ready"},
                    text: null,
                });
            } else {
                this.setState({status: {key: "error", message: result.message}});
            }
        });
    }

    public render() {
        const {text, status} = this.state;
        return (
            <div>
                <Form onSubmit={e => {
                    e.preventDefault();
                }}>
                    <Form.Input
                        label="Text"
                        value={text || ""}
                        onChange={(e, d) => this.setState({text: d.value || null})}
                        action={{
                            icon: "arrow up",
                            loading: status.key == "loading",
                            onClick: () => this.send(),
                        }}/>
                </Form>
            </div>
        );
    }
}
