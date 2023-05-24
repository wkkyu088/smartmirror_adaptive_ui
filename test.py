import cv2
import cvlib as cv
import sys

# 웹캠 초기화
webcam = cv2.VideoCapture(0)

while True:
    # 프레임 읽기
    _, frame = webcam.read()
    frame = cv2.flip(frame, 1)

    # 얼굴 감지
    faces, _ = cv.detect_face(frame)

    # 얼굴이 감지되었다면
    if len(faces) > 0:
        # 첫 번째 얼굴의 좌표값 추출
        x1, y1, x2, y2 = faces[0]

        # 좌표값을 배열로 변환
        coordinates = f'{x1}, {y1}, {x2}, {y2}'

        sys.stdout.write(coordinates)
        sys.stdout.flush()
        break
        
    # 'q' 키를 누르면 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 웹캠 해제
webcam.release()