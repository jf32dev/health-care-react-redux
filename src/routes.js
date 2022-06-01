import Chat from './pages/chat';
import Profile from './pages/profile';
// import Post from './pages/post';
// import PostDetail from './pages/post/detail';
import Article from './pages/article';
import ArticleDetail from './pages/article/detail';
import User from './pages/user';
import Doctor from './pages/user/doctor';
import UserDetail from './pages/user/detail';
import Subscribe from './pages/subscribe';
import OneTimePay from './pages/subscribe/onetimepay';
import MonthlyPay from './pages/subscribe/monthlypay';
import Faqs from './pages/faqs';
import Health from './pages/health';
import Activity from './pages/health/activity';
import Weight from './pages/health/weight';
import Step from './pages/health/step';
import Sleep from './pages/health/sleep';
import Alcohol from './pages/health/alcohol';
import BloodPressure from './pages/health/blood-pressure';
import ECG from './pages/health/ecg';
import ECGDetail from './pages/health/ecg_detail';
import LogoManage from './pages/logo';
import CategoryManage from './pages/category';

import Annualpay from './pages/subscribe/annualpay';

import Home from './pages/home';
import About from './pages/about';
import Terms from './pages/terms';
import Privacy from './pages/privacy';
import Contact from './pages/contact';
import Articles from './pages/homearticle';
import HomeArticleDetail from './pages/homearticle/detail';
import HomePost from './pages/homepost';
import HomePostDetail from './pages/homepost/detail';
import HomeSubscribe from './pages/subscribe/home-subscribe';

export const HomeRoutes = [
	{ path: '/', exact: true, name: 'Home', component: Home },
	{ path: '/about', name: "About", component: About },
	{ path: '/contact', name: "About", component: Contact },
	{ path: '/faqs', name: "FAQ's", component: Faqs },
	{ path: '/privacy-policy', name: "Privacy", component: Privacy },
	{ path: '/terms-and-conditions', name: "Terms", component: Terms },
	{ path: '/articles', exact: true, name: 'Articles', component: Articles },
	{ path: '/article/:id', name: 'Article Detail', component: HomeArticleDetail },
	{ path: '/posts', name: 'Posts', component: HomePost },
	{ path: '/post/:id', name: 'Post Detail', component: HomePostDetail },
	{ path: '/subscribe', name: "Subscribe", component: HomeSubscribe },
];


export const AdminRoutes = [
	{ path: '/admin', name: 'Home' },
	{ path: '/admin/articles', name: 'Article', component: Article },
	{ path: '/admin/article/:id', name: 'Create Article', component: ArticleDetail },
	{ path: '/admin/user', name: 'Users', component: User },
	{ path: '/admin/user/:id', name: 'Detail', component: UserDetail },
	{ path: '/admin/doctor', name: 'Doctors', component: Doctor },
	{ path: '/admin/doctor/:id', name: 'Detail', component: UserDetail },
	{ path: '/admin/logo', name: 'Logo', component: LogoManage },
	{ path: '/admin/category', name: 'Category', component: CategoryManage },
];

export const DoctorRoutes = [
  { path: '/admin', name: 'Home' },
  // { path: '/admin/patients', name: 'Patients', component: Patients },
  // { path: '/admin/patients/:id', name: 'User Status', component: UserDetail },
  { path: '/admin/chat', name: 'Chat', component: Chat },
  { path: '/admin/profile', name: 'Profile', component: Profile },
];

export const PatientRoutes = [
	{ path: '/admin', name: 'Home' },
	{ path: '/admin/chat', name: 'Chat', component: Chat },
	{ path: '/admin/health', name: 'Health', component: Health },
	{ path: '/admin/health/activity', name: 'Activity', component: Activity },
	{ path: '/admin/health/weight', name: 'Body Weight', component: Weight },
	{ path: '/admin/health/steps', name: 'Steps', component: Step },
	{ path: '/admin/health/sleep', name: 'Sleep', component: Sleep },
	{ path: '/admin/health/alcohol', name: 'Alcohol Use', component: Alcohol },
	{ path: '/admin/health/blood-pressure', name: 'Blood Pressure', component: BloodPressure },
	{ path: '/admin/health/ecg', name: 'ECG', component: ECG },
	{ path: '/admin/health/ecg/detail', name: 'Detail', component: ECGDetail },
  { path: '/admin/profile', name: 'Profile', component: Profile },
	// { path: '/admin/post', name: 'Post', component: Post },
	// { path: '/admin/post/:id', name: 'Create Post', component: PostDetail },
	{ path: '/admin/subscribe', name: 'Subscribe', component: Subscribe },
	{ path: '/admin/subscribe/one-time', name: 'One-Time', component: OneTimePay },
	{ path: '/admin/subscribe/monthly', name: 'Monthly', component: MonthlyPay },
	{ path: '/admin/subscribe/annual', name: 'Annual', component: Annualpay },
];