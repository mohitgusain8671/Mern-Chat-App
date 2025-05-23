import React, { useState } from 'react';
import Background from '../../assets/login2.png';
import Victory from '../../assets/victory.svg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { LOGIN_ROUTES, SIGNUP_ROUTES } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';


const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo }= useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateLogin = () => {
    if (email === "") {
      toast.error("Email is required");
      return false;
    }
    if (password === "") {
      toast.error("Password is required");
      return false;
    }
    return true;
  }

  const validateSignup = () => {
    if (email === "") {
      toast.error("Email is required");
      return false;
    }
    if (password === "") {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords and confirm password should be same");
      return false;
    }
    return true;
  }
  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(LOGIN_ROUTES, 
          { email,password },
          { withCredentials: true }
        );
        if (response.data.success) {
          toast.success("Login successful");
          if (response.data.data.user._id) {
            setUserInfo(response.data.data.user);
            if(!response.data.data.user.profileSetup) {
              navigate("/profile");
            }
            else {
              navigate("/chat");
            }

          }
        } else {
          toast.error(response.data.data.error);
        }
      }catch(err){
        console.log(err);
        toast.error(err.response.data.error);
      } 
    }
  }
  const handleRegister = async () => {
    if (!validateSignup()) return;
    const response = await apiClient.post(SIGNUP_ROUTES, {
      email,
      password
    },{withCredentials: true});
    if (response.data.success) {
      setUserInfo(response.data.data.user);
      toast.success("Successful Registration");
      navigate("/profile");
    }
    console.log(response.data);
  };

  return (
    <div className='h-[100dvh] w-[100vw] flex justify-center items-center'>
      <div className='h-[80dvh] w-[80vw] bg-white border-white border-2  shadow-2xl text-opacity-90 md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'
      >
        <div className='flex flex-col gap-10 justify-center items-center'>
          <div  className='flex items-center justify-center flex-col gap-5'>
            <div className='flex items-center justify-center flex-wrap'>
              <h1 className='text-5xl font-bold md:text-6xl'>
                Welcome
              </h1>
              <img src={Victory} alt="victory" className='h-[100px]' />
              <p className='font-medium w-full text-center'>
                Fill in the details to get started with this chat App
              </p>
            </div>
            <div className='flex items-center justify-center w-full mt-5'>
              <Tabs className='w-3/4' defaultValue="login">
                <TabsList className='bg-transparent w-full'>
                  <TabsTrigger value="login" className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all'>Login</TabsTrigger>
                  <TabsTrigger value="register" className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all'>Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className='w-full flex flex-col gap-5 mt-8'>
                  <Input 
                    type="email" 
                    placeholder='Enter your email' 
                    className='rounded-full p-6' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                  <Input 
                    type="password" 
                    placeholder='Enter your password' 
                    className='rounded-full p-6' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                  <Button className='rounded-full p-6 bg-purple-500 text-white hover:bg-purple-600 transition-all' onClick={handleLogin}>
                    Login
                  </Button>

                </TabsContent>
                <TabsContent value="register" className='w-full flex flex-col gap-5 mt-2'>
                <Input 
                    type="email" 
                    placeholder='Enter your email' 
                    className='rounded-full p-6' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                  <Input 
                    type="password" 
                    placeholder='Enter your password' 
                    className='rounded-full p-6' 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                  <Input 
                    type="password" 
                    placeholder='Confirm your password' 
                    className='rounded-full p-6' 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                  />
                  <Button className='rounded-full p-6 bg-purple-500 text-white hover:bg-purple-600 transition-all' onClick={handleRegister}>
                    Register
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        <div className='hidden xl:flex items-center justify-center'>
            <img src={Background} alt="background login" className='h-full object-cover' />
        </div>
      </div>
    </div>
  )
}

export default Auth