import React from 'react';
import Pusher from 'pusher-js/react-native';
import { View, Text, Button } from 'react-native';
import axios from 'axios';
import pusherConfig from '../pusher.json';

export default class home extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            btn: [],
        };

        this.pusher = new Pusher(pusherConfig.key, pusherConfig);

        this.chatChannel = this.pusher.subscribe(pusherConfig.user);
        this.chatChannel.bind('pusher:subscription_succeeded', () => {
            this.chatChannel.bind('init', (data) => {
                this.handleInit(data);
            });
            this.chatChannel.bind('part', (btn) => {
                this.setState({ btn });
            });
        });
        // this.handleSendMessage = this.onSendMessage.bind(this); // (9)
    }

    handleInit(data) {
        console.log({action: 'init', data: data});
        this.setState({btn: data});
    }

    componentDidMount() {
        axios.get(`${pusherConfig.restServer}/api/${pusherConfig.user}/init`);
    }

    onChangePart(data, index)
    {
        var btn=this.state.btn;
        btn[index].value=!btn[index].value;

        axios.post(`${pusherConfig.restServer}/api/${pusherConfig.user}/part`, btn);
    }

    /*onSendMessage(text) {
        const payload = {
            message: text
        };
        fetch(`${pusherConfig.restServer}/users/${this.props.name}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    }*/

    render() {
        return (
            <View>
                {this.state.btn.map((data, index) =>
                    <Button title={ data.key.toString() }
                            color={data.value?'green':'red'}
                            onPress={ ()=> this.onChangePart(data, index) } />
                )}
            </View>
        );
    }
}