import PushAlert from './notification';

class SessionManager {
  static isSessionValid(expiryTime) {
    return (new Date(expiryTime)).getTime() > (new Date()).getTime();
  }

  static getAuthSession() {
    try {
      const loginInfo  = JSON.parse(localStorage.getItem('loggedUser'));
      
      if(!loginInfo) throw Error('Session lost!');

      // to be later controlled on number of days once token refresh comes in
      if( !this.isSessionValid(
        (loginInfo.data.data.expiresAt || loginInfo.data.token.expires_in)
      )) {
        SessionManager.resetAuthSession();
        PushAlert.warning('Your session has expired. Please login again...');
        return null;
      }

      return loginInfo;

    } catch (e) {
      SessionManager.resetAuthSession();
      console.log(e.message);
    }
  }

  static setAuthSession(params) {
    const loginInfo = {
      timestamp: (new Date()).getTime(),
      data: params
    }
    localStorage.setItem('loggedUser', JSON.stringify(loginInfo));
  }

  static resetAuthSession() {
    localStorage.clear();
  }
}

export default SessionManager;