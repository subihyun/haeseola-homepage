"""
Firebase 푸시 알림 수동 발송 스크립트

[실행 전 준비사항]
1. Python 필수 패키지 설치:
   pip install firebase-admin

2. Firebase 서비스 계정 JSON 비공개 키 발급 및 저장:
   a. Firebase Console 접속 -> haeseola-a83de 프로젝트 선택
   b. 설정(톱니바퀴) -> 프로젝트 설정 -> '서비스 계정' 탭 이동
   c. '새 비공개 키 생성' 버튼 클릭하여 JSON 파일 다운로드
   d. 다운로드한 파일을 이 스크립트와 같은 폴더에 넣고 이름을 'serviceAccountKey.json'으로 변경

[실행 방법]
터미널에서 아래 명령어를 실행하세요:
   python send_notification.py

스크립트가 pending-notifications/ 경로를 읽어 발송 대기 중인 알림을 확인하고,
저장된 모든 fcmTokens에 알림을 발송한 뒤, 대기열을 비웁니다.
"""

import firebase_admin
from firebase_admin import credentials, db, messaging
import os
import sys

# 1. Firebase Admin SDK 초기화
cred_path = 'serviceAccountKey.json'
if not os.path.exists(cred_path):
    print(f"오류: {cred_path} 파일을 찾을 수 없습니다. 위 준비사항을 확인해주세요.")
    sys.exit(1)

# Realtime Database URL 입력
database_url = 'https://haeseola-a83de-default-rtdb.asia-southeast1.firebasedatabase.app'

cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred, {
    'databaseURL': database_url
})

def send_pending_notifications():
    print("알림 대기열을 확인합니다...")
    pending_ref = db.reference('pending-notifications')
    pending_data = pending_ref.get()

    if not pending_data:
        print("발송 대기 중인 알림이 없습니다.")
        return

    # 저장된 모든 FCM 토큰 가져오기
    tokens_ref = db.reference('fcmTokens')
    tokens_data = tokens_ref.get()

    if not tokens_data:
        print("저장된 FCM 기기 토큰이 없습니다. 알림을 취소합니다.")
        return
    
    tokens = list(tokens_data.keys())
    print(f"총 {len(tokens)}개의 기기에 알림을 발송 준비 중입니다.")

    for noti_id, noti_info in pending_data.items():
        title = noti_info.get('title', '알림')
        body = noti_info.get('body', '')
        
        print(f"\n발송 중: [{title}] {body}")
        
        message = messaging.MulticastMessage(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            tokens=tokens,
        )
        
        # FCM 알림 발송 요청
        response = messaging.send_multicast(message)
        print(f"{response.success_count}개 성공, {response.failure_count}개 실패")
        
        # 실패한 토큰 정리 (예: 앱 삭제로 무효화된 토큰)
        if response.failure_count > 0:
            responses = response.responses
            for idx, resp in enumerate(responses):
                if not resp.success:
                    failed_token = tokens[idx]
                    print(f"무효화된 토큰 삭제: {failed_token}")
                    db.reference(f'fcmTokens/{failed_token}').delete()

        # 발송 완료된 알림 대기열에서 삭제
        db.reference(f'pending-notifications/{noti_id}').delete()
        print(f"알림({noti_id}) 대기열에서 삭제 완료.")

if __name__ == '__main__':
    send_pending_notifications()
    print("\n모든 작업이 완료되었습니다.")
