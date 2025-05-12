import React, { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth/Auth.jsx'
import Profile from './pages/profile/Profile.jsx'
import Chat from './pages/chat/Chat.jsx'
import { useAppStore } from './store/index.js'
import { apiClient } from './lib/api-client.js'
import { GET_USER_INFO } from './utils/constants.js'

const PrivateRoute = ({ children }) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

const AuthRoute = ({ children }) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  console.log(isAuthenticated);
  console.log(children);
  return isAuthenticated ? <Navigate to="/chat" /> : children;
}

const App = () => {
  const {userInfo, setUserInfo} = useAppStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUserData = async () =>{
      try{
        const response = await apiClient.get(GET_USER_INFO,{
          withCredentials: true,
        });
        if(response.data.success){
          const userData = response.data.user;
          setUserInfo(userData);
        } else{
          setUserInfo(undefined);
        }
      } catch(error){
        setUserInfo(undefined);
      }
      finally{
        setLoading(false);
      }
    }
    if(!userInfo){
      getUserData();
    } else{
      setLoading(false);
    }
  },[userInfo, setUserInfo]);
  if(loading){
    return <div>Loading...</div>
  }

  return (
    <BrowserRouter>
    <Routes>
      <Route 
        path="/auth" 
        element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/auth"/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App