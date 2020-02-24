import AsyncStorage from '@react-native-community/async-storage';
import Moment from 'moment';
import {Container} from 'native-base';
import React, {Component} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  FlatList,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SearchBar} from 'react-native-elements';
import FlashMessage from 'react-native-flash-message';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getSbtList} from '../../redux/actions/sbt';
import {Colors, Metrics} from '../../themes';
import Ip from '../apihost';
import BottomBar from '../bottombar/index';
import FireBaseApp from '../config';
import Utils from '../utils';
import styles from './styles';

class SongsOfFocus extends Component {
  constructor (props) {
    super (props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind (this);
    this.filterSbtList = this.filterSbtList.bind (this);
    this.state = {
      value: '',
    };
  }

  componentDidMount () {
    try {
      this.checkPermission ();
      this.createNotificationListeners ();
    } catch (err) {
      console.log ('error---->>', err);
    }
    var teamId = this.props.team.teamId;
    console.log ('when retrieve in the songs of focus, team_id: ', teamId);
    if (Utils.isNotEmptyOrZero (teamId)) {
      this.props.getSbtList (teamId, false); // refresh = false
    }
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#dcdde1',
        }}
      />
    );
  };

  filterSbtList () {
    var searchKey = this.state.value;
    if (this.props.sbt.sbtList == []) return [];
    console.log ('===>', this.props.sbt.sbtList);
    var _sbtList = this.props.sbt.sbtList;
    console.log ('this.props.sbt.sbtList;', _sbtList);
    console.log ('=======>');
    var filteredList = _sbtList;
    var filteredList = _sbtList.filter (eachSong => {
      console.log (eachSong.name);
      // return true;
      return Utils.isContain (eachSong.name, searchKey);
      //   // const _songName = `${eachSong.name.toUpperCase ()}`;
      //   // searchKey = searchKey.toUpperCase ();
      //   // return _songName.indexOf (searchKey) > -1;
    });
    console.log ('filtered team list', filteredList);
    return filteredList;
    // return [];
  }
  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search..."
        lightTheme
        round
        onChangeText={text =>
          this.setState ({
            value: text,
          })}
        autoCorrect={false}
        value={this.state.value}
      />
    );
  };

  renderFooter = () => {
    if (!this.props.loading || this.props.refreshing) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: '#CED0CE',
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  UNSAFE_componentWillMount () {
    BackHandler.addEventListener (
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  componentWillUnmount () {
    try {
      this.notificationListener &&
        typeof this.notificationListener == 'function' &&
        this.notificationListener ();
      this.notificationOpenedListener &&
        typeof this.notificationOpenedListener == 'function' &&
        this.notificationOpenedListener ();
      this.messageListener &&
        typeof this.messageListener == 'function' &&
        this.messageListener ();
    } catch (e) {}
    BackHandler.removeEventListener (
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick = () => {
    // this.props.navigation.navigate("Login");
    // this.props.navigation.goBack(null);
    // Actions.pop();
    return true;
  };

  handleRefresh = () => {
    var teamId = this.props.team.teamId;
    console.log ('when refresh in the songs of focus, team_id: ', teamId);
    if (Utils.isNotEmptyOrZero (teamId)) {
      this.props.getSbtList (teamId, true); // refresh = true
    }
  };

  setDate (date) {
    var time = Moment (date).format ();
    var time = Moment.utc (time).format ('YYYY-MM-DDTHH:mm:ss.SSS');
    return time;
  }

  updateDeviceToken (fcmToken) {
    FireBaseApp.firestore ()
      .collection ('users')
      .doc (FireBaseApp.auth ().currentUser.uid)
      .update ({
        fcmToken: fcmToken,
      });
  }

  /*********** Notification Part **************/

  //1
  async checkPermission () {
    try {
      const enabled = await FireBaseApp.messaging ().hasPermission ();
      if (enabled) {
        this.getToken ();
      } else {
        this.requestPermission ();
      }
    } catch (e) {
      console.log ('error ---->>>', e);
    }
  }

  //3
  async getToken () {
    let fcmToken = await AsyncStorage.getItem ('fcmToken');
    if (!fcmToken) {
      try {
        fcmToken = await FireBaseApp.messaging ().getToken ();
      } catch (e) {
        console.log ('error ---->>', e);
      }
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem ('fcmToken', fcmToken);
      }
    }

    if (fcmToken) {
      this.updateDeviceToken (fcmToken);
    }
  }

  //2
  async requestPermission () {
    try {
      await FireBaseApp.messaging ().requestPermission ();
      // User has authorised
      this.getToken ();
    } catch (error) {
      // User has rejected permissions
      console.log ('permission rejected');
    }
  }

  messagePress () {
    console.log ('messagePressed');
    this.setState ({hasPressed: true});
    this.refs.fmLocalInstance.hideMessage ();
    // this.props.navigation.navigate("Songs")
  }

  messageShow () {
    this.setState ({hasShown: true});
  }

  messageHide () {
    this.setState ({hasHidden: true});
  }

  showSimpleMessage (type = 'default', notification) {
    const message = {
      message: notification.title,
      description: notification.body,
      type: 'success',
      hideStatusBar: true,
      onPress: this.messagePress.bind (this),
      onShow: this.messageShow.bind (this),
      onHide: this.messageHide.bind (this),
    };

    console.log (message);
    this.refs.fmLocalInstance.showMessage (message);
  }
  async createNotificationListeners () {
    try {
      this.messageListener = FireBaseApp.messaging ().onMessage (message => {
        //process data message
        alert ('messageListner');
        console.log ('messageListener', JSON.stringify (message));
      });

      this.notificationListener = FireBaseApp.notifications ().onNotification (
        notification => {
          console.log ('showalert');
          // this.showAlert(notification);
          var type = 'default';
          this.setState ({
            hasPressed: false,
            hasShown: false,
            hasHidden: false,
          });
          this.showSimpleMessage (type, notification);
        }
      );

      this.notificationOpenedListener = FireBaseApp.notifications ().onNotificationOpened (
        notificationOpen => {
          console.log ('opened');
          this.props.navigation.navigate ('Songs');
        }
      );

      const notificationOpen = await FireBaseApp.notifications ().getInitialNotification ();
      if (notificationOpen) {
        const {title, body} = notificationOpen.notification;
      }
    } catch (e) {}
  }

  render () {
    StatusBar.setBarStyle ('light-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor (Colors.backgroundcolor, true);
      StatusBar.setTranslucent (true);
    }

    const {team} = this.props;

    return (
      <Container style={styles.mainview}>
        <View
          style={{
            backgroundColor: Colors.backgroundcolor,
            height: Metrics.HEIGHT * 0.01,
            width: Metrics.WIDTH,
          }}
        />
        {team.isExistTeam
          ? <View style={{flex: 1}}>
              <FlatList
                data={this.filterSbtList ()}
                contentContainerStyle={{flexGrow: 0}}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.rowMain}
                    onPress={() => {
                      console.log (item, item.id);
                      this.props.navigation.navigate ('ViewSong', {
                        key: '',
                        song_id: item.id,
                        team_id: team.id,
                      });
                    }}
                  >
                    <View style={styles.subRow}>
                      <View style={styles.headerContent}>
                        {item.songkey == '' || item.songkey == null
                          ? <Text style={styles.headerText}>{item.name}</Text>
                          : <Text style={styles.headerText}>
                              {item.name}({item.songkey})
                            </Text>}

                      </View>
                      <Text numberOfLines={2} style={styles.recentMsg}>
                        {item.artist}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                // contentContainerStyle={{height: 100, flexGrow: 0}}
                keyExtractor={(item, index) => index.toString ()}
                ItemSeparatorComponent={this.renderSeparator}
                ListHeaderComponent={this.renderHeader}
                refreshing={this.props.refreshing}
                onRefresh={this.handleRefresh}
                onEndReachedThreshold={0}
              />
              <View style={{alignItems: 'center', marginBottom: 30, flex: 1, flexBasis: 60, flexGrow: 2}}>
                <Text style={styles.upgradeText1}>
                  To Add:{"\n"}
                  View desired song and press "Add to SONGS OF FOCUS"
                </Text>
              </View>
            </View>
          : <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            >
              <Text
                style={{
                  textAlign: 'center',
                  marginHorizontal: 20,
                  color: 'black',
                  fontSize: 18,
                }}
              >
                You have to be on a team to use app features
              </Text>
            </View>}
        <BottomBar navigation={this.props.navigation} />
        <FlashMessage
          ref="fmLocalInstance"
          position="top"
          animated={true}
          autoHide={true}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    team: state.team,
    sbt: state.sbt,
    loading: state.sbt.loading,
    refreshing: state.sbt.refreshing,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators ({getSbtList}, dispatch);
};

export default connect (mapStateToProps, mapDispatchToProps) (SongsOfFocus);
