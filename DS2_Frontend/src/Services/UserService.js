const UserService = {
  saveUserId(user) {
    window.sessionStorage.setItem('userId', user.userID);
    window.sessionStorage.setItem('user', user.displayName);
    window.sessionStorage.setItem('role', user.role);
    window.sessionStorage.setItem('accessLevel', user.accessLevel);
    window.sessionStorage.setItem('accountID', user.accountID);
  },
  getUserAccountID() {
    return window.sessionStorage.getItem('accountID');
  },
  getUserId() {
    return window.sessionStorage.getItem('userId');
  },
  getUserDisplayName() {
    return window.sessionStorage.getItem('user');
  },
  getUserRole() {
    return window.sessionStorage.getItem('role');
  },
  getUserAccessLevel() {
    return window.sessionStorage.getItem('accessLevel');
  },
  clearUserId() {
    window.sessionStorage.removeItem('userId');
    window.sessionStorage.removeItem('user');
    window.sessionStorage.removeItem('role');
    window.sessionStorage.removeItem('accessLevel');
    window.sessionStorage.removeItem('accountID');
  }
};

export default UserService;
