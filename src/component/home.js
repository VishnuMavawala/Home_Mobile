import React from 'react';
import Pusher from 'pusher-js/react-native';
import { View, Text, Button, TextInput, AsyncStorage, ActivityIndicator, Image } from 'react-native';
import u112Img from '../img/u112.jpg'
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
                {this.state.btn.length == 4
                ?
                    <View>
                        <Image source={u112Img} style={{ width: 200, height: 200 }} />
                        <View style={{ position: 'absolute', top: '40%', left: 0 }}>
                            <Button title={this.state.btn[0].key.toString()} color={this.state.btn[0].value ? 'green' : 'red'} onPress={() => this.onChangePart(this.state.btn[0], 0)} />
                        </View>
                        <View style={{ position: 'absolute', top: '50%', right: 0 }}>
                            <Button title={this.state.btn[1].key.toString()} color={this.state.btn[1].value ? 'green' : 'red'} onPress={() => this.onChangePart(this.state.btn[1], 1)} />
                        </View>
                        <View style={{ position: 'absolute', bottom: '30%', left: '15%' }}>
                            <Button title={this.state.btn[2].key.toString()} color={this.state.btn[2].value ? 'green' : 'red'} onPress={() => this.onChangePart(this.state.btn[2], 2)} />
                        </View>
                        <View style={{ position: 'absolute', bottom: '4%', right: '20%' }}>
                            <Button title={this.state.btn[3].key.toString()} color={this.state.btn[3].value ? 'green' : 'red'} onPress={() => this.onChangePart(this.state.btn[3], 3)} />
                        </View>
                    </View>
                :
                    <View>
                        {this.state.btn.map((data, index) =>
                            <Button title={data.key.toString()}
                                    color={data.value ? 'green' : 'red'}
                                    onPress={() => this.onChangePart(data, index)}/>
                        )}
                    </View>
                }
            </View>
        );
    }
}