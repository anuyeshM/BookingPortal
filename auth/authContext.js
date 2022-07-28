import { createContext } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  accessToken: "",
  token: {},
  user: {},
  initiateLogin: (params) => {},
  handleAuthentication: (params) => {},
  logout: (params) => {}
});

export const AuthProvider = AuthContext.Provider;
export const AuthConsumer = AuthContext.Consumer;
export default AuthContext