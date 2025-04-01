from flask import Flask, request, send_file
import cv2, numpy as np, tempfile, os, random

app = Flask(__name__)

COLOR_THEMES = {
    "blue": 120,
    "red": 0,
    "purple": 150,
    "orange": 20,
    "mint": 160,
}

@app.route('/api/convert', methods=['POST'])
def convert():
    file = request.files['file']
    npimg = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    lower_green = np.array([20, 5, 20])
    upper_green = np.array([100, 255, 255])
    mask = cv2.inRange(hsv, lower_green, upper_green)

    output_dir = tempfile.mkdtemp()
    selected = random.sample(list(COLOR_THEMES.items()), 3)

    paths = []
    for name, hue in selected:
        hsv_copy = hsv.copy()
        hsv_copy[..., 0] = np.where(mask > 0, hue, hsv_copy[..., 0])
        recolored = cv2.cvtColor(hsv_copy, cv2.COLOR_HSV2BGR)

        path = os.path.join(output_dir, f"{name}.png")
        cv2.imwrite(path, recolored)
        paths.append(path)

    return send_file(paths[0], mimetype='image/png')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
