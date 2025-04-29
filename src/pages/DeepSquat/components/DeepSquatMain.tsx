import { Button } from 'framework7-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pose, NormalizedLandmark, NormalizedLandmarkList, Results, POSE_CONNECTIONS } from '@mediapipe/pose';

function getKneeData(landmarks: NormalizedLandmarkList) {
  const leftHip = landmarks[23];
  const rightHip = landmarks[24];
  const leftKnee = landmarks[25];
  const rightKnee = landmarks[26];
  const leftAnkle = landmarks[27];
  const rightAnkle = landmarks[28];
  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const kneeAvgAngle = (leftKneeAngle + rightKneeAngle) / 2;
  return {
    leftKneeAngle,
    rightKneeAngle,
    leftKnee,
    rightKnee,
    leftAnkle,
    rightAnkle,
    leftHip,
    rightHip,
    kneeAvgAngle,
  };
}

function calculateAngle(a: NormalizedLandmark, b: NormalizedLandmark, c: NormalizedLandmark) {
  const ab = { x: a.x - b.x, y: a.y - b.y };
  const cb = { x: c.x - b.x, y: c.y - b.y };
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.hypot(ab.x, ab.y);
  const magCB = Math.hypot(cb.x, cb.y);
  let angle = Math.acos(dot / (magAB * magCB));
  return angle * (180 / Math.PI);
}

const videoData = ['./4265287-uhd_3840_2160_30fps.mp4', './2785531-uhd_2160_3840_25fps.mp4', './8836896-uhd_4096_2160_25fps.mp4', './youTube_video.mp4'];

function getCameraStream(): Promise<MediaStream> {
  return new Promise((res) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: 'user', // 前置摄像头，'environment' 为后置
            width: { ideal: 1280 }, // 理想分辨率
            height: { ideal: 720 },
          },
          audio: false,
        })
        .then((stream) => res(stream));
    }
  });
}

let lastTimeStamp = 0;

function DeepSquat({ width, height, poseRef }: { width: number; height: number; poseRef: React.RefObject<Pose | undefined> }) {
  const [enableCamera, setEnableCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [squatCount, setSquatCount] = useState(0);
  const squatStateRef = useRef<'standing' | 'squatting' | 'returning'>('standing');
  const rewardSoundRef = useRef<HTMLAudioElement | undefined>(typeof Audio !== 'undefined' ? new Audio(`${location.href}/silent_1s.mp3`) : undefined);

  // 初始化 canvas 上下文
  useEffect(() => {
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext('2d');
      if (!canvasCtxRef.current) {
        console.error('Failed to get canvas context');
      }
    }
  }, []);

  // 调整 canvas 尺寸
  const resizeCanvas = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const videoRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;
    const displayRatio = width / height;
    if (!videoRatio || !displayRatio) return;

    let renderWidth, renderHeight;
    if (videoRatio > displayRatio) {
      renderWidth = width;
      renderHeight = width / videoRatio;
    } else {
      renderHeight = height;
      renderWidth = height * videoRatio;
    }

    canvasRef.current.style.width = `${renderWidth}px`;
    canvasRef.current.style.height = `${renderHeight - 44}px`;
  }, [width, height]);

  useEffect(() => {
    resizeCanvas();
  }, [resizeCanvas]);

  const startDeepSquat = (streamOrSrc: MediaStream | string) => {
    if (videoRef.current) {
      if (typeof streamOrSrc === 'string') {
        videoRef.current.src = streamOrSrc;
      } else {
        videoRef.current.srcObject = streamOrSrc;
      }
      videoRef.current.addEventListener('loadedmetadata', function () {
        if (canvasRef.current) {
          canvasRef.current.width = videoRef.current?.videoWidth || 0;
          canvasRef.current.height = videoRef.current?.videoHeight || 0;
          resizeCanvas();
        }
      });
    }
    setEnableCamera(true);
    startPoseDetection();
    const audio = rewardSoundRef.current;
    audio?.play().then(() => {
      audio.pause();
      audio.currentTime = 0;
      rewardSoundRef.current = new Audio(`${location.href}/mario-coin.wav`);
    });
  };

  const enableCamHandler = useCallback(() => {
    getCameraStream()
      .then((stream) => {
        startDeepSquat(stream);
      })
      .catch((err) => {
        console.error('Camera error:', err);
      });
  }, []);

  const previewVideo = (src: string) => {
    startDeepSquat(src);
  };

  const startPoseDetection = useCallback(async () => {
    poseRef.current?.onResults(onResults);
    async function processFrame() {
      if (!videoRef.current) return;
      if (videoRef.current.readyState >= 2) {
        poseRef.current?.send({ image: videoRef.current });
      }
      requestAnimationFrame(processFrame);
    }
    processFrame();
  }, []);

  const onResults = useCallback((results: Results) => {
    const canvasCtx = canvasCtxRef.current;
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (!canvasCtx || !videoElement || !canvasElement) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.translate(canvasElement.width, 0);
    canvasCtx.scale(-1, 1);
    canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.restore();

    if (results.poseLandmarks && results.poseLandmarks.length > 0) {
      drawLandmarks(results.poseLandmarks);
      detectSquat(results.poseLandmarks);
    }
  }, []);

  const drawLandmarks = useCallback((landmarks: NormalizedLandmarkList) => {
    const canvasCtx = canvasCtxRef.current;
    const canvasElement = canvasRef.current;
    if (!canvasCtx || !canvasElement) return;

    canvasCtx.fillStyle = 'red';
    canvasCtx.strokeStyle = 'green';
    canvasCtx.lineWidth = 2;

    const connections = POSE_CONNECTIONS;
    for (const connection of connections) {
      const start = landmarks[connection[0]];
      const end = landmarks[connection[1]];
      if (isLandmarkVisible(start) && isLandmarkVisible(end)) {
        canvasCtx.beginPath();
        canvasCtx.moveTo((1 - start.x) * canvasElement.width, start.y * canvasElement.height);
        canvasCtx.lineTo((1 - end.x) * canvasElement.width, end.y * canvasElement.height);
        canvasCtx.stroke();
      }
    }

    for (const landmark of landmarks) {
      if (isLandmarkVisible(landmark)) {
        canvasCtx.beginPath();
        canvasCtx.arc((1 - landmark.x) * canvasElement.width, landmark.y * canvasElement.height, 5, 0, 2 * Math.PI);
        canvasCtx.fill();
      }
    }

    // 显示膝盖弯曲角度
    const { leftKneeAngle, leftKnee, rightKneeAngle, rightKnee } = getKneeData(landmarks);
    const kneeAngle = leftKneeAngle;

    if (isLandmarkVisible(leftKnee)) {
      canvasCtx.font = '40px Arial';
      canvasCtx.fillStyle = 'white';
      canvasCtx.fillText(`${Math.round(kneeAngle)}°`, (1 - leftKnee.x) * canvasElement.width + 10, leftKnee.y * canvasElement.height - 10);
    }

    if (isLandmarkVisible(rightKnee)) {
      canvasCtx.font = '40px Arial';
      canvasCtx.fillStyle = 'white';
      canvasCtx.fillText(`${Math.round(rightKneeAngle)}°`, (1 - rightKnee.x) * canvasElement.width + 10, rightKnee.y * canvasElement.height - 10);
    }
  }, []);

  const onSuccess = useCallback(() => {
    const rewardSound = rewardSoundRef.current;
    setSquatCount((prevCount) => prevCount + 1);
    rewardSound?.play().catch((err) => console.error('音效播放失败:', err));
  }, []);

  // 判断关键点是否可见
  const isLandmarkVisible = useCallback((landmark: NormalizedLandmark) => {
    if (landmark.visibility! < 0.5) return false;
    return landmark.x >= 0 && landmark.x <= 1 && landmark.y >= 0 && landmark.y <= 1;
  }, []);

  // 检测深蹲动作
  const detectSquat = useCallback((landmarks: NormalizedLandmarkList) => {
    const { kneeAvgAngle } = getKneeData(landmarks);

    if (kneeAvgAngle < 120 && squatStateRef.current === 'standing') {
      squatStateRef.current = 'squatting';
      lastTimeStamp = performance.now();
    }

    if (kneeAvgAngle > 160 && squatStateRef.current === 'squatting') {
      squatStateRef.current = 'standing';
      if (performance.now() - lastTimeStamp < 2000) {
        onSuccess();
      }
    }
  }, []);

  return (
    <>
      <div className="relative bg-[#000]" style={{ width, height: height - 44, display: enableCamera ? 'block' : 'none' }}>
        <div id="render-wrapper" className="flex justify-center items-center">
          <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />
          <canvas ref={canvasRef} width={width} height={height - 44} />
        </div>
        <div
          id="counter"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          className="fixed top-12 left-1 text-[#fff] p-[10px] rounded-[10px]"
          onClick={() => {
            rewardSoundRef.current?.play().catch((err) => console.error('音效播放失败:', err));
          }}
        >
          深蹲次数: {squatCount}
        </div>
      </div>
      <div style={{ display: enableCamera ? 'none' : 'flex' }} className="flex-col items-center p-2 pt-4">
        <div className="w-1/2 mb-4">
          <Button large fill onClick={enableCamHandler}>
            开始训练(摄像头)
          </Button>
        </div>
        {videoData.map((item, index) => (
          <video onClick={() => previewVideo(item)} className="w-full h-auto mb-4" key={index} src={item} playsInline muted />
        ))}
      </div>
    </>
  );
}

export default DeepSquat;
