/* Function */
function Vision() {
    // For Google-vision
    this.vision = require('@google-cloud/vision');
    this.client = new this.vision.ImageAnnotatorClient();
}

// Example
// // fileName 대신에 bitStream(Image itself)가 들어가도 된다고 함.
// let fileName = './images/IU.jpg'

// detect(fileName);

async function detect(image) {
    // await는 비동기적 함수를 기다려주는 역할
    const [result] = await this.client.faceDetection(image);
    const faces = result.faceAnnotations;

    let face = faces[0];

    return {
        'joy': face.joyLikelihood,
        'anger': face.angerLikelihood,
        'sorrow': face.sorrowLikelihood,
        'surprise': face.surpriseLikelihood
    }
}

/* Export */
Vision.prototype.detect = detect;
module.exports = Vision;