/* global cv */
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';

const AgeEstimator = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [estimatedAge, setEstimatedAge] = useState(null);
  const [openCvLoaded, setOpenCvLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.5.2/opencv.js';
    script.async = true;
    script.onload = () => {
      console.log('OpenCV.js loaded');
      setOpenCvLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (openCvLoaded && isCapturing) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error("An error occurred: " + err);
        });

      const captureFrame = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const src = cv.imread(canvas);
          const gray = new cv.Mat();
          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
          
          // Simple face detection using edge detection
          const edges = new cv.Mat();
          cv.Canny(gray, edges, 100, 200);
          
          const contours = new cv.MatVector();
          const hierarchy = new cv.Mat();
          cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
          
          for (let i = 0; i < contours.size(); ++i) {
            const contour = contours.get(i);
            const area = cv.contourArea(contour);
            if (area > 1000) {  // Adjust this threshold as needed
              const rect = cv.boundingRect(contour);
              cv.rectangle(src, new cv.Point(rect.x, rect.y), 
                           new cv.Point(rect.x + rect.width, rect.y + rect.height), 
                           [255, 0, 0, 255]);
              
              // Get face image
              const faceImg = src.roi(rect);
              
              // Convert to base64
              const imgData = canvas.toDataURL('image/jpeg');
              
              // Send to API
              estimateAge(imgData);
              break;  // Assume the largest contour is the face
            }
          }
          
          cv.imshow(canvas, src);
          
          src.delete();
          gray.delete();
          edges.delete();
          contours.delete();
          hierarchy.delete();
        }
        
        if (isCapturing) {
          requestAnimationFrame(captureFrame);
        }
      };

      captureFrame();
    }
  }, [openCvLoaded, isCapturing]);

  const estimateAge = async (imageData) => {
    try {
      const response = await fetch('https://telkom-ai-dag.api.apilogy.id/Age_Estimator_CPU/0.0.1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });
      const data = await response.json();
      setEstimatedAge(data.estimatedAge);
    } catch (error) {
      console.error('Error estimating age:', error);
      setEstimatedAge(null);
    }
  };

  const toggleCapturing = () => {
    setIsCapturing(!isCapturing);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>OpenCV-based Age Estimator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <video ref={videoRef} style={{ display: 'none' }}></video>
          <canvas ref={canvasRef} className="w-full rounded-lg"></canvas>
          <Button onClick={toggleCapturing} disabled={!openCvLoaded}>
            {isCapturing ? 'Stop Capturing' : 'Start Capturing'}
          </Button>
          {estimatedAge !== null && (
            <p className="text-center text-lg font-semibold">
              Estimated Age: {estimatedAge} years
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgeEstimator;