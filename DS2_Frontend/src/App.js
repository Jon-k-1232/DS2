import Router from './Routes/PrimaryRouter';
import ThemeConfig from './Theme';
import GlobalStyles from './Theme/globalStyles';
import { createContext, useState } from 'react';
// import UserService from './Services/UserService';

let context = createContext();

export default function App() {
  // Hook for Context, holds user info once logged in.
  // let [loggedInUser, setLoggedInUser] = useState(
  //   {
  //     accountID: UserService.getUserAccountID(),
  //     userID: UserService.getUserId(),
  //     displayName: UserService.getUserDisplayName(),
  //     role: UserService.getUserRole(),
  //     accessLevel: UserService.getUserAccessLevel()
  //   } || {}
  // );
  let [loggedInUser, setLoggedInUser] = useState(
    {
      accountID: 2,
      userID: 1,
      displayName: 'Kasi Kimmel',
      role: 'Admin',
      accessLevel: 'Admin'
    } || {}
  );

  return (
    <ThemeConfig>
      <context.Provider value={{ loggedInUser, setLoggedInUser }}>
        <GlobalStyles />
        <Router />
      </context.Provider>
    </ThemeConfig>
  );
}

export { context };
