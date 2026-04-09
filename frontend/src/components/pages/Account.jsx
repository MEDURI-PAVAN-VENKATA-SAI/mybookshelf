import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import { setPasswordFirstTime, updateUserPassword, updateUserDisplayName } from "../../firebasesetup/authService";
import { Edit, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { ddMonYYYY } from "../utils/formatDate";
import SafeImage from "../utils/SafeImage";
import Footer from "../utils/Footer";
import { useNavbar } from "../contexts/NavbarContext";

const useAutoClear = (value, setter, delay = 10000) => {
  useEffect(() => {
    if (!value) return;
    const timer = setTimeout(() => setter(""), delay);
    return () => clearTimeout(timer);
  }, [value]);
};
 
export default function Account() {
  const { user, setUser } = useUser();
  const { darkMode, setDarkMode } = useTheme();
  const { openNav } = useNavbar();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pwdMessage, setPwdMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [show1, setShow1] =useState(false);
  const [show2, setShow2] =useState(false);
  const [editID, setEditID] = useState(false);
  const [editPwd, setEditPwd] = useState(false);
  const [resetPwd, setResetPwd] = useState(false);

  useAutoClear(message, setMessage);
  useAutoClear(pwdMessage, setPwdMessage);

  const updateDisplayName = async () => {
    const newName = displayName.trim().toLowerCase();

    // Empty
    if (!newName) { setMessage("Display name cannot be empty"); return; }

    // Same as current
    if (user.displayName?.toLowerCase() === newName) { setMessage("Current and new display ID are the same"); return; }

    // Length check
    if (newName.length < 3 || newName.length > 20) { setMessage("Display name must be between 3 and 20 characters"); return; }

    // Character restriction
    const regex = /^[a-z0-9_.]+$/;
    if (!regex.test(newName)) { setMessage("Only lowercase letters, numbers, underscore (_) and dot (.) are allowed"); return; }

    try {
      setLoading(true);
      setMessage("");
      await updateUserDisplayName(newName, user, setUser, setMessage, setEditID, toast);
    } 
    catch (err) {
      setMessage(err?.response?.data?.detail || "Failed to update display name");
    } 
    finally {
      setLoading(false);
    }
  };


  const updatePassword = async () => {
    // Length check
    if (newPassword.trim().length < 6) { setPwdMessage("Password (Spaces are not allowed) must be at least 6 characters."); return; }

    try {
      setPwdLoading(true);
      setPwdMessage("");

      if (user.hasPassword && !resetPwd) { 
        if(currentPassword.trim() === newPassword.trim()){
          setPwdMessage("New Password and Current Password must be different."); return;
        }
        await updateUserPassword(currentPassword.trim(), newPassword.trim(), setUser, setPwdMessage, setEditPwd, toast); 
      } 
      else { await setPasswordFirstTime(newPassword.trim(), setUser, setPwdMessage, setEditPwd, toast); }

      setCurrentPassword("");
      setNewPassword("");
    } 
    catch (err) {
      setPwdMessage(err.response?.data?.detail || "Password update failed");
    } 
    finally {
      setPwdLoading(false);
      setResetPwd(false);
    }
  };

  return (
    <div className={`${ (editID || editPwd)? "pointer-events-none" : "" } w-full h-full overflow-x-hidden overflow-y-auto scrollbar-auto`}>
      
      <div className={`${ (editID || editPwd)? "pointer-events-none blur-xl select-none" : "" } relative w-full mx-auto p-4 text-[var(--muted-text)]
             gap-4 overflow-x-hidden overflow-y-auto scrollbar-auto flex flex-col`}>
       
        {/* ================= Account Overview (width >= md)================= */}
        <section className="hidden lg:block bg-[var(--secondary)] w-full rounded-xl">
          <div className="w-full h-full text-lg bg-[var(--background)] border-b-4 border-[var(--border)] 
                font-bold p-4 text-[var(--text)] text-center rounded-t-xl">
                  Account Overview
          </div>
          <div className="w-full h-64 bg-[var(--background)] shadow-md grid grid-cols-2 items-center rounded gap-4 py-4 pr-4">
            <div className="w-full h-full bg-[url('/wood-bg.jpg')] p-2 rounded-r-full bg-repeat-round bg-cover flex flex-row items-center justify-center">
              <div className="w-40 h-40 bg-[var(--background)] rounded-full shadow-xl flex items-center justify-center border-4 border-[var(--border)]">
                <SafeImage src={user.picture} fallback="/profile.png" className={`w-full h-full select-none aspect-square rounded-full text-[var(--muted-text)]`} />
              </div>
            </div>
            <div className="w-full h-fit bg-[var(--background)] items-center grid grid-rows-4 text-sm space-y-2 p-4 rounded-l-xl">
              <p><b className="text-[var(--text)]">Email&nbsp;:&nbsp;</b> {user.email}</p>
              <p><b className="text-[var(--text)]">Name&nbsp;:&nbsp;</b> {user.username}</p>
              <p><b className="text-[var(--text)]">Joined on&nbsp;:&nbsp;</b> {ddMonYYYY(user.createdAt)}</p>
              <div className="w-full h-fit flex flex-row items-center justify-between">
                <p><b className="text-[var(--text)]">Public ID&nbsp;:&nbsp;</b> {user.displayName}</p>
                <button className="px-3 py-2 text-sm rounded bg-[var(--accent)] shrink-0 text-white flex text-center flex-row font-bold 
                        ml-2 cursor-pointer hover:bg-indigo-600" onClick={()=>setEditID(true)}>
                  <Edit size={20} className="mr-2"/>Edit
                </button>
              </div>
            </div>             
          </div>
        </section>

        {/* ================= Account Overview (width < md)================= */}
        <section className="hidden max-lg:block bg-[var(--background)] p-2 rounded-xl shadow-md">
          <div className="w-full h-fit text-lg font-bold p-4 text-[var(--text)] text-center rounded-t-xl">Account Overview</div>
          <div className="w-full h-64 bg-[url('/wood-bg.jpg')] mb-3 bg-repeat-round bg-cover flex items-center justify-center rounded-r-full">
            <div className="w-40 h-40 bg-[var(--background)] rounded-full shadow-xl flex items-center justify-center border-4 border-[var(--border)]">
              <SafeImage src={user.picture} fallback="/profile.png" className={`w-full h-full select-none aspect-square rounded-full text-[var(--muted-text)]`} />
            </div>
          </div>
          <div className="text-sm space-y-2 p-4 rounded-b-xl">
            <p><b className="text-[var(--text)]">Email&nbsp;:&nbsp;</b> {user.email}</p>
            <p><b className="text-[var(--text)]">Name&nbsp;:&nbsp;</b> {user.username}</p>
            <p><b className="text-[var(--text)]">Joined on&nbsp;:&nbsp;</b> {ddMonYYYY(user.createdAt)}</p>
            <div className="w-full h-fit flex flex-row items-center justify-between">
              <p><b className="text-[var(--text)]">Public ID&nbsp;:&nbsp;</b> {user.displayName}</p>
              <button className="px-3 py-2 text-sm rounded bg-[var(--accent)] shrink-0 text-white flex text-center flex-row font-bold 
                    ml-2 cursor-pointer hover:bg-indigo-600" onClick={()=>setEditID(true)}>
                <Edit size={20} className="mr-2"/>Edit
              </button>
            </div>
          </div>
        </section>

        <section className={`relative w-full gap-4 grid grid-cols-1 lg:grid-cols-2 ${openNav ? "md:grid-cols-1" : "md:grid-cols-2"}`}>
          {/* ================= Preferences ================= */}
          <section className="bg-[var(--background)] p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-bold mb-3 text-[var(--text)]">Preferences</h2>
            <div className="text-lg space-y-2 px-2 rounded">
              <div className="w-full h-fit flex flex-row items-center justify-between">
                  <div >Darkmode</div>              
                  <div
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-10 h-5 flex items-center flex-row justify-between rounded-full border-2 border-[var(--hover)] 
                                  transition-colors duration-300 ${ darkMode ? "bg-[var(--accent)]" : "glass p-0"} cursor-pointer`}
                  >
                      <span
                          className={`w-4 h-4 absolute flex flex-row border-3 items-center text-[var(--text)] rounded-full
                              transform transition-transform duration-300 shadow-md hover:w-4.25 hover:h-4.25 bg-black
                              ${ darkMode ? "translate-x-[20px] border-[var(--accent)]" : "translate-x-0 border-gray-300" }`}
                      >
                      </span>
                  </div>
              </div>  
            </div>      
          </section> 

          {/* ================= Security Status ================= */}
          <section className="bg-[var(--background)] p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-bold mb-3 text-[var(--text)]">Security Settings</h2>
            <div className="text-lg space-y-2 px-2 rounded">
              <div className="w-full h-fit flex flex-row items-center justify-between">
                <div>Password Status&nbsp;:&nbsp; 
                <span className={user.hasPassword ? "text-green-500" : "text-red-400"}>
                  {user.hasPassword ? "Configured" : "Not Set"}</span>
                </div>
                <button className="px-3 py-2 text-sm rounded bg-transparent shrink-0 text-[var(--accent)] flex text-center flex-row font-bold 
                        ml-2 cursor-pointer border-2 border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white" onClick={()=>setEditPwd(true)}>
                  <Edit size={20} className="mr-2"/>{user.hasPassword ? "Edit" : "Set"}
                </button>
              </div>
              {user.hasPassword && (<div className="w-full h-fit flex flex-row items-center justify-center">
                <div>Forgot Password&nbsp;?&nbsp;</div>
                <button className="text-md shrink-0 text-[var(--accent)] text-center font-semibold 
                        cursor-pointer underline" onClick={()=>{setResetPwd(true); setEditPwd(true);}}>
                  Reset Password
                </button>
              </div>)}
            </div>
          </section>
        </section>

        <section className={`relative w-full gap-4 grid grid-cols-1 lg:grid-cols-2 ${openNav ? "md:grid-cols-1" : "md:grid-cols-2"}`}>
          {/* ================= Privacy Status ================= */}
          <section className="bg-[var(--background)] p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-bold mb-3 text-[var(--text)]">Account Privacy</h2>
            <div className="text-lg space-y-2 px-2 rounded">
              <div className="w-full h-fit flex flex-row items-center justify-between">
                <div>Privacy mode&nbsp;:&nbsp; 
                <span className={user.hasPassword ? "text-green-500" : "text-red-400"}>
                  {user.hasPassword ? "Public" : "Private"}</span>
                </div>
                <button className="px-3 py-2 text-sm rounded bg-transparent shrink-0 text-[var(--accent)] flex text-center flex-row font-bold 
                        ml-2 cursor-pointer border-2 border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white" onClick={()=>{}}>
                  <Edit size={20} className="mr-2"/>Edit
                </button>
              </div>
            </div>
          </section>

          {/* ================= Account Status ================= */}
          <section className="bg-[var(--background)] p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-bold mb-3 text-[var(--text)]">Account Status</h2>
            <div className="text-lg space-y-2 px-2 rounded">
              <div className="w-full h-fit flex flex-row items-center justify-between">
                <div>Status&nbsp;:&nbsp; 
                <span className={user.hasPassword ? "text-green-500" : "text-red-400"}>
                  {user.hasPassword ? "Active" : "Disabled / Deactivated / Blocked"}</span>
                </div>
                <button className="px-3 py-2 text-sm rounded bg-transparent shrink-0 text-[var(--accent)] flex text-center flex-row font-bold 
                        ml-2 cursor-pointer border-2 border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white" onClick={()=>{}}>
                  <Edit size={20} className="mr-2"/>Edit
                </button>
              </div>
            </div>
          </section>
        </section>

        <section className={`relative w-full gap-4 grid grid-cols-1 lg:grid-cols-2 ${openNav ? "md:grid-cols-1" : "md:grid-cols-2"}`}>
          {/* ================= Reset ================= */}
          <section className="bg-[var(--background)] p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-bold mb-3 text-[var(--text)]">Account Reset</h2>
            <div className="text-lg space-y-2 px-2 rounded">
              <div className="w-full h-fit flex flex-row items-center justify-between">
                <p>Note:- Your all data will be lost. </p>
                <button className="px-3 py-2 text-sm rounded bg-transparent shrink-0 text-[var(--accent)] flex text-center flex-row font-bold 
                        ml-2 cursor-pointer border-2 border-[var(--accent)] hover:bg-[var(--accent)] hover:text-white" onClick={()=>{}}>
                  Reset Account
                </button>
              </div>
            </div>
          </section>

          {/* ================= Danger Zone ================= */}
          <section className="bg-[var(--background)] border border-red-500/30 p-4 rounded-xl">
            <h2 className="text-lg font-semibold text-red-500 mb-3">Delete Account</h2>
            <div className="w-full px-2 h-fit flex flex-row items-center justify-between">
              <p>Note:- Your all data will be lost. </p>
              <button className="px-3 py-2 ml-2 text-sm rounded shrink-0 text-white flex text-center flex-row font-bold 
                        cursor-pointer bg-red-500 hover:bg-red-600" onClick={()=>{}}>
                Delete Account
              </button>
            </div>
          </section>
        </section>

        <section className="w-full h-fit">
          <Footer />
        </section>
      </div>

      {/* Display Name */}
      <section className={`${editID ? "pointer-events-auto" : "hidden"} fixed z-50 top-[calc(50%-100px)] mx-4 w-[calc(100%-32px)] bg-[var(--background)] p-4 
                justify-center shadow-xl min-[432px]:w-100 min-[432px]:mx-0 min-[432px]:left-[calc(50%-200px)] rounded-xl items-center border-2 border-[var(--accent)]`}>   

          <h2 className="text-lg font-semibold my-2">Public ID</h2>
          <input
            value={displayName} minLength={3} maxLength={20}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 mb-4 rounded border bg-[var(--secondary)]"
            placeholder="Public ID" required
          />

          { message && (<p className="w-full p-2 text-red-500 text-[12px] sm:text-[14px] text-center">{message}</p>) }

          <div className="w-full flex flex-row-2 justify-center">
            <button
              onClick={()=>{setDisplayName(user.displayName); setEditID(false);}}
              className="h-9 px-4 mx-4 my-2 text-sm font-medium shrink-0 rounded-full shadow-sm cursor-pointer 
                  bg-transparent border-2 border-red-500 text-[var(--text)] hover:bg-[var(--secondary)]"
            >
              Cancel
            </button>
            <button
              onClick={updateDisplayName}
              disabled={loading}
              className="w-fit min-w-20 h-9 px-4 mx-4 my-2 text-sm font-medium shrink-0 rounded-full shadow-sm cursor-pointer 
                  bg-[var(--accent)] border-2 border-[var(--accent)] text-white hover:bg-indigo-600 flex items-center justify-center" 
            >
              { loading ? <LoaderCircle size={20} className="animate-spin"/> : "Update" }
            </button>
          </div>
      </section>
      
      {/* Password */}
      <section className={`${editPwd ? "pointer-events-auto" : "hidden"} fixed z-50 top-[calc(50%-128px)] mx-4 w-[calc(100%-32px)] bg-[var(--background)] p-4 
                justify-center shadow-md min-[432px]:w-100 min-[432px]:mx-0 min-[432px]:left-[calc(50%-200px)] rounded-xl items-center border-2 border-[var(--accent)]`}>

          <h2 className="text-lg font-semibold my-2"> {(user.hasPassword && !resetPwd) ? "Change Password" : "Set Password"} </h2>

          {(user.hasPassword && !resetPwd) && (
            <div className="bg-[var(--secondary)] mb-4 rounded-[4px] px-2 py-0 border-0 flex flex-row items-center justify-between">
              <input
                type={ show1 ? "text" : "password" }
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 rounded-2xl bg-transparent border-0"
                placeholder="Enter Current password" required
              />
              <div className="w-8 h-8 flex flex-row mx-2 bg-transparent hover:bg-[var(--border)] cursor-pointer items-center justify-center 
                  text-[var(--text)] p-1 rounded-full" onClick={()=>setShow1(!show1)}>
                { show1 ? <EyeOff size={20} /> : <Eye size={20} /> }
              </div>
            </div>
          )}

          <div className="bg-[var(--secondary)] mb-4 rounded-[4px] px-2 py-0 border-0 flex flex-row items-center justify-between">
            <input
              type={ show2 ? "text" : "password" }
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 rounded-2xl bg-transparent border-0"
              placeholder="Enter New password" required
            />
            <div className="w-8 h-8 flex flex-row mx-2 bg-transparent hover:bg-[var(--border)] cursor-pointer items-center justify-center 
                text-[var(--text)] p-1 rounded-full" onClick={()=>setShow2(!show2)}>
              { show2 ? <EyeOff size={20} /> : <Eye size={20} /> }
            </div>
          </div>

          { pwdMessage && (<p className="w-full p-2 text-red-500 text-[12px] sm:text-[14px] text-center">{pwdMessage}</p>) }

          <div className="w-full flex flex-row-2 justify-center">
            <button
              onClick={()=>{setCurrentPassword(""); setNewPassword(""); setEditPwd(false); setResetPwd(false);}}
              className="h-9 px-4 mx-4 my-2 text-sm font-medium shrink-0 rounded-full shadow-sm cursor-pointer 
                  bg-transparent border-2 border-red-500 text-[var(--text)] hover:bg-[var(--secondary)]"
            >
              Cancel
            </button>

            <button
              onClick={updatePassword}
              disabled={pwdLoading}
              className="w-fit min-w-20 h-9 px-4 mx-4 my-2 text-sm font-medium shrink-0 rounded-full shadow-sm cursor-pointer 
                  bg-[var(--accent)] border-2 border-[var(--accent)] text-white hover:bg-indigo-600 flex items-center justify-center" 
            >
              { pwdLoading ? <LoaderCircle size={20} className="animate-spin"/> : "Update" }
            </button>
          </div>
      </section>
    </div>    
  );
}
