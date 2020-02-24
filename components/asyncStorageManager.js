import AsyncStorage from '@react-native-community/async-storage';
import Utils from '../components/utils';

export default class AStorageManager {
  static _token = '';

  static async setToken (token) {
    try {
      await AsyncStorage.setItem ('token', token);
      this._token = token;
    } catch (error) {
      console.log ('Something went wrong', error);
    }
  }

  static async getToken () {
    try {
      if (Utils.isNotEmpty (this._token)) return this._token;
      let token = await AsyncStorage.getItem ('token');
      return token;
    } catch (error) {
      console.log ('Something went wrong', error);
    }
  }

  static async removeToken () {
    try {
      this._token = '';
      await AsyncStorage.setItem ('token', '');
    } catch (error) {
      console.log ('Something went wrong', error);
    }
  }

  /**
 *profile: {
    id: 0,
    email: '',
    username: '',
    nickname: '',
    profileURL: '',
    membership: /null/individual/free,
    role: /null/none-member/Member/Owner,
    position: null,
  },
 */

  static async setProfile (profile) {
    try {
      let _profile = JSON.stringify (profile);
      console.log ('use Profile:', _profile);
      await AsyncStorage.setItem ('profile', _profile);
    } catch (error) {
      console.log ('Something went wrong', error);
    }
  }

  static async getProfile () {
    try {
      let _profile = await AsyncStorage.getItem ('profile');
      console.log ('userProfile:', _profile);
      if (_profile == null) return {};
      return JSON.parse (_profile);
    } catch (error) {
      console.log ('Something went wrong', error);
    }
  }

  static async removeProfile () {
    try {
      await AsyncStorage.removeItem ('profile');
    } catch (error) {
      console.log ('Something went wrong', error);
    }
  }

  static async setTeamId (teamId) {
    try {
      console.log ('set team id: ', teamId);
      await AsyncStorage.setItem ('team_id', teamId.toString ());
    } catch (error) {
      console.log ('Something went wrong', error);
    }
  }

  static async getTeamId () {
    try {
      let _teamId = await AsyncStorage.getItem ('team_id');
      if (Utils.isEmpty (_teamId)) return null;
      return parseInt (_teamId);
    } catch (error) {
      console.log ('Something went wrong', error);
    }
  }

  static async removeTeamId () {
    try {
      await AsyncStorage.removeItem ('team_id');
    } catch (error) {
      console.log ('Something went wrong', error);
    }
  }

  /**
 *let teamPayload = {
    teamId: 0,
    teamName: '',
    isExistTeam: false,
    role: /null/none-member/Member/Owner,,
    joinState: /0/1/2,
  };
 * 
 */

  static async setTeamProfile (teamProfile) {
    try {
      let _teamProfile = JSON.stringify (teamProfile);
      console.log ('set team profile: ', _teamProfile);
      await AsyncStorage.setItem ('team_profile', _teamProfile);
    } catch (error) {
      console.log ('Something went wrong', error);
    }
  }

  static async getTeamProfile () {
    try {
      let _profile = await AsyncStorage.getItem ('team_profile');
      console.log ('get team profile:', _profile);
      if (_profile == null) return {};
      return JSON.parse (_profile);
    } catch (error) {
      console.log ('Something went wrong', error);
    }
  }

  static async removeTeamProfile () {
    try {
      await AsyncStorage.removeItem ('team_profile');
    } catch (error) {
      console.log ('Something went wrong', error);
    }
  }
}
