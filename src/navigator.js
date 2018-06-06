import { StackNavigator } from 'react-navigation';
import home from './component/home';
import login from './component/login';

const Navigation = StackNavigator({
    login: { screen: login },
    home: { screen: home },
},{ navigationOptions: {
        header: null
    }});

export default Navigation