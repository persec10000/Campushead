import { Container } from 'native-base';
import React, { Component } from 'react';
import {doRegister} from '../../redux/actions/user';
import { BackHandler, I18nManager, Image, Platform, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-easy-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import styles from './styles';

class SignUp extends Component {
  
  UNSAFE_componentWillMount() {
    var that = this;
    BackHandler.addEventListener ('hardwareBackPress', function () {
      this.props.navigation.navigate ('SignUp');
      return true;
    });
  }

  constructor (props) {
    super (props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind (this);
    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    };
  }

  handleRegister () {
    if (this.state.password !== this.state.passwordConfirm) {
      alert ('Password is not matched. Please try again.');
      this.refs.password.focus ();
      return true;
    }

    console.log (this.state.username, this.state.email, this.state.password);
    if (this.state.username == '') {
      alert ('Please Enter you name.');
      this.refs.name.focus ();
      return true;
    }
    if (this.state.email === '') {
      alert ('Please enter your email.');
      this.refs.email.focus ();
      return true;
    }

    if (this.state.password == '') {
      alert ('Please enter your password.');
      return true;
    }
    this.props.doRegister(
      this.state.email,
      this.state.username,
      this.state.password,
      this.refs,
      this.props.navigation
    );
    
  }

  componentWillUnmount () {
    BackHandler.removeEventListener (
      'hardwareBackPress',
      this.handleBackButtonClick
    );
  }

  handleBackButtonClick = () => {
    // BackHandler.exitApp()
    return true;
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
          <View style={{marginTop: 0}}>
            <TextInput
              style={styles.textInput}
              placeholder="Username"
              placeholderTextColor="#b7b7b7"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              keyboardType="default"
              value={this.state.username}
              onChangeText={username => this.setState ({username})}
              textAlign={I18nManager.isRTL ? 'right' : 'left'}
              tintColor="#0691ce"
              returnKeyType="next"
              ref="name"
              onSubmitEditing={() => this.refs.email.focus ()}
            />

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
              returnKeyType="next"
              ref="password"
              onSubmitEditing={() => this.refs.passwordConfirm.focus ()}
            />

            <TextInput
              style={styles.textInput}
              placeholder="Confirm Password"
              placeholderTextColor="#b7b7b7"
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="go"
              value={this.state.passwordConfirm}
              onChangeText={passwordConfirm =>
                this.setState ({passwordConfirm})}
              textAlign={I18nManager.isRTL ? 'right' : 'left'}
              secureTextEntry={true}
              tintColor="#0691ce"
              ref="passwordConfirm"
            />

            <TouchableOpacity
              style={styles.buttonSignUp}
              onPress={() => this.handleRegister ()}
            >
              <Text style={styles.textWhite}>Sign Up</Text>
            </TouchableOpacity>

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
              onPress={() => this.props.navigation.navigate ('SignIn')}
            >
              <Text style={styles.textAlreadyHaveAccount}>
                Already have an Account?
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
}

const mapDispatchToProps = dispatch =>{ 
  return bindActionCreators({
    doRegister,
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SignUp); 

