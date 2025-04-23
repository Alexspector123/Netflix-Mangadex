import { useAuthStore } from "../../store/authUser.js";
import AuthScreen from "./AuthScreen";
import HomeScreen from "./HomeScreen";
import { useEffect, useState } from "react";
import AdPopup from "../../components/AdPopup";
import { useNavigate } from "react-router-dom"; // ✅


const HomePage = () => {
  const { user } = useAuthStore();
  const [showVipAd, setShowVipAd] = useState(false);
  const navigate = useNavigate(); // ✅

  useEffect(() => {
    if (user && !user.isVip) {
      setShowVipAd(true);
    }
  }, [user]);

  const handleClosePopup = () => {
    setShowVipAd(false);
    sessionStorage.setItem("vipAdClosed", "true");
  };

  const handleSignUpVip = () => {
    setShowVipAd(false);
    navigate("/register-vip"); // ✅
  };

  return (
    <>
      {showVipAd && (
        <AdPopup onClose={handleClosePopup} onSignUp={handleSignUpVip} />
      )}
      {user ? <HomeScreen /> : <AuthScreen />}
    </>
  );
};

export default HomePage;
