import { Routes, Route } from "react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import {
  AddPartView,
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
import Home from "./views/Home";
import AddQPartView from "./views/edit/parts/AddQPartView";
import AddColorView from "./views/edit/colors/AddColorView";

const queryClient = new QueryClient();

function App() {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <Navbar />
        <div id="root-wrapper">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/colors" element={<AllColorsView />} />
            <Route path="/color/:colorId" element={<SingleColorView />} />
            <Route path="/add/color" element={<AddColorView />} />
            <Route path="/edit/color/:colorId" element={<ColorEditView />} />
            <Route path="/add/part" element={<AddPartView />} />
            <Route path="/add/qpart" element={<AddQPartView />} />
            <Route path="/parts" element={<AllPartsView />} />
            <Route path="/part/:qpartId" element={<SinglePartView />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/profile/messages" element={<AllMessagesView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile/messages/:messageId"
              element={<SingleMessageView />}
            />
            <Route path="*" element={<NotFoundErrorView />} />
          </Routes>
        </div>
        <Footer />
      </QueryClientProvider>
    </AppProvider>
  );
}

export default App;
