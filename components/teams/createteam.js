import {Body, Container, Header, Left, Right, Text} from 'native-base';
import React, {Component} from 'react';
import {
  BackHandler,
  Image,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TextInput} from 'react-native-paper';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createTeam} from '../../redux/actions/create_team';
import {Colors, Images, Metrics} from '../../themes';
import styles from './styles';

class CreateTeam extends Component {
  constructor (props) {
    super (props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind (this);
    this.state = {
      name: '',
      location: '',
    };
  }
  componentDidMount () {}

  async teamCreate () {
    this.props.createTeam (
      this.props.user.id,
      this.state.name,
      this.state.location,
      this.props.navigation
    );
  }

  UNSAFE_componentWillMount () {
    BackHandler.addEventListener (
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  componentWillUnmount () {
    BackHandler.removeEventListener (
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick = () => {
    // this.props.navigation.navigate("Login");
    this.props.navigation.navigate ('TeamList');
    // Actions.pop();
    return true;
  };
  render () {
    StatusBar.setBarStyle ('light-content', true);
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor (Colors.backgroundcolor, true);
      StatusBar.setTranslucent (true);
    }

    return (
      <Container style={styles.editcontainer}>
        <Header androidStatusBarColor={'transparent'} style={styles.header}>
          <Left style={styles.left}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate ('TeamList')}
            >
              <Image
                source={Images.BackIcon}
                style={{
                  height: Metrics.WIDTH * 0.06,
                  width: Metrics.WIDTH * 0.06,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </Left>

          <Body style={styles.body}>
            <Text style={styles.Dashboardtext}>Teams</Text>
          </Body>

          <Right style={styles.right} />
        </Header>
        <View
          style={{
            backgroundColor: Colors.backgroundcolor,
            height: Metrics.HEIGHT * 0.01,
            width: Metrics.WIDTH,
          }}
        />
        <KeyboardAwareScrollView>
          <View style={styles.contentOne}>
            {/* <Content> */}
            <View style={styles.floatingView}>

              {/* <View style={styles.floatingView}> */}
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 22,
                  color: 'black',
                  marginBottom: 10,
                }}
              >
                Create your own Team!
              </Text>
              {/* </View> */}
              <TextInput
                mode="outlined"
                // style={styles.inputContainerStyle}
                label="Team Name *"
                placeholder="Type something"
                value={this.state.name}
                onChangeText={name => this.setState ({name})}
                ref="name"
                onSubmitEditing={event => {
                  this.refs.location.focus ();
                }}
                returnKeyType="next"
              />

              <View style={{height: 10}} />

              <TextInput
                mode="outlined"
                // style={styles.inputContainerStyle}
                label="Location"
                placeholder="Type something"
                value={this.state.location}
                onChangeText={location => this.setState ({location})}
                ref="location"
                // onSubmitEditing={event => {
                //   this.refs.key.focus();
                // }}
                returnKeyType="go"
              />

              <TouchableOpacity
                onPress={() => this.teamCreate ()}
                style={[
                  styles.loginBg,
                  {
                    marginTop: Metrics.HEIGHT * 0.04,
                    marginBottom: Metrics.WIDTH * 0.02,
                  },
                ]}
              >
                <Text style={styles.activeTab}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>

        </KeyboardAwareScrollView>

      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    team: state.team,
    user: state.user,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators (
    {
      createTeam,
    },
    dispatch
  );
};

export default connect (mapStateToProps, mapDispatchToProps) (CreateTeam);
