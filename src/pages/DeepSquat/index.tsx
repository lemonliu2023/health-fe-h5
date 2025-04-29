import { Navbar, Page, Progressbar } from 'framework7-react';
import { useState, useRef, useEffect } from 'react';
import { useFakeProgress } from 'react-use-fakeprogress';
import DeepSquatMain from './components/DeepSquatMain';
import { Pose } from '@mediapipe/pose';

function DeepSquat() {
  const [loadingModel, setLoadingModel] = useState(true);
  const poseRef = useRef<Pose>();
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
    poseRef.current = new Pose({
      locateFile: (file) => {
        console.log(file, 'file');
        return `${window.location.href}/${file}`;
      },
    });
    poseRef.current.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    poseRef.current.initialize().then(() => {
      setLoadingModel(false);
      done();
    });
  }, []);
  return (
    <Page>
      <Navbar title="深蹲训练" backLink=" "></Navbar>
      <div className="grid place-items-center h-full">
        <div className="m-auto">
          {loadingModel ? (
            <div className="w-screen px-10">
              <div className="my-2 text-center">模型加载中...</div>
              <Progressbar progress={progress * 100} />
            </div>
          ) : (
            <DeepSquatMain width={size.width} height={size.height} poseRef={poseRef} />
          )}
        </div>
      </div>
    </Page>
  );
}

export default DeepSquat;
