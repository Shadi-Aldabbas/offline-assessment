import React from "react";
import logo from "./logo.svg";
import "./App.css";
import MyComponent from "./components/MyComponent";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <QueryClientProvider client={queryClient}>
        <MyComponent />
      </QueryClientProvider>
    </div>
  );
}

export default App;
