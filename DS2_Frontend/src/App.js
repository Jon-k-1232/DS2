import Router from './Routes/PrimaryRouter';
import ThemeConfig from './Theme';
import GlobalStyles from './Theme/globalStyles';
import { createContext, useState } from 'react';

let context = createContext();

export default function App() {
  const windowUserID = window.sessionStorage.getItem('userID') || null;
  const windowAccountID = window.sessionStorage.getItem('accountID') || null;
  const windowToken = window.sessionStorage.getItem('token') || null;

  let [loggedInUser, setLoggedInUser] = useState(
    {
      accountID: windowAccountID,
      userID: windowUserID,
      displayName: null,
      role: null,
      accessLevel: null,
      token: windowToken
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
