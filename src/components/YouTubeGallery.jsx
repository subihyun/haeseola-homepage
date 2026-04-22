import React, { useState, useEffect } from 'react';

function YouTubeGallery() {
  const [shorts, setShorts] = useState([]);
  const [vods, setVods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const CHANNEL_ID = "UCAGeAW20MJMXIXWPNLvr0cQ";
        const SHORTS_PLAYLIST_ID = "PLBkqMGLkQdlyv4maUKlLaU9GIVA0eJCwt";

        // 1. 채널 전체 RSS
        const channelRssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
        // 2. 숏츠 재생목록 RSS
        const shortsRssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${SHORTS_PLAYLIST_ID}`;

        // 🔥 차단된 corsproxy.io 대신 안정적인 api.codetabs.com 프록시로 교체!
        const fetchChannel = fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(channelRssUrl)}`);
        const fetchShorts = fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(shortsRssUrl)}`);

        // 두 데이터를 동시에 불러옵니다.
        const [channelRes, shortsRes] = await Promise.all([fetchChannel, fetchShorts]);

        if (!channelRes.ok || !shortsRes.ok) {
          throw new Error("네트워크 응답이 실패했습니다.");
        }

        const channelXmlText = await channelRes.text();
        const shortsXmlText = await shortsRes.text();

        const parser = new DOMParser();

        // XML에서 영상 목록을 뽑아내는 함수
        const extractVideos = (xmlText) => {
          const xmlDoc = parser.parseFromString(xmlText, "text/xml");
          const entries = xmlDoc.querySelectorAll("entry");
          const arr = [];

          Array.from(entries).forEach((entry) => {
            const videoId = entry.querySelector("yt\\:videoId").textContent;
            const title = entry.querySelector("title").textContent;
            const date = new Date(entry.querySelector("published").textContent).toLocaleDateString();
            const link = `https://www.youtube.com/watch?v=${videoId}`;
            
            const mediaGroup = entry.getElementsByTagName("media:group")[0];
            const thumbnail = mediaGroup 
              ? mediaGroup.getElementsByTagName("media:thumbnail")[0].getAttribute("url") 
              : '';

            arr.push({ id: videoId, title, thumbnail, date, link });
          });
          return arr;
        };

        // 데이터 추출
        const channelVideos = extractVideos(channelXmlText);
        const shortsVideos = extractVideos(shortsXmlText);

        // 숏츠 영상들의 ID만 모아둔 목록
        const shortsIdList = shortsVideos.map(video => video.id);

        // 분류 작업 시작
        const finalVods = [];
        const finalShorts = [];

        channelVideos.forEach(video => {
          if (shortsIdList.includes(video.id)) {
            finalShorts.push(video);
          } else {
            finalVods.push(video);
          }
        });

        // 화면에 적용
        setShorts(finalShorts);
        setVods(finalVods);

      } catch (err) {
        console.error("RSS 피드 파싱 에러:", err);
        setError("영상 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
        영상을 불러오는 중...
      </div>
    );

  if (error)
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>
        잠시 후 다시 시도해주세요.
      </div>
    );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 숏츠 영역 */}
      {shorts.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>
            <span style={{ color: '#FF0000' }}>▶</span> 최신 숏츠
          </h3>

          <div style={{ display: 'flex', overflowX: 'auto', gap: '1rem' }}>
            {shorts.map((short) => (
              <a key={short.id} href={short.link} target="_blank" rel="noreferrer">
                <div style={{ width: '140px' }}>
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                  <p style={{ fontSize: '0.8rem' }}>{short.title}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* VOD 영역 */}
      {vods.length > 0 && (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>
            <span style={{ color: '#FF0000' }}>▶</span> 최근 방송
          </h3>

          {vods.map((vod) => (
             <a key={vod.id} href={vod.link} target="_blank" rel="noreferrer">
              <div style={{ marginBottom: '1rem' }}>
                <img
                  src={vod.thumbnail}
                  alt={vod.title}
                  style={{ width: '100%', borderRadius: '10px' }}
                />
                <p>{vod.title}</p>
                <p style={{ fontSize: '0.8rem', color: '#aaa' }}>{vod.date}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default YouTubeGallery;
