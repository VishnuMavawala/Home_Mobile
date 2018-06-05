import React from 'react';
import Pusher from 'pusher-js/react-native';
import { View, Text, Button, TextInput } from 'react-native';
import axios from 'axios';
import pusherConfig from '../pusher.json';

export default class home extends React.Component {
    constructor(props) {
        super(props);

        this.state={
            btn: [],
            user: 'u112'
        };
    }

    connectionInit()
    {
        this.chatChannel = this.pusher.unsubscribe(this.state.user);

        this.pusher = new Pusher(pusherConfig.key, pusherConfig);

        this.chatChannel = this.pusher.subscribe(this.state.user);
        this.chatChannel.bind('pusher:subscription_succeeded', () => {
            this.chatChannel.bind('init', (data) => {
                this.handleInit(data);
            });
            this.chatChannel.bind('part', (btn) => {
                this.setState({ btn });
            });
        });

        axios.get(`${pusherConfig.restServer}/api/${this.state.user}/init`);
    }

    componentWillUnmount()
    {
        this.chatChannel = this.pusher.unsubscribe(this.state.user);
    }
    handleInit(data) {
        console.log({action: 'init', data: data});
        this.setState({btn: data});
    }

    onChangePart(data, index)
    {
        var btn=this.state.btn;
        btn[index].value=!btn[index].value;
        this.setState({ btn });

        axios.post(`${pusherConfig.restServer}/api/${this.state.user}/part`, btn);
    }

    render() {
        return (
            <View style={{ alignItems: 'center', top: 25 }}>
                <TextInput
                    style={{width: 40, borderColor: 'gray'}}
                    onChangeText={(user) => this.setState({user})}
                    value={this.state.user}
                />
                <Button onPress={() => this.connectionInit()} title="Submit" />
                {this.state.btn.map((data, index) =>
                    <Button title={ data.key.toString() }
                            color={data.value?'green':'red'}
                            onPress={ ()=> this.onChangePart(data, index) } />
                )}
            </View>
        );
    }
}