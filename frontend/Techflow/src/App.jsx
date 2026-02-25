import React, { useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate
} from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import UserProvider, { UserContext } from './context/userContext';
import { Toaster } from 'react-hot-toast';

import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Whiteboard from './pages/Admin/Whiteboard';
import Supplies from './pages/Admin/Supplies';
import ComStations from './pages/Admin/ComStations';
import Files from './pages/Admin/Files';
import ManageUsers from './pages/Admin/ManageUsers';
import ViewUsers from './pages/User/ViewUsers';
import Providers from './pages/Admin/Providers';
import EditProfile from './pages/Admin/EditProfile';

const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/whiteboard" element={<Whiteboard />} />
              <Route path="/admin/supplies" element={<Supplies />} />
              <Route path="/admin/com-stations" element={<ComStations />} />
              <Route path="/admin/files" element={<Files/>} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/providers" element={<Providers />} />
              <Route path="/admin/edit-profile" element={<EditProfile />} />
            </Route>

            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={["member"]} />}>
              <Route path="/user/whiteboard" element={<Whiteboard />} />
              <Route path="/user/supplies" element={<Supplies />} />
              <Route path="/user/com-stations" element={<ComStations />} />
              <Route path="/user/files" element={<Files/>} />
              <Route path="/user/users" element={<ViewUsers />} />
              <Route path="/user/providers" element={<Providers />} />
              <Route path="/user/edit-profile" element={<EditProfile />} />
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  )
}

export default App

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if(loading) return <Outlet />

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? <Navigate to="/admin/whiteboard" /> : <Navigate to="/user/whiteboard" />;
};