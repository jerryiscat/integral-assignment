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
  const redirectTo = AuthSession.makeRedirectUri({ scheme: "com.myapp" });

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
      console.log("No user session found.");
      setUser(null);
    }
  };

  const handleDeepLink = async (url) => {
    if (!url) return;
    // console.log("Handling deep link:", url);
  
    const { path, queryParams } = Linking.parse(url);
    const { access_token, refresh_token } = queryParams;
  
    if (!access_token) {
      console.log("No access token found in deep link.");
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

    // ✅ Listen for deep link redirects (Correct way)
    const subscription = Linking.addEventListener("url", ({ url }) => handleDeepLink(url));

    // ✅ Handle deep link if app was opened via a link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // ✅ Recheck auth when app resumes from the background
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        console.log("App resumed, checking auth...");
        checkAuth();
      }
    };
    const appStateListener = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      subscription.remove(); // ✅ Correct way to remove event listener
      appStateListener.remove();
    };
  }, []);

  return <AuthContext.Provider value={{ user, checkAuth }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
