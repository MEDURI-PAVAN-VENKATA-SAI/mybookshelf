// authService.js
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signInWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, updatePassword,
         reauthenticateWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import axios from "axios";
import { DEFAULT_USER } from "../constants/defaultUser";

const API_URL = import.meta.env.VITE_BACKEND_URL;


export async function loginWithGoogle(setUser, navigate, toast) {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseToken = await result.user.getIdToken();
    const res = await axios.post(`${API_URL}/auth/google`, { token: firebaseToken });
    saveSession(res.data, setUser, navigate, toast);
  } 
  catch (err) {
    toast.error("Google Login Failed. Please Try Again");
  }
}


export async function loginWithEmail(email, password, setUser, setMessage, navigate, toast) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const firebaseToken = await result.user.getIdToken();
    const res = await axios.post(`${API_URL}/auth/google`, { token: firebaseToken });
    saveSession(res.data, setUser, navigate, toast);
  } 
  catch (err) {
    if (err.code) {
      switch (err.code) {
        case "auth/network-request-failed": setMessage("Network error. Please check your connection"); return;
        case "auth/invalid-credential": setMessage("Incorrect Email or Password"); return;
        case "auth/user-disabled": setMessage("This account has been disabled"); return;
        case "auth/too-many-requests": setMessage("Too many attempts. Try again later"); return;
      }
    }
    setMessage(err.response?.data?.detail || "Login failed. Please try again");
  }
}


function saveSession(data, setUser, navigate, toast) {
  const { access_token, user } = data;

  localStorage.setItem("access_token", access_token);
  setUser(user);

  toast.success(`Welcome ${user.username}!`);
  navigate("/app/home", {replace:true});
}


export async function logout(setUser, navigate, toast){
  try {
    await signOut(auth);
    localStorage.removeItem("access_token");
    setUser(DEFAULT_USER);
    toast.success("Logged out successfully!", { hideProgressBar: true, position: "top-center" });
    navigate("/", {replace:true});
  } 
  catch (error) {
    toast.error("Logout failed!", { hideProgressBar: true, position: "top-center" });
  }
}


export async function setPasswordFirstTime( newPassword, setUser, setPwdMessage, setEditPwd, toast ) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) { setPwdMessage("Please login again."); return; }
    const provider = new GoogleAuthProvider();
    await reauthenticateWithPopup(currentUser, provider);
    await updatePassword(currentUser, newPassword);
    const firebaseToken = await currentUser.getIdToken(true);
    const loginRes = await axios.post(`${API_URL}/auth/google`, { token: firebaseToken });
    localStorage.setItem("access_token", loginRes.data.access_token);
    setUser(loginRes.data.user);
    await axios.put(`${API_URL}/account/password`, {newPassword, isReset:true}, {headers: {Authorization: `Bearer ${loginRes.data.access_token}`}});
    toast.success("Password set successfully");
    setEditPwd(false);
    setTimeout(() => { window.location.reload(); }, 500);
  } 
  catch (err) {
    if (err.code) {
      switch (err.code) {
        case "auth/requires-recent-login": setPwdMessage("Please re-login to set password."); return;
        case "auth/network-request-failed": setPwdMessage("Network error. Please check your connection"); return;
        case "auth/user-disabled": setPwdMessage("This account has been disabled"); return;
        case "auth/too-many-requests": setPwdMessage("Too many attempts. Try again later"); return;
      }
    }
    setPwdMessage(err.response?.data?.detail || "Failed to set password. Try again");
  }
}


export async function updateUserPassword( currentPassword, newPassword, setUser, setPwdMessage, setEditPwd, toast ) {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) { setPwdMessage("Please login again."); return; }
    const credential = EmailAuthProvider.credential( user.email, currentPassword );
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
    const firebaseToken = await user.getIdToken(true);
    const loginRes = await axios.post(`${API_URL}/auth/google`, { token: firebaseToken });
    localStorage.setItem("access_token", loginRes.data.access_token);
    setUser(loginRes.data.user);
    await axios.put(`${API_URL}/account/password`, {currentPassword, newPassword, isReset:false}, { headers: { Authorization: `Bearer ${loginRes.data.access_token}`}});
    toast.success("Password updated successfully");
    setEditPwd(false);
  }
  catch (err) {
    if (err.code) {
      switch (err.code) {
        case "auth/requires-recent-login": setPwdMessage("Please re-login to update password."); return;
        case "auth/network-request-failed": setPwdMessage("Network error. Please check your connection"); return;
        case "auth/invalid-credential": setPwdMessage("Current Password is wrong"); return;
        case "auth/user-disabled": setPwdMessage("This account has been disabled"); return;
        case "auth/too-many-requests": setPwdMessage("Too many attempts. Try again later"); return;
      }
    }
    setPwdMessage(err.response?.data?.detail || "Password update failed. Try again");
  }
}


export async function updateUserDisplayName( displayName, user, setUser, setMessage, setEditID, toast ) {
  const token = localStorage.getItem("access_token");
  try{
    await axios.put( `${API_URL}/account/displayname`, { displayName }, { headers: { Authorization: `Bearer ${token}` } } );
    setUser({ ...user, displayName: displayName });
    toast.success("Public ID updated successfully");
    setEditID(false);
  }
  catch(err){
    setMessage(err.response?.data?.detail || "Failed to update Public ID");
  }
}