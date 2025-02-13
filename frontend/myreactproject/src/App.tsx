import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppRoutes from "./router";

const clientId = "493735588229-7tn4qrs22e404m7te2gffriqpthdav2r.apps.googleusercontent.com";

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AppRoutes />
    </GoogleOAuthProvider>
  );
};

export default App;
