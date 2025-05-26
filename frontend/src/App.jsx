import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";
import WatchPage from "./pages/WatchPage";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authUser.js";
import { useUIStore } from "./store/uiStore.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import SearchPage from "./pages/SearchPage";
import SearchHistoryPage from "./pages/SearchHistoryPage";
import FavouritesPage from "./pages/FavouritesPage";
import NotFoundPage from "./pages/404";
import Profile from "./pages/Profile";
import NotificationsPage from "./pages/NotificationsPage";
import PeoplePage from "./pages/PeoplePage";
import PeopleDetails from "./pages/PeopleDetailsPage";
import VipPage from "./pages/VipPage.jsx";
import ChapPage from "./pages/ChapPage.jsx";
import ChapLayout from "./layout/ChapLayout.jsx";
import AuthPage from "./pages/AuthPage.jsx";

function App() {
	const { user, isCheckingAuth, authCheck } = useAuthStore();
	console.log("auth user is here: ", user);
	const { darkMode } = useUIStore();

	useEffect(() => {
		authCheck();
	}, [authCheck]);
	
	useEffect(() => {
		document.documentElement.classList.toggle("dark", darkMode);
	  }, [darkMode]);

	if (isCheckingAuth) {
		return (
			<div className='h-screen'>
				<div className='flex justify-center items-center bg-black h-full'>
					<Loader className='animate-spin text-red-600 size-10' />
				</div>
			</div>
		);
	}

	return (
		<>
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={!user ? <LoginPage /> : <Navigate to={"/"} />} />
				<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to={"/"} />} />
				<Route path='/auth' element={!user ? <AuthPage /> : <Navigate to = {"/"} />} />
				<Route path='/watch/:id' element={user ? <WatchPage /> : <Navigate to={"/auth"} />} />
				<Route path='/search' element={user ? <SearchPage /> : <Navigate to={"/auth"} />} />
				<Route path='/profile' element={<Profile/>} />
				<Route path='/people' element={user  ? <PeoplePage /> : <Navigate to="/auth" />} />
				<Route path='/people/:id' element={user ? <PeopleDetails /> : <Navigate to="/auth" />} />
				<Route path='/notifications' element={<NotificationsPage/>} />
				<Route path='/history' element={user ? <SearchHistoryPage /> : <Navigate to={"/auth"} />} />
				<Route path='/favourite' element={user ? <FavouritesPage /> : <Navigate to={"/auth"} />} />
				<Route path='/*' element={<NotFoundPage />} />
				<Route path='/register-vip' element={user ? <VipPage /> : <Navigate to={"/auth"} />} />
				<Route path="/chapter" element={<ChapLayout />}>
					<Route path=":id/:page" element={<ChapPage />}/>
				</Route>
			</Routes>
			<Footer />

			<Toaster />
		</>
	);
}

export default App;