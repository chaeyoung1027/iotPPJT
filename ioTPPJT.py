# Firebase URL (based on user identifier)
#BASE_URL = f'https://commonpjt-fd9ed-default-rtdb.asia-southeast1.firebasedatabase.app/{user_key}/info.json'import requests
import requests
from sense_hat import SenseHat
import datetime
import time

sense = SenseHat()

user_key = "lim chaeyoung"

INFO_URL = f'https://commonpjt-fd9ed-default-rtdb.asia-southeast1.firebasedatabase.app/{user_key}/info.json'
SENSEHAT_URL = f'https://commonpjt-fd9ed-default-rtdb.asia-southeast1.firebasedatabase.app/{user_key}/sensehat.json'

while True:
    try:
        student_id = "2024800015"
        accel = sense.get_accelerometer_raw()
        gyro = sense.get_gyroscope()
        humidity = round(sense.get_humidity(), 2)
        pressure = round(sense.get_pressure(), 2)
        temperature = round(sense.get_temperature(), 2)
        timestamp = datetime.datetime.utcnow().isoformat()

        # 1. Send student_id to /info
        info_payload = {
            "student_id": student_id
        }
        info_response = requests.put(INFO_URL, json=info_payload)

        # 2. Send sensehat data to /sensehat
        sensehat_payload = {
            "accel": {
                "x": round(accel['x'], 4),
                "y": round(accel['y'], 4),
                "z": round(accel['z'], 4)
            },
            "gyro": {
                "x": round(gyro['pitch'], 4),
                "y": round(gyro['roll'], 4),
                "z": round(gyro['yaw'], 4)
            },
            "humidity": humidity,
            "pressure": pressure,
            "temperature": temperature,
            "timestamp": timestamp
        }
        sensehat_response = requests.put(SENSEHAT_URL, json=sensehat_payload)

        if info_response.status_code == 200 and sensehat_response.status_code == 200:
            print("? Data sent successfully")
        else:
            print("? Failed to send data")
            print("info:", info_response.status_code, info_response.text)
            print("sensehat:", sensehat_response.status_code, sensehat_response.text)

        time.sleep(5)

    except KeyboardInterrupt:
        print("Program stopped by user")
        sense.clear()
        break
