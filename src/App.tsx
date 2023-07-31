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
import ApproveQPartView from "./views/edit/approval/QPartApprovalView";
import ApprovePartMoldView from "./views/edit/approval/PartMoldApprovalView";
import ProfileSettingsView from "./views/profile/ProfileSettingsView";
import WantedView from "./views/profile/WantedView";
import CollectionView from "./views/profile/CollectionView";
import ApproveImageView from "./views/edit/approval/ImageApprovalView";
import SearchView from "./views/SearchView";
import React from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";
import UpdateView from "./views/generic/UpdateView";

const queryClient = new QueryClient({
  defaultOptions: {
    // queries: { staleTime: 10000 }
  },
});
interface userContext {
  id: number;
  username: string;
}

function App() {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <AppWrapper>
          <ToastContainer />
          <Navbar />
          <div id="root-wrapper">
            <Routes>
              {/* ********************** Basic Pages (Guest) *********************** */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/updates" element={<UpdateView />} />
              {/* ********************** Basic Navigation (Guest) *********************** */}
              <Route path="/colors" element={<AllColorsView />} />
              <Route path="/color/:colorId" element={<SingleColorView />} />
              <Route
                path="/part-categories"
                element={<AllPartCategoriesView />}
              />
              <Route
                path="/part-categories/:catId"
                element={<SinglePartCategoryView />}
              />
              <Route path="/part/:partId" element={<SinglePartView />} />

              <Route path="/search" element={<SearchView />} />

              {/* ********************** Add data forms (User) *********************** */}
              <Route
                path="/add/qpart/status/:qpartId"
                element={
                  <ProtectedRoute>
                    <AddStatusView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add/color"
                element={
                  <ProtectedRoute>
                    <AddColorView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add/part"
                element={
                  <ProtectedRoute>
                    <AddPartView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add/qpart"
                element={
                  <ProtectedRoute>
                    <AddQPartView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add/qpart/image"
                element={
                  <ProtectedRoute>
                    <UploadImageView />
                  </ProtectedRoute>
                }
              />
              {/* ********************** Profile Pages (User) *********************** */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/settings"
                element={
                  <ProtectedRoute>
                    <ProfileSettingsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mycollection"
                element={
                  <ProtectedRoute>
                    <CollectionView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mywanted"
                element={
                  <ProtectedRoute>
                    <WantedView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/messages"
                element={
                  <ProtectedRoute>
                    <AllMessagesView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/messages/:messageId"
                element={
                  <ProtectedRoute>
                    <SingleMessageView />
                  </ProtectedRoute>
                }
              />
              {/* ********************** Approval Pages (Admin) *********************** */}
              <Route
                path="/approve"
                element={
                  <ProtectedRoute level={"admin"}>
                    <ApproveView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/colors"
                element={
                  <ProtectedRoute level={"admin"}>
                    <ApproveColorView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/categories"
                element={
                  <ProtectedRoute level={"admin"}>
                    <ApproveCatView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/images"
                element={
                  <ProtectedRoute level={"admin"}>
                    <ApproveImageView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/parts"
                element={
                  <ProtectedRoute level={"admin"}>
                    <ApprovePartView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/qparts"
                element={
                  <ProtectedRoute level={"admin"}>
                    <ApproveQPartView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/molds"
                element={
                  <ProtectedRoute level={"admin"}>
                    <ApprovePartMoldView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit/color/:colorId"
                element={
                  <ProtectedRoute level={"admin"}>
                    <ColorEditView />
                  </ProtectedRoute>
                }
              />
              {/* ********************** Catchall/Error Pages (Guest) *********************** */}
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
