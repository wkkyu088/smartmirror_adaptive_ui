import cv2
import cvlib as cv
import numpy as np

camera = cv2.VideoCapture(0)

while True:
    success, frame = camera.read()
    frame = cv2.flip(frame, 1)

    faces, _ = cv.detect_face(frame, enable_gpu='true')
    face_coordinates = {}

    if len(faces) > 0:
        x, y, x2, y2 = faces[0]
        face_coordinates = {'x': float(x), 'y': float(y), 'width': float(x2 - x), 'height': float(y2 - y)}
        
        # # Perform gender detection
        # face_crop = np.copy(frame[y:y2, x:x2])
        # (label, confidence) = cv.detect_gender(face_crop)

        # # Map gender labels (0: 'male', 1: 'female') to strings
        # gender_labels = ['male', 'female']
        # idx = np.argmax(confidence)
        # gender = gender_labels[idx]
        
        # # Add gender information to the face_coordinates dictionary
        # face_coordinates['gender'] = gender
        
        face_img = frame[y:y2, x:x2]
        label, confidence = cv.detect_gender(face_img)
        gender = np.argmax(confidence)
        face_coordinates['gender'] = label[gender]

        print(face_coordinates)
        cv2.rectangle(frame, (x, y), (x2, y2), (0, 255, 0), 2)
        cv2.imshow('frame', frame)
        
    # 'q' 키를 누르면 종료
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 웹캠 해제
camera.release()