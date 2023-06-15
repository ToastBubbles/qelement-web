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
import Home from "./views/generic/Home";
import AddQPartView from "./views/edit/parts/AddQPartView";
import AddColorView from "./views/edit/colors/AddColorView";
import About from "./views/generic/About";
import AllPartCategoriesView from "./views/parts/AllPartCategoriesView";
import SinglePartCategoryView from "./views/parts/SinglePartCategoryView";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppWrapper from "./components/AppWrapper";
import UploadImageView from "./views/edit/UploadImageView";
import Terms from "./views/generic/Terms";
import Privacy from "./views/generic/Privacy";
import Contact from "./views/generic/Contact";
import AddStatusView from "./views/edit/parts/AddStatusView";
import ApproveColorView from "./views/edit/approval/ColorApprovalView";
import ApproveView from "./views/edit/approval/ApproveView";
import ApproveCatView from "./views/edit/approval/CatApprovalView";
import ApprovePartView from "./views/edit/approval/PartApprovalView";

const queryClient = new QueryClient({
  defaultOptions: {
    // queries: { staleTime: 10000 }
  },
});

function App() {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <AppWrapper>
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
                path="/add/qpart/status/:qpartId"
                element={<AddStatusView />}
              />
              <Route path="/add/qpart/image" element={<UploadImageView />} />

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
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />

              <Route path="/approve" element={<ApproveView />} />
              <Route path="/approve/colors" element={<ApproveColorView />} />
              <Route path="/approve/categories" element={<ApproveCatView />} />
              <Route path="/approve/parts" element={<ApprovePartView />} />

              <Route
                path="/profile/messages/:messageId"
                element={<SingleMessageView />}
              />
              <Route path="*" element={<NotFoundErrorView />} />
            </Routes>
          </div>
          <Footer />
        </AppWrapper>
      </QueryClientProvider>
    </AppProvider>
  );
}

export default App;
