import React, { useEffect } from "react";
import { Alert, StyleSheet, View, Platform } from "react-native";
import { Button } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { supabase } from "../../../lib/supabase";

WebBrowser.maybeCompleteAuthSession(); // Required for web only
const redirectTo = AuthSession.makeRedirectUri({ useProxy: true });

const createSessionFromUrl = async (url: string) => {
  if (!url) return;
//   console.log("Handling deep link:", url);

  const fragment = url.split("#")[1];  
  const params = new URLSearchParams(fragment); 
  const access_token = params.get("access_token");
  const refresh_token = params.get("refresh_token");

  const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });

  if (error) {
    console.error("Error setting session:", error.message);
  } else {
    // console.log("User authenticated via deep link:", data.user.email);
    return data.user;
  }
};

const performGoogleOAuth = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://nxajlfqtadlelymdtrly.supabase.co/auth/v1/callback",
        skipBrowserRedirect: true,
      },
    });

    if (error) throw error;

    const res = await WebBrowser.openAuthSessionAsync(data?.url ?? "", redirectTo);
    if (res.type === "success") {
      await createSessionFromUrl(res.url);
    }
  } catch (err) {
    Alert.alert("Google Login Error", err.message);
  }
};


const sendMagicLinkWithEmail = async (email: string) => {
  if (!email.trim()) {
    Alert.alert("Error", "Please enter a valid email.");
    return;
  }

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://nxajlfqtadlelymdtrly.supabase.co/auth/v1/callback",
      },
    });

    if (error) throw error;
    Alert.alert("Success", "Check your email for the magic link!");
  } catch (err) {
    Alert.alert("Magic Link Error", err.message);
  }
};


const promptForEmail = () => {
  if (Platform.OS === "ios") {
    Alert.prompt(
      "Enter your Email",
      "Please enter your email to receive a magic link.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: (email) => {
            if (email && email.trim().length > 0) {
              sendMagicLinkWithEmail(email.trim());
            } else {
              Alert.alert("Error", "Email is required.");
            }
          },
        },
      ],
      "plain-text"
    );
  } else {
    Alert.alert("Not Supported", "This feature is only supported on iOS for now.");
  }
};

export default function OAuth() {

  return (
    <View style={styles.container}>
      <Button
        title="Login with Google"
        onPress={performGoogleOAuth}
        icon={<Ionicons name="logo-google" size={20} color="white" style={styles.icon} />}
        buttonStyle={styles.button}
      />

      <Button
        title="Send Magic Link"
        onPress={promptForEmail}
        icon={<Ionicons name="mail" size={20} color="white" style={styles.icon} />}
        buttonStyle={styles.button}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  button: {
    marginVertical: 10,
  },
});
