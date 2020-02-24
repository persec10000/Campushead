import { Body, Container, Header } from "native-base";
import React, { Component } from "react";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AStorageManager from '../asyncStorageManager';
import Utils from '../utils';

import { BackHandler, Image, Platform, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Colors, Metrics } from "../../themes";

import FireBaseApp from "../config";
import styles from "./styles";

var jwtDecode = require('jwt-decode');

class Teams extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    AStorageManager.removeTeamId();
  }

  _retrieveData = async () => { // set the userId to firebase.
    try {
      const token = await AStorageManager.getToken();
      console.log(token)
      if (Utils.isNotEmpty(token)) {
        // var decoded = await jwtDecode(token);        
        // var id = decoded.user.id     
        console.log('when in the teams screen user id:', this.props.user.id);
        FireBaseApp
          .firestore()
          .collection("users")
          .doc(FireBaseApp.auth().currentUser.uid)
          .update({
            userId: this.props.user.id
          });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  UNSAFE_componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentDidMount() {
    this._retrieveData() // set the user id to firebase
  }
  handleBackButtonClick = () => {
    BackHandler.exitApp()
    return true;
  };

  render() {
    StatusBar.setBarStyle("light-content", true);
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(Colors.backgroundcolor, true);
      StatusBar.setTranslucent(true);
    }
    return (
      <Container style={styles.mainview}>
        <Header androidStatusBarColor={"transparent"} style={styles.header}>
          <Body style={styles.body}>
            <Text style={styles.Dashboardtext}>Teams</Text>
          </Body>
        </Header>
        <View style={{ backgroundColor: Colors.backgroundcolor, height: Metrics.HEIGHT * 0.01, width: Metrics.WIDTH }} />
        <View style={{ flexDirection: 'row', marginTop: Metrics.HEIGHT * 0.15 }}>
          <View style={{ width: Metrics.WIDTH * 0.15 }} />
          <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate("CreateTeam")}>
            <Image style={{ width: Metrics.WIDTH * 0.3, height: Metrics.WIDTH * 0.3, }}
              source={require('../../images/create_team.png')} />
            <Text style={{ textAlign: 'center' }}>Create Team</Text>
          </TouchableOpacity>
          <View style={{ width: Metrics.WIDTH * 0.1 }} />
          <TouchableOpacity style={{ flex: 1 }} onPress={() => this.props.navigation.navigate("TeamList")}>
            <Image style={{ width: Metrics.WIDTH * 0.3, height: Metrics.WIDTH * 0.3, }}
              source={require('../../images/join_team.png')} />
            <Text style={{ textAlign: 'center' }}>Join Team</Text>
          </TouchableOpacity>
          <View style={{ width: Metrics.WIDTH * 0.15 }} />
        </View>
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

export default connect(mapStateToProps, null)(Teams)
