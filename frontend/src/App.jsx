import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import ChapLayout from "./layout/ChapLayout.jsx";
import ChapManageLayout from "./layout/ChapManageLayout.jsx";

import Footer from "./components/Footer";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignupPage";

import WatchPage from "./pages/WatchPage";
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
import AuthPage from "./pages/AuthPage.jsx";
import ChapterManagerPage from "./pages/ChapterManagerPage.jsx";
import ChapterEditPage from "./pages/ChapterEditPage.jsx";

import { useAuthStore } from "./store/authUser.js";
import { useUIStore } from "./store/uiStore.js";

function App() {
	const { user, isCheckingAuth, authCheck } = useAuthStore();

	const location = useLocation();

	const noFooterPaths = ['/login', '/signup', '/auth', '/chapter'];
  	const isFooterVisible = !noFooterPaths.includes(location.pathname);

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
					<Route path=":id/:page" element={<ChapPage />} />
				</Route>
				<Route path="/manage" element={<ChapManageLayout />}>
					<Route index element={<ChapterManagerPage />} /> 
					<Route path=":id/:idc" element={<ChapterEditPage />}/>
				</Route>
			</Routes>

			{isFooterVisible && <Footer />}

			<Toaster />
		</>
	);
}

export default App;