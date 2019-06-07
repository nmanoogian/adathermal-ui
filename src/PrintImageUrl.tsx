import * as React from 'react';
import {Form, Message} from "semantic-ui-react";
import {API} from "./utils/Api";

interface PrintImageURLState {
    url: string | null;
    status: {key: "ready"} | {key: "loading"} | {key: "error", message: string};
}

export class PrintImageURL extends React.Component<{}, PrintImageURLState> {
    constructor(props: {}, context: any) {
        super(props, context);
        this.state = {url: null, status: {key: "ready"}};
    }

    private send() {
        const {url} = this.state;
        if (url == null) {
            return;
        }
        this.setState({status: {key: "loading"}});
        API.printImageURL(url, result => {
            if (result.success == true) {
                this.setState({
                    status: {key: "ready"},
                    url: null,
                });
            } else {
                this.setState({status: {key: "error", message: result.message}});
            }
        });
    }

    public render() {
        const {url, status} = this.state;
        return (
            <div>
                <Form onSubmit={e => {
                    e.preventDefault();
                }}>
                    <Form.Input
                        label="Image URL"
                        value={url || ""}
                        onChange={(e, d) => this.setState({url: d.value || null})}
                        action={{
                            icon: "arrow up",
                            loading: status.key == "loading",
                            onClick: () => this.send(),
                        }}/>
                </Form>
                {status.key == "error" ? (
                    <Message negative content={status.message}/>
                ) : null}
            </div>
        );
    }
}
