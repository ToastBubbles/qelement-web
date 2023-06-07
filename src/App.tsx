import { useState } from "react";
import { Routes, Route } from "react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import {
  AddPartView,
  AllColorsEditView,
  AllColorsView,
  AllMessagesView,
  AllPartsView,
  ColorEditView,
  Login,
  NotFoundErrorView,
  ProfileView,
  Register,
  SingleColorView,
  SingleMessageView,
  SinglePartView,
} from "./views";
import { AppProvider } from "./context/context";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <Routes>
          {/* <Route path="/" element={{<h2>Hello<h2/>} /> */}
          <Route path="/colors" element={<AllColorsView />} />
          <Route path="/colors/:colorId" element={<SingleColorView />} />
          <Route path="/edit/colors" element={<AllColorsEditView />} />
          <Route path="/edit/colors/:colorId" element={<ColorEditView />} />
          <Route path="/edit/parts" element={<AddPartView />} />
          <Route path="/parts" element={<AllPartsView />} />
          <Route path="/parts/:qpartId" element={<SinglePartView />} />
          <Route path="/profile" element={<ProfileView />} />
          <Route path="/profile/messages" element={<AllMessagesView />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/messages" element={<AllMessagesView />} />
          <Route
            path="/profile/messages/:messageId"
            element={<SingleMessageView />}
          />
          <Route path="*" element={<NotFoundErrorView />} />
        </Routes>
        <Footer />
      </QueryClientProvider>
    </AppProvider>
  );
}

export default App;
