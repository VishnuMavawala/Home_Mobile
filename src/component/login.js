import React, { Component } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator, AsyncStorage } from 'react-native';
import axios from 'axios';

export default class login extends Component
{
    constructor(props)
    {
        super(props);
        this.state={
            username: 'Vishnu',
            password: 'Vishnu123',
            activity: false
        }
        AsyncStorage.getItem('user').then((result)=> {
            result && this.props.navigation.navigate("home", { user: result });
        });
    }

    checkAuthentication()
    {
        this.setState({ activity: true });

        axios.post('https://vishnumavawala.000webhostapp.com/Home/login.php', this.state)
            .then((res) => {
                if(res.data.status=="Successful") {
                    AsyncStorage.setItem('user', res.data.user);
                    this.props.navigation.navigate("home", { user: res.data.user});
                    this.setState({ username: '', password: ''});
                }
                else {
                    Alert.alert(
                        'Authentication',
                        'Invalid Username and Password',
                        [
                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        {cancelable: false}
                    )
                }
                this.setState({ activity: false });
            });
    }

    render()
    {
        if(this.state.activity)
            return (<ActivityIndicator style={{ flex: 1 }} size="small" color='#0000ff' />);
        else
            return(
                <View style={{ flex: 1, top: 25 }}>
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(username) => this.setState({username})}
                        placeholder="Enter Username"
                        value={this.state.username}/>
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(password) => this.setState({password})}
                        placeholder="Enter Password"
                        value={this.state.password}
                        secureTextEntry={true} />
                    <Button title="Next" onPress={() => this.checkAuthentication()} />
                </View>
            );
    }
}