import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { Navbar, Page, Progressbar } from 'framework7-react';
import { useState, useRef, useEffect } from 'react';
import { useFakeProgress } from 'react-use-fakeprogress';
import DeepSquatMain from './components/DeepSquatMain';

function DeepSquat() {
  const [loadingModel, setLoadingModel] = useState(true);
  const poseLandmarkerRef = useRef<PoseLandmarker>();
  const [size, setSize] = useState({ width: 0, height: 0 });

  const [progress, start, done] = useFakeProgress(8000);

  useEffect(() => {
    import('vconsole').then((vconsole) => {
      new vconsole.default();
    });
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize(); // 初始化大小
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    setLoadingModel(true);
    start();
    const createPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(`${window.location.href}/wasm`);
      poseLandmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `${window.location.href}/pose_landmarker_full.task`,
          delegate: 'CPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1, // 设置同时检测的最大姿态数量
        minPoseDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
    };
    createPoseLandmarker().then(() => {
      setTimeout(() => {
        setLoadingModel(false);
      done();
      }, 4000);
    });
  }, []);
  return (
    <Page>
      <Navbar title="深蹲训练" backLink=" "></Navbar>
      <div className="grid place-items-center h-full">
        <div className="m-auto">
          {loadingModel ? (
            <div className="w-80 px-2">
              <div className="my-2 text-center">模型加载中...</div>
              <Progressbar progress={progress * 100} />
            </div>
          ) : (
            <DeepSquatMain width={size.width} height={size.height} poseLandmarkerRef={poseLandmarkerRef} />
          )}
        </div>
      </div>
    </Page>
  );
}

export default DeepSquat;
