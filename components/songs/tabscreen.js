import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';
import {Fonts, Metrics, Colors} from '../../themes/';
import Songs from './index';
import SongsOfFocus from './songs_of_focus';
import styles from './styles';

const TabScreen = createMaterialTopTabNavigator (
  {
    Songs: {screen: Songs},
    'Songs of Focus': {screen: SongsOfFocus},
  },
  {
    tabBarPosition: 'top',
    swipeEnabled: false,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: '#FFFFFF',
      inactiveTintColor: '#AAAAAA',
      style: {
        backgroundColor: Colors.backgroundcolor,
        borderBottomColor: 'transparent',
        ...Platform.select ({
          ios: {},
          android: {
            paddingTop: 16,
            // paddingBottom: Metrics.HEIGHT * 0.015
          },
        }),
        elevation: 0,
      },
      labelStyle: {
        textAlign: 'center',
        // color: 'white',
        fontSize: Fonts.moderateScale (14),
        fontFamily: Fonts.type.SFUIDisplaySemibold,
        fontWeight: 'bold',
      },
      indicatorStyle: {
        borderBottomColor: '#FFFFFF',
        borderBottomWidth: 2,
      },
    },
  }
);

//making a StackNavigator to export as default
const App = createStackNavigator ({
  TabScreen: {
    screen: TabScreen,
    navigationOptions: {
      headerStyle: styles.tabHeader,
      //  headerTintColor: '#FFFFFF',
      //   title: 'TabExample',
    },
  },
});
export default createAppContainer (TabScreen);
// export default <SafeAreaView>createAppContainer (TabScreen)</SafeAreaView>
