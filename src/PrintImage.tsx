import * as React from 'react';
import {Form, Input, Message} from "semantic-ui-react";
import {API} from "./utils/Api";

interface PrintImageState {
    status: { key: "ready" } | { key: "loading" } | { key: "sendReady", blob: Blob } | { key: "error", message: string };
}

export class PrintImage extends React.Component<{}, PrintImageState> {
    private static readonly SHORT_SIDE = 500;
    constructor(props: {}, context: any) {
        super(props, context);
        this.state = {status: {key: "ready"}};
    }

    private loadBlob(dataUrl: string) {
        fetch(dataUrl)
            .then(data => data.blob())
            .then(blob => this.setState({status: {key: "sendReady", blob: blob}}))
            .catch(e => this.setState({status: {key: "error", message: String(e)}}));
    }

    private send() {
        const {status} = this.state;
        if (status.key != "sendReady") {
            return;
        }
        this.setState({status: {key: "loading"}});
        API.printImage(status.blob, result => {
            if (result.success == true) {
                this.setState({
                    status: {key: "ready"},
                });
            } else {
                this.setState({status: {key: "error", message: result.message}});
            }
        });
    }

    public render() {
        const {status} = this.state;
        return (
            <div>
                <Form loading={status.key == "loading"}
                      onSubmit={e => {
                          e.preventDefault();
                      }}>
                    <Form.Field>
                        <label>Upload Image</label>
                        <Input type="file"
                               control="input"
                               accept={["image/*"]}
                               onChange={e => {
                                   const target = e.target as HTMLInputElement;
                                   if (target.files == null) {
                                       return;
                                   }
                                   this.setState({status: {key: "loading"}});
                                   const file = target.files[0];
                                   const reader = new FileReader();
                                   reader.onloadend = () => {
                                       const dataUrl = reader.result as string;
                                       const image = new Image();
                                       image.src = dataUrl;
                                       image.onload = () => {
                                           if (image.width <= PrintImage.SHORT_SIDE && image.height <= PrintImage.SHORT_SIDE) {
                                               this.loadBlob(dataUrl);
                                               return;
                                           }
                                           let height;
                                           let width;
                                           if (image.width > image.height) {
                                               width = image.width * (PrintImage.SHORT_SIDE / image.height);
                                               height = PrintImage.SHORT_SIDE;
                                           } else {
                                               width = PrintImage.SHORT_SIDE;
                                               height = image.height * (PrintImage.SHORT_SIDE / image.width);
                                           }
                                           const canvas = document.createElement('canvas');
                                           canvas.width = width;
                                           canvas.height = height;
                                           const context = canvas.getContext("2d");
                                           if (context == null) {
                                               return;
                                           }
                                           context.drawImage(image, 0, 0, canvas.width, canvas.height);
                                           this.loadBlob(canvas.toDataURL(file.type));
                                       };
                                   };
                                   reader.onerror = () => this.setState({status: {key: "error", message: "Failed to read file."}});
                                   reader.readAsDataURL(file);
                               }}/>
                    </Form.Field>
                    <Form.Button
                        content="Print"
                        disabled={status.key != "sendReady"}
                        loading={status.key == "loading"}
                        onClick={() => this.send()}/>
                    {status.key == "error" ? (
                        <Message negative content={status.message}/>
                    ) : null}
                </Form>
            </div>
        );
    }
}
