import React, {PropTypes, Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';

import {doLogin, googleLogin, facebookLogin} from '../../redux/actions/user';

import {
  Text,
  View,
  Image,
  TextInput,
  Platform,
  StatusBar,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  BackHandler,
  Alert,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import {Container} from 'native-base';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import {Actions} from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
import Ip from '../apihost';
const api_host = Ip.api_host;
// Screen Styles
import styles from './styles';
import Spinner from 'react-native-loading-spinner-overlay';

// firebase
import firebase from 'react-native-firebase';
import Toast from 'react-native-easy-toast';
import {Metrics} from '../../themes';
import FireBaseApp from '../config';
// import { LoginManager } from 'react-native-fbsdk';
const FBSDK = require ('react-native-fbsdk');
const {LoginManager, AccessToken} = FBSDK;
GoogleSignin.configure();

class SignIn extends Component {
  constructor (props) {
    super (props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind (this);
    this.state = {
      username: '',
      email: '',
      password: '',
    };
  }

  UNSAFE_componentWillMount () {
    var that = this;
    BackHandler.addEventListener ('hardwareBackPress', function () {
      this.props.navigation.navigate ('SignIn');
      return true;
    });
  }

  componentWillUnmount () {
    BackHandler.removeEventListener (
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  componentDidMount () {
    this.fireBaseListener = FireBaseApp.auth ().onAuthStateChanged (auth => {
      if (auth) {
        this.firebaseRef = FireBaseApp.database ().ref ('users');
        this.firebaseRef.child (auth.uid).on ('value', snap => {
          const user = snap.val ();
          if (user != null) {
            this.firebaseRef.child (auth.uid).off ('value');
            this.goHome (user);
          }
        });
      } else {
        this.setState ({showSpinner: false});
      }
    });
  }

  handleBackButtonClick = () => {
    // BackHandler.exitApp()
    return true;
  };

  signup () {
    this.props.navigation.navigate ('SignUp');
  }

  handleClick () {
    if (this.state.email === '') {
      alert ('Please enter your email.');
      this.refs.email.focus ();
      return true;
    }

    if (this.state.password === '') {
      alert ('Please enter your password.');
      return true;
    }

    this.props.doLogin (
      this.state.email,
      this.state.password,
      this.refs,
      this.props.navigation
    );

  }

  getTerms () {
    return 'Terms and Conditions';
  }

  googleSignIn = async () => {
    this.props.googleLogin(this.refs, this.props.navigation);
  };

  onPressLogin () {
    LoginManager.logInWithPermissions ([
      'public_profile',
      'email',
    ]).then (result => this._handleCallBack (result), function (error) {
      alert ('Login fail with error: ' + error);
    });
  }

  _handleCallBack (result) {
    console.log ('result = ', result);
    if (result.isCancelled) {
      alert ('Login cancelled');
    } else {
      AccessToken.getCurrentAccessToken ().then (data => {
        const token = data.accessToken;
        console.log('data ==============', data);
        console.log ('token ============ ', token);
        fetch (
          'https://graph.facebook.com/v2.8/me?fields=id,email,name&access_token=' +
            token
        )
          .then (response => response.json ())
          .then (json => {
            console.log ('json ==== ', json);
            this.props.facebookLogin(json.email, json.name, json.id, refs, this.props.navigation);
            // const imageSize = 120
            // const facebookID = json.id
            // const fbImage = `https://graph.facebook.com/${facebookID}/picture?height=${imageSize}`
            // this.authenticate (token)
            //   .then (function (result) {
            //     const {uid} = result;
            //     console.log (result, json, token);
            //     // _this.createUser(uid, json, token, fbImage)
            //   })
            //   .catch (error => {
            //     console.log (error);
            //   });
          })
          .catch (function (err) {
            console.log ('err ============= ', err);
          });
      });
    }
  }

  authenticate = token => {
    const provider = FireBaseApp.auth.FacebookAuthProvider;
    const credential = provider.credential (token);
    console.log ('credential = ', credential);
    let ret = FireBaseApp.auth ().signInWithCredential (credential);
    return ret;
  };

  createUser = (uid, userData, token, dp) => {
    const defaults = {
      uid,
      token,
      dp,
      ageRange: [20, 30],
    };
    FireBaseApp.database ()
      .ref ('users')
      .child (uid)
      .update ({...userData, ...defaults});
  };

  render () {
    StatusBar.setBarStyle ('light-content', true);

    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor ('#222f3e', true);
      StatusBar.setTranslucent (true);
    }

    const {loading} = this.props;
    return (
      <Container style={styles.container}>
        <Spinner
          visible={loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.logo}>
          <Image
            style={styles.logoimage}
            source={require ('../../images/logo.png')}
          />
        </View>
        <ScrollView>
          <View style={{marginTop: 20}}>
            <TextInput
              style={styles.textInput}
              placeholder="Email"
              placeholderTextColor="#b7b7b7"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={email => this.setState ({email})}
              textAlign={I18nManager.isRTL ? 'right' : 'left'}
              tintColor="#0691ce"
              returnKeyType="next"
              ref="email"
              onSubmitEditing={() => this.refs.password.focus ()}
            />

            <TextInput
              style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#b7b7b7"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              keyboardType="default"
              value={this.state.password}
              onChangeText={password => this.setState ({password})}
              textAlign={I18nManager.isRTL ? 'right' : 'left'}
              secureTextEntry={true}
              tintColor="#0691ce"
              returnKeyType="go"
              ref="password"
              // onSubmitEditing={()=> this.refs.password.focus()}
            />

            <TouchableOpacity
              style={styles.buttonSignIn}
              onPress={() => this.handleClick ()}
            >
              <Text style={styles.textWhite}>Sign In</Text>
            </TouchableOpacity>

            <View
              style={{
                flex: 1,
                alignItems: 'center',
                borderRadius: 50,
                flexDirection: 'row',
                justifyContent: "center",
                marginTop: Metrics.HEIGHT * 0.01,
              }}
            >
              <FontAwesome.Button
                style={styles.facebookLogIn}
                name="facebook" 
                onPress={this.onPressLogin.bind (this)}
              >
                <Text style={styles.textWhite}>Login with FaceBook</Text>
              </FontAwesome.Button>
              <View style={styles.socialBtnSpace}/>
              <FontAwesome.Button
                style={styles.googleLogIn}
                name="google"
                onPress={this.googleSignIn.bind (this)}
              >
                <Text style={styles.textWhite}>Login with Google</Text>
              </FontAwesome.Button>

            </View>
            <View style={styles.tcview}>
              <Text style={styles.textPolicyDescription}>
                Clicking register means that you agree to the
              </Text>
              <View style={styles.tandcView}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate ('TermsAndCondition')}
                >
                  <Text style={styles.textTermsCondition}>
                    Terms & Conditions
                  </Text>
                </TouchableOpacity>
                <Text style={styles.ands}> and Privacy Policy</Text>
                {/* <TouchableOpacity onPress={() => alert("Privacy Policy")}>
                  <Text style={styles.textTermsCondition}>Privacy Policy</Text>
                </TouchableOpacity> */}
              </View>
            </View>
            <TouchableOpacity
              style={styles.viewAlreadyHaveAccount}
              onPress={() => this.props.navigation.navigate ('SignUp')}
            >
              <Text style={styles.textAlreadyHaveAccount}>
                Create an account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Toast ref="toast" style={{maxWidth: '80%'}} />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.user.loading,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators (
    {
      doLogin,
      googleLogin,
      facebookLogin,
    },
    dispatch
  );
};

export default connect (mapStateToProps, mapDispatchToProps) (SignIn);
