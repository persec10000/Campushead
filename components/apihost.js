import AsyncStorage from '@react-native-community/async-storage';
import AStorageManager from './asyncStorageManager';

const ip = {
    // api_host:"http://api.campushead.com:8080"
    api_host: "http://192.168.208.84:8080"
}

export const hostUrl = "http://192.168.208.84:8080";
// export const hostUrl = "http://api.campushead.com:8080";

export const getHeaders = async () => {
    var token = await AStorageManager.getToken();
    let headers = new Headers();
    headers.append ('Access-Control-Allow-Origin', hostUrl);
    headers.append ('Access-Control-Allow-Credentials', 'true');
    headers.append ('Content-Type', 'application/json');
    headers.append ('authorization', 'Bearer ' + token);
    return headers;
  };
  
export default ip