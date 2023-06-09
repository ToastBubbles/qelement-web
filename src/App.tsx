import { Routes, Route } from "react-router";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import {
  AddPartView,
  AllColorsView,
  AllMessagesView,
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
import About from "./views/About";
import AllPartCategoriesView from "./views/parts/AllPartCategoriesView";
import SinglePartCategoryView from "./views/parts/SinglePartCategoryView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 10000 } },
});

function App() {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
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
            <Route
              path="/part-categories"
              element={<AllPartCategoriesView />}
            />
            <Route
              path="/part-categories/:catId"
              element={<SinglePartCategoryView />}
            />
            <Route path="/part/:partId" element={<SinglePartView />} />
            <Route path="/profile" element={<ProfileView />} />
            <Route path="/profile/messages" element={<AllMessagesView />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
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
