import * as React from "react";
import { PropertyControls, ControlType } from "framer";
var ws;

// Define type of property
interface Props {
    deviceIp: string;
    deviceUsername: string;
    devicePassword: string;
}

export class Connect_to_server extends React.Component<Props> {

    // Set default properties
    static defaultProps = {
    deviceIp: "Ip address",
    deviceUsername: "Username",
    devicePassword: "Password"
    }

    state = {
        connected: false
    }

    connectWebsocket(props) {
        ws = new WebSocket("ws://localhost:8081");
        ws.onopen = function (event) {
            ws.send(JSON.stringify(props))
          };
        ws.onmessage = (event) => {
            if (event.data=="connected"){
                console.log(event.data);
                this.setState({connected: true});
            } else {
                console.log(event.data)
            };            
        };
    }

    send() {
        ws.send('xapi.command("UserInterface Message Alert Display", {Title: "Test",Text: "Notification goes here",Duration: 5,});');
    }

    mute() {
        ws.send("xapi.command('Audio Microphones ToggleMute');");
    }

    getVolume() {
        ws.send("xapi.status.get('Audio Volume').then((volume) => { ws.send(volume) });");
    }

    // Here we check if the component has been rendered for the first time
    // and then we call the function that actually calls the API
    componentWillMount(){
        this.connectWebsocket(this.props);
    };

    // Items shown in property panel
    static propertyControls: PropertyControls = {
    deviceIp: { type: ControlType.String, title: "Device IP" },
    deviceUsername: { type: ControlType.String, title: "Device user" },
    devicePassword: { type: ControlType.String, title: "Device password" }
    }

    render() {
        var style: React.CSSProperties = {
            padding: "5px",
            background: "rgba(255, 0, 0, 0.5)"
        };
        if (this.state.connected == true) {
            style.background = "rgba(0, 255, 0, 0.5)";
          }
    return <div>
        <div style={style}>Connected: {this.state.connected.toString()}</div>
        <button onClick={this.send.bind(this)}>Send Notification</button>
        <button onClick={this.mute.bind(this)}>Mute</button>
        <button onClick={this.getVolume.bind(this)}>Console log volume</button>
    </div>
    }
}
