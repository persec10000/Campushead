import AsyncStorage from '@react-native-community/async-storage';
import { Body, Button, Container, Header, Left, Right } from 'native-base';
import React, { Component } from 'react';
import { Alert, BackHandler, FlatList, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SearchBar } from 'react-native-elements';
import FlashMessage from 'react-native-flash-message';
import { ActivityIndicator } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { exitTeam, initialize, joinTeam, refreshTeamList} from '../../redux/actions/team';
import { Colors, Metrics } from '../../themes';
import { getHeaders, hostUrl } from '../apihost';
import BottomBar from '../bottombar/index';
import FireBaseApp from '../config';
import styles from './styles';

var notiFlag = 0;

class TeamList extends Component {
  constructor (props) {
    super (props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind (this);
    this.filterTeamList = this.filterTeamList.bind(this);
    this.joinClick = this.joinClick.bind (this);
    this.exitClick = this.exitClick.bind (this);
    this.updateDeviceToken = this.updateDeviceToken.bind (this);
    this.uid = null;
    this.state = {
      value: '',
    };
  }

  componentDidMount () {
    try {
      this.checkPermission ();
      this.createNotificationListeners ();
      FireBaseApp.auth ().onAuthStateChanged (user => {
        if (user) {
          console.log ('--------user uid ------->>', user.uid);
          this.uid = user.uid;
        }
      });
    } catch (err) {
      console.log ('firebase auth error---->>', err);
    }
    notiFlag = 1;
    
    try {
      console.log('initializing ...');
      this.props.initialize(this.props.user.id, this.props.team);
    } catch (error) {
      console.log('when retrieveData error: ', error);
    }
  }

  renderFooter = () => {
    if (!this.props.loading || this.props.refreshing) return null;
    console.log('rendering footer');
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

  filterTeamList(){
    var searchKey = this.state.value;
    console.log('this.props.team.teamList', this.props.team.teamList);
    var filteredList = this.props.team.teamList.filter(eachTeam=>{
      const _teamName = `${eachTeam.name.toUpperCase ()}`;
      searchKey = searchKey.toUpperCase ();
      return _teamName.indexOf (searchKey) > -1;
    })
    console.log('filtered team list', filteredList);
    return filteredList;
  }

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search..."
        lightTheme
        round
        onChangeText={text => this.setState({
          value: text
        })}
        autoCorrect={false}
        value={this.state.value}
      />
    );
  };

  UNSAFE_componentWillMount () {
    BackHandler.addEventListener (
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  componentWillUnmount () {
    if (notiFlag == 1) {
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
    }
    BackHandler.removeEventListener (
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick = () => {
    console.log ('back');
    return true;
  };

  async joinClick (id, name) {
    this.props.joinTeam(id, name, this.props.user, this.props.team, this.uid );
  }

  async exitClick (id, name) {
    console.log("when exit, teamId: teamName", id, name);
    this.props.exitTeam(id,  this.props.user, this.uid);
  }

  // user can create only one team
  async goToCreateTeam () {
    var _headers = await getHeaders();
    var userId = this.props.user.id;
    await fetch (hostUrl + '/team/getByUserId/' + userId, {
      method: 'GET',
      headers: _headers,
    }).then (response => {
      response.json ().then (data => {
        if (data[0].rowNum > 0) alert ('You can create only one Team.');
        else {
          this.props.navigation.navigate ('CreateTeam');
        }
      });
    });
  }

  updateDeviceToken (fcmToken) {
    if (this.uid) {
      FireBaseApp.firestore ().collection ('users').doc (this.uid).update ({
        fcmToken: fcmToken,
      });
    }
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

  showAlert (notification) {
    Alert.alert (
      notification.title,
      notification.body,
      [{text: 'OK', onPress: () => console.log ('OK')}],
      {cancelable: false}
    );
  }

  viewButton (id, name) {
    if (id != parseInt (this.props.team.teamId)) {
      return (
        <Button
          disabled={true}
          style={[
            styles.joinBtn,
            (color = 'secondary'),
            {backgroundColor: '#b2bec3'},
          ]}
          onPress={() => this.joinClick (id, name)}
        >
          <Text style={styles.joinText}>Join Team</Text>
        </Button>
      );
    } else if (this.props.team.role != 'owner') {
      switch (this.props.team.joinState) {
        case 0:
          console.log ('case 0');
          return (
            <Button
              disabled={false}
              style={[styles.joinBtn, (color = 'secondary')]}
              onPress={() => this.joinClick (id, name)}
            >
              <Text style={styles.joinText}>Join Team</Text>
            </Button>
          );
        // return true;
        case 1:
          return (
            <Button
              disabled={false}
              style={[styles.joinBtn, (color = 'secondary')]}
              onPress={() => this.exitClick (id, name)}
            >
              <Text style={styles.joinText}>Cancel Request</Text>
            </Button>
          );
        case 2:
          console.log ('case 2');
          return (
            <Button
              disabled={false}
              style={[styles.joinBtn, (color = 'secondary')]}
              onPress={() => this.exitClick (id, name)}
            >
              <Text style={styles.joinText}>Exit Team</Text>
            </Button>
          );
        default:
          return '#FFFFFF';
      }
    } else {
      console.log ('else');
      return (
        <Button
          disabled={false}
          style={[styles.joinBtn, (color = 'secondary')]}
          onPress={() => this.exitClick (id, name)}
        >
          <Text style={styles.joinText}>Exit Team</Text>
        </Button>
      );
    }
  }

  handleRefresh = () => {
    this.props.refreshTeamList(this.props.team);    
  };

  render () {
    StatusBar.setBarStyle ('light-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor (Colors.backgroundcolor, true);
      StatusBar.setTranslucent (true);
    }
    const {loading, refreshing, team, user} = this.props;
    return (
      <Container style={styles.mainview}>
        <Header androidStatusBarColor={'transparent'} style={styles.header}>
          <Left style={styles.left}></Left>
          <Body style={styles.body}>
            <Text style={styles.Dashboardtext}>List of Teams</Text>
          </Body>

          <Right style={styles.right}>
            <TouchableOpacity onPress={() => this.goToCreateTeam ()}>
              <MaterialCommunityIcons
                name="plus-circle-outline" //music-note-plus
                size={25}
                color={'#fff'}
              />
            </TouchableOpacity>
          </Right>
        </Header>
        <View
          style={{
            backgroundColor: Colors.backgroundcolor,
            height: Metrics.HEIGHT * 0.01,
            width: Metrics.WIDTH,
          }}
        />
         {console.log('when rendering', this.props.team)}
        <View style={{flex: 1}}>
          <FlatList
            data={this.filterTeamList()}
            renderItem={({item}) => (
              <View style={styles.rowMain}>
                <View style={styles.subRow}>
                  <View style={styles.headerContent}>
                    <Text style={styles.headerText}>{item.name}</Text>
                  </View>
                  <Text numberOfLines={2} style={styles.recentMsg}>
                    {item.location}
                  </Text>
                </View>
               {this.props.team.isExistTeam
                  ? <View style={styles.joinView}>
                      {this.viewButton (item.id, item.name)}
                    </View>
                  : <View style={styles.joinView}>
                      <Button
                        disabled={false}
                        style={styles.joinBtn}
                        onPress={() => this.joinClick (item.id, item.name)}
                      >
                        <Text style={styles.joinText}>Join Team</Text>
                      </Button>
                    </View>}

              </View>
            )}
            keyExtractor={(item, index) => index.toString ()}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            ListFooterComponent={this.renderFooter}
            refreshing={refreshing}
            onRefresh={this.handleRefresh}
            // onEndReached={this.handleLoadMore}
            onEndReachedThreshold={0}
          />
        </View>
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
    user: state.user,
    team: state.team,
    loading: state.team.loading,
    refreshing: state.team.refreshing
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators ({
    initialize,
    joinTeam,
    exitTeam,
    refreshTeamList
  }, dispatch);
};

export default connect (mapStateToProps, mapDispatchToProps) (TeamList);
