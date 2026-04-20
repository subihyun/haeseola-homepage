import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getToken } from 'firebase/messaging';
import { ref, set } from 'firebase/database';
import { messaging, db } from './services/firebase';
import Layout from './components/Layout';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  useEffect(() => {
    const requestPermissionAndGetToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
          if (vapidKey) {
            // 1. 서비스 워커 주소를 우리 저장소 경로에 맞게 수동으로 알려줍니다.
            const registration = await navigator.serviceWorker.register(
              '/haeseola-homepage/firebase-messaging-sw.js'
            );

            // 2. 위에서 등록한 registration(일꾼)을 포함해서 토큰을 가져옵니다.
            const token = await getToken(messaging, { 
              vapidKey,
              serviceWorkerRegistration: registration 
            });

            if (token) {
              await set(ref(db, `fcmTokens/${token}`), true);
              console.log('FCM 토큰 발급 및 저장 성공!');
            }
          } else {
            console.warn('VITE_FIREBASE_VAPID_KEY 환경변수가 설정되지 않았습니다.');
          }
        }
      } catch (err) {
        console.error('FCM 권한 요청 오류:', err);
      }
    };
    
    requestPermissionAndGetToken();
  }, []);

  // return 부분은 그대로 두시면 됩니다!
  return (
    <Router basename="/haeseola-homepage"> 
      {/* 💡 팁: GitHub Pages에서는 Router에 basename을 넣어주는 게 정신건강에 좋습니다. */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="admin" element={<AdminLogin />} />
          <Route path="admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
