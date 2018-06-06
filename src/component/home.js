import React from 'react';
import Pusher from 'pusher-js/react-native';
import { View, Text, Button, TextInput, AsyncStorage, ActivityIndicator } from 'react-native';
import axios from 'axios';
// import pusherConfig from '../pusher.json';

export default class home extends React.Component {

    pusherConfig;

    constructor(props) {
        super(props);

        this.state={
            btn: [],
            user: this.props.navigation.state.params.user,
            activity: true
        };

        axios.post('https://vishnumavawala.000webhostapp.com/Home/pusher.php', { 'device': 'Mobile' })
            .then((result) => {
                pusherConfig=result.data;
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
            })
    }

    logout()
    {
        AsyncStorage.removeItem('user').then(
            this.props.navigation.goBack()
        );
    }

    handleInit(data) {
        console.log({action: 'init', data: data});
        this.setState({btn: data, activity: false });
    }

    onChangePart(data, index)
    {
        var btn=this.state.btn;
        btn[index].value=!btn[index].value;
        this.setState({ btn });

        axios.post(`${pusherConfig.restServer}/api/${this.state.user}/part`, btn);
    }

    render() {
        if(this.state.activity)
            return (<ActivityIndicator style={{ flex: 1 }} size="small" color='#0000ff' />);
        else
            return (
            <View style={{ alignItems: 'center', top: 25 }}>
                <Button onPress={() => this.logout()} title="Logout" />
                {this.state.btn.map((data, index) =>
                    <Button title={ data.key.toString() }
                            color={data.value?'green':'red'}
                            onPress={ ()=> this.onChangePart(data, index) } />
                )}
            </View>
        );
    }
}