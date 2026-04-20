import React from 'react';
import CalendarWidget from '../components/CalendarWidget';
import MessageFeed from '../components/MessageFeed';
import YouTubeGallery from '../components/YouTubeGallery';

function Home() {
  return (
    <div className="flex-col-gap" style={{ gap: '2.0rem' }}>
      
      {/* Hero Section */}
      <section className="hero-section" style={{
    paddingTop: '0',
    paddingBottom: '2rem',
    marginTop: '0'
  }}>
        <div className="hero-content"
          style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '1.2rem',
          paddingTop: '0'
          }}
        >
          <div className="hero-image-wrapper" style={{ textAlign: 'center' }}>
             <img src="/haeseola-homepage/public/코믹스풍.png" alt="해설아 코믹스풍" className="hero-image" style={{
      width: '220px',
      display: 'block',
      margin: '0 auto'}}/>
          </div>
          <div className="hero-text">
            <h1 className="hero-title">💘해설아💘</h1>
            <div className="hero-subtitle">해설하는 사람</div>
            <div className="hero-desc">
              명문S대 · 대기업L사 · 유학파 석사 출신{'\n'}게임부터 역사까지, 하고 싶은 거 다 하는 중!
            </div>
            <div className="hero-links">
              <a href="https://www.youtube.com/@haeseola" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', backgroundColor: '#FF0000' }}>
                ▶ YouTube
              </a>
              <a href="https://chzzk.naver.com/501e7d7f6c739901b845d7b9320e54b4" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', backgroundColor: '#00FFA3', color: '#000' }}>
                ⚡ CHZZK
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" style={{ marginTop: '0.5rem' }}>
        <img src="/haeseola-homepage/public/모에1.png" alt="해설아 모에1" className="about-image" />
        <div className="about-text-content">
          <div className="about-desc">
            안녕하세요! 해설아입니다👋{'\n'}종합 게임 & 저챗 유튜버입니다. {'\n'} 오버워치와 스타크래프트부터 {'\n'}  여행 썰방, 역사 탐구까지 합니다! {'\n'}(팬 애칭: 온님 / 오누이)
          </div>
          <div className="about-tags">
            <span className="tag">#게임</span>
            <span className="tag">#여행</span>
            <span className="tag">#지식</span>
            <span className="tag">#버튜버</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">주간 방송 일정</h2>
        <CalendarWidget />
      </section>

      <section>
        <h2 className="section-title">💘설아가 온님에게💘</h2>
        <MessageFeed />
      </section>

      <section>
        <h2 className="section-title">설아 유뚜브</h2>
        <YouTubeGallery />
      </section>
    </div>
  );
}

export default Home;
