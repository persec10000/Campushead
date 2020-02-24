import React, { Component } from 'react';
import { Dimensions, Image, Platform, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { preprocess } from '../redux/actions/splash';

const { width, height } = Dimensions.get('window');

class Splash extends Component {
  constructor(props) {
    super(props);
    setTimeout(() => {
      this._bootstrapAsync();
    }, 500);
  }

  _bootstrapAsync = () => {
    console.log('bootstrap');
    try {
      this.props.preprocess(this.props.navigation);  // This will switch to the App screen or Auth screen and this loading screen will be unmounted and thrown away.
    } catch (error) {
      console.log('error', error);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../images/logo.png')} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators (
    {
      preprocess
    },
    dispatch
  );
};

export default connect(null, mapDispatchToProps)(Splash);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222f3e',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },

  logo: {
    width: Platform.OS === 'android' ? width * 0.6 : width * 0.7,
    height: width * 0.21,
  },
});
