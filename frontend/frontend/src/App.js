import DocumentTitle from 'react-document-title';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import HomePage from "./Pages/HomePage";
import Category from "./Pages/Category";
import ResponsiveAppBar from "./Components/ResponsiveAppBar";
import ProdPage from "./Pages/ProdPage";
import AuthPage from "./Pages/AuthPace";
import RegPage from "./Pages/RegPage";
import OrdersPage from "./Pages/OrderPage";
import CartPage from "./Pages/CartPage";
import ManageOrder from "./Pages/ManageOrderPage";
import ProdManagerPage from "./Pages/ProdManagerPage";

function App() {
  return (
      <DocumentTitle title = 'Алмаз - Антей'>
          <BrowserRouter basename="/" >
              <>
                  <ResponsiveAppBar/>
                  <Routes>
                      <Route path={"/"} element={<HomePage/>}/>
                      <Route path={"/Category/1/"} element={<Category id={1}/>}/>
                      <Route path={"/Category/2/"} element={<Category id={2}/>}/>
                      <Route path={"/Category/:ctgid/product/:prodid"} element={<ProdPage/>}/>
                      <Route path={"/auth"} element={<AuthPage/>}/>
                      <Route path={"/reg"} element={<RegPage/>}/>
                      <Route path={"/purchases"} element={<OrdersPage/>}/>
                      <Route path={"/cart"} element={<CartPage/>}/>
                      <Route path={"/ManageOrders"} element={<ManageOrder/>}/>
                      <Route path={"/ProdManagerPage"} element={<ProdManagerPage/>}/>
                  </Routes>
              </>
          </BrowserRouter>
      </DocumentTitle>
  );
}

export default App;
