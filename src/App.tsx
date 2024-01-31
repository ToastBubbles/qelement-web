import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppWrapper from "./components/AppWrapper";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppContext, AppProvider } from "./context/context";
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
import SearchView from "./views/SearchView";
import UploadImageView from "./views/edit/UploadImageView";
import ApproveView from "./views/edit/approval/ApproveView";
import ApproveCatView from "./views/edit/approval/CatApprovalView";
import ApproveColorView from "./views/edit/approval/ColorApprovalView";
import ApproveImageView from "./views/edit/approval/ImageApprovalView";
import ApprovePartView from "./views/edit/approval/PartApprovalView";
import ApprovePartMoldView from "./views/edit/approval/PartMoldApprovalView";
import ApproveQPartView from "./views/edit/approval/QPartApprovalView";
import AddColorView from "./views/edit/colors/AddColorView";
import AddQPartView from "./views/edit/parts/AddQPartView";
import AddStatusView from "./views/edit/parts/AddStatusView";
import About from "./views/generic/About";
import Contact from "./views/generic/Contact";
import Home from "./views/generic/Home";
import Privacy from "./views/generic/Privacy";
import Terms from "./views/generic/Terms";
import UpdateView from "./views/generic/UpdateView";
import AllPartCategoriesView from "./views/parts/AllPartCategoriesView";
import SinglePartCategoryView from "./views/parts/SinglePartCategoryView";
import CollectionView from "./views/profile/CollectionView";
import ProfileSettingsView from "./views/profile/ProfileSettingsView";
import WantedView from "./views/profile/WantedView";
import ForgotPassword from "./views/generic/ForgotPassword";
import ImageComparisonTool from "./views/generic/Tools/ImageComparisonTool";
import DeleteView from "./views/edit/approval/DeleteView";
import AddKnownView from "./views/edit/parts/AddKnownView";
import SingleSculptureView from "./views/sculptures/SingleSculptureView";
import AddSculptureView from "./views/edit/sculptures/AddSculptureView";
import AllSculptureView from "./views/sculptures/AllScultureView";
import AddPartsToSculptureView from "./views/edit/sculptures/AddPartsToSculptureView";
import ApproveSculptureView from "./views/edit/approval/SculptureApprovalView";
import ElementIDApprovalView from "./views/edit/approval/ElementIDApprovalView";
import ApproveStatusView from "./views/edit/approval/StatusApprovalView";
import ApproveSculptureInventoryView from "./views/edit/approval/SculptureInventoryApprovalView";
import SimilarColorApprovalView from "./views/edit/approval/SimilarColorApprovalView";
import UserManagementView from "./views/UserManagementView";
import UserLookupView from "./views/generic/Tools/UserLookupView";
import AllToolsView from "./views/generic/Tools/AllToolsView";
import OtherUserProfileView from "./views/generic/Tools/OtherUserProfileView";
import { useContext, useEffect, useState } from "react";
import { getToken } from "./auth/auth";

const queryClient = new QueryClient({
  defaultOptions: {
    // queries: { staleTime: 10000 }
  },
});
// interface userContext {
//   id: number;
//   username: string;
// }

function App() {
  const {
    state: {
      jwt: { payload },
    },
  } = useContext(AppContext);

  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token && payload) {
      setAuth(true);
    }
  }, [payload]);
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
              <Route path="/forgot" element={<ForgotPassword />} />
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

              <Route
                path="/sculpture/:sculptId"
                element={<SingleSculptureView />}
              />
              <Route path="/sculpture/all" element={<AllSculptureView />} />
              <Route path="/search" element={<SearchView />} />
              <Route
                path="/profile/:username"
                element={
                  <ProtectedRoute isAuth>
                    <OtherUserProfileView />
                  </ProtectedRoute>
                }
              />

              {/* ********************** Add data forms (User) *********************** */}
              <Route
                path="/add/qpart/status/:qpartId"
                element={
                  <ProtectedRoute isAuth>
                    <AddStatusView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add/color"
                element={
                  <ProtectedRoute isAuth>
                    <AddColorView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add/part"
                element={
                  <ProtectedRoute isAuth>
                    <AddPartView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add/sculpture"
                element={
                  <ProtectedRoute isAuth>
                    <AddSculptureView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add/sculpture/parts/:sculptId"
                element={
                  <ProtectedRoute isAuth>
                    <AddPartsToSculptureView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add/qpart"
                element={
                  <ProtectedRoute isAuth>
                    <AddQPartView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add/known"
                element={
                  <ProtectedRoute isAuth>
                    <AddKnownView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add/image"
                element={
                  <ProtectedRoute isAuth>
                    <UploadImageView />
                  </ProtectedRoute>
                }
              />
              {/* ********************** Profile Pages (User) *********************** */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isAuth>
                    <ProfileView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/settings"
                element={
                  <ProtectedRoute isAuth>
                    <ProfileSettingsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/collection"
                element={
                  <ProtectedRoute isAuth>
                    <CollectionView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/wanted"
                element={
                  <ProtectedRoute isAuth>
                    <WantedView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/messages"
                element={
                  <ProtectedRoute isAuth>
                    <AllMessagesView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/messages/:messageId"
                element={
                  <ProtectedRoute isAuth>
                    <SingleMessageView />
                  </ProtectedRoute>
                }
              />
              {/* ********************** Tools (User) *********************** */}
              <Route
                path="/tools"
                element={
                  <ProtectedRoute isAuth>
                    <AllToolsView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/compare"
                element={
                  <ProtectedRoute isAuth>
                    <ImageComparisonTool />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools/userLookup"
                element={
                  <ProtectedRoute isAuth>
                    <UserLookupView />
                  </ProtectedRoute>
                }
              />

              {/* ********************** Approval Pages (Admin) *********************** */}
              <Route
                path="/approve"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <ApproveView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/colors"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <ApproveColorView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/similarColors"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <SimilarColorApprovalView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/categories"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <ApproveCatView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/images"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <ApproveImageView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/parts"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <ApprovePartView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/qparts"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <ApproveQPartView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/status"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <ApproveStatusView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/elementIDs"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <ElementIDApprovalView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/molds"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <ApprovePartMoldView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/sculptures"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <ApproveSculptureView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approve/sculptureInventories"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <ApproveSculptureInventoryView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit/color/:colorId"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <ColorEditView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/userManagement"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <UserManagementView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/delete"
                element={
                  <ProtectedRoute level={"admin"} isAuth>
                    <DeleteView />
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
