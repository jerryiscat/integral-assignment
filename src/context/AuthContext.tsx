import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert, AppState } from "react-native";
import * as Linking from "expo-linking";
import { supabase } from "../../lib/supabase";
import * as AuthSession from "expo-auth-session";

const AuthContext = createContext({
  user: null,
  checkAuth: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    // console.log("Checking authentication...");
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error fetching session:", sessionError.message);
      return;
    }

    // console.log("Session Data:", sessionData);

    if (sessionData?.session?.user) {
      // console.log("User found:", sessionData.session.user.email);
      setUser(sessionData.session.user);
    } else {
      // console.log("No user session found.");
      setUser(null);
    }
  };

  const handleDeepLink = async (url) => {
    if (!url) return;
    console.log("Handling deep link:", url);
  
    // const { path, queryParams } = Linking.parse(url);
    // const { access_token, refresh_token } = queryParams;
  
    // if (!access_token) {
    //   console.log("No access token found in deep link.");
    //   return;
    // }
    const fragment = url.split("#")[1];
    if (!fragment) {
      console.log("No fragment found in the URL.");
      return;
    }
    const params = new URLSearchParams(fragment); 
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
  
    if (!access_token || !refresh_token) {
      console.log("Access token or refresh token missing from the URL.");
      return;
    }
  
  
    // console.log("Deep Link Tokens:", { access_token, refresh_token });
  
    const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
  
    if (error) {
      console.error("Error setting session:", error.message);
    } else {
      // console.log("User authenticated via deep link:", data.session?.user?.email);
      setUser(data.session?.user);
    }
  };
  

  useEffect(() => {
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user); 
      } else {
        setUser(null); 
      }
    });

    const subscription = Linking.addEventListener("url", ({ url }) => handleDeepLink(url));

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        console.log("App resumed, checking auth...");
        checkAuth();
      }
    };
    const appStateListener = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove();
      appStateListener.remove();
    };
  }, []);

  return <AuthContext.Provider value={{ user, checkAuth }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
