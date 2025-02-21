import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  AuthPage,
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { dataProvider, liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import authProvider from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { supabaseClient } from "./utility";
import {
  ProductCreate,
  ProductEdit,
  ProductList,
  ProductShow,
} from "./pages/products";
import { StoreCreate, StoreEdit, StoreList, StoreShow } from "./pages/stores";
import {
  PurchaseCreate,
  PurchaseEdit,
  PurchaseList,
  PurchaseShow,
} from "./pages/purchases";

function App() {
  const CustomSider = (props: any) => {
    return (
      <ThemedSiderV2
        {...props}
        renderTitle={() => (
          <div
            style={{ padding: "16px", fontWeight: "bold", fontSize: "1.2rem" }}
          >
            My Custom App Name
          </div>
        )}
      />
    );
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              dataProvider={dataProvider(supabaseClient)}
              liveProvider={liveProvider(supabaseClient)}
              authProvider={authProvider}
              routerProvider={routerBindings}
              notificationProvider={useNotificationProvider}
              resources={[
                {
                  name: "products",
                  list: "/products",
                  create: "/products/create",
                  edit: "/products/edit/:id",
                  show: "/products/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
                {
                  name: "stores",
                  list: "/stores",
                  create: "/stores/create",
                  edit: "/stores/edit/:id",
                  show: "/stores/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
                {
                  name: "purchases",
                  list: "/purchases",
                  create: "/purchases/create",
                  edit: "/purchases/edit/:id",
                  show: "/purchases/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "y9akM4-0noAxa-ZZiqns",
                title: { text: String("Price Tag") },
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-inner"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2 Header={Header}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route
                    index
                    element={<NavigateToResource resource="products" />}
                  />
                  <Route path="/products">
                    <Route index element={<ProductList />} />
                    <Route path="create" element={<ProductCreate />} />
                    <Route path="edit/:id" element={<ProductEdit />} />
                    <Route path="show/:id" element={<ProductShow />} />
                  </Route>{" "}
                  <Route path="/stores">
                    <Route index element={<StoreList />} />
                    <Route path="create" element={<StoreCreate />} />
                    <Route path="edit/:id" element={<StoreEdit />} />
                    <Route path="show/:id" element={<StoreShow />} />
                  </Route>{" "}
                  <Route path="/purchases">
                    <Route index element={<PurchaseList />} />
                    <Route path="create" element={<PurchaseCreate />} />
                    <Route path="edit/:id" element={<PurchaseEdit />} />
                    <Route path="show/:id" element={<PurchaseShow />} />
                  </Route>
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-outer"
                      fallback={<Outlet />}
                    >
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route
                    path="/login"
                    element={
                      <AuthPage
                        type="login"
                        formProps={{
                          defaultValues: {
                            email: "info@refine.dev",
                            password: "refine-supabase",
                          },
                        }}
                      />
                    }
                  />
                  <Route
                    path="/register"
                    element={<AuthPage type="register" />}
                  />
                  <Route
                    path="/forgot-password"
                    element={<AuthPage type="forgotPassword" />}
                  />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
