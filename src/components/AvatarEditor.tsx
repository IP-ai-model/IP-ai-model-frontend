import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, Upload, Crop, Palette, RotateCw, ZoomIn, ZoomOut, Square, Circle, X, Check, Move, RotateCcw } from 'lucide-react';

interface AvatarEditorProps {
  currentAvatar: string;
  onSave: (newAvatar: string) => void;
  onClose: () => void;
}

interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
}

type CropShape = 'circle' | 'square';

const AvatarEditor: React.FC<AvatarEditorProps> = ({ currentAvatar, onSave, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [cropSettings, setCropSettings] = useState<CropSettings>({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    scale: 1,
    rotation: 0,
  });
  const [cropShape, setCropShape] = useState<CropShape>('circle');
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropAreaRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize crop area when image loads
  useEffect(() => {
    if (originalImage && imageLoaded) {
      const container = containerRef.current;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const imageAspect = originalImage.width / originalImage.height;
        const containerAspect = containerRect.width / containerRect.height;
        
        let displayWidth, displayHeight;
        if (imageAspect > containerAspect) {
          displayWidth = containerRect.width;
          displayHeight = containerRect.width / imageAspect;
        } else {
          displayHeight = containerRect.height;
          displayWidth = containerRect.height * imageAspect;
        }
        
        // Center the crop area
        const cropSize = Math.min(displayWidth, displayHeight) * 0.6;
        setCropSettings({
          x: (displayWidth - cropSize) / 2,
          y: (displayHeight - cropSize) / 2,
          width: cropSize,
          height: cropSize,
          scale: 1,
          rotation: 0,
        });
      }
    }
  }, [originalImage, imageLoaded]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setSelectedImage(result);
        setImageLoaded(false);
        
        // Create image object to get dimensions
        const img = new Image();
        img.onload = () => {
          setOriginalImage(img);
          setImageLoaded(true);
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (action === 'drag') {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - cropSettings.x,
        y: e.clientY - cropSettings.y,
      });
    } else if (action.startsWith('resize')) {
      setIsResizing(true);
      setResizeHandle(action);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [cropSettings.x, cropSettings.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      const container = containerRef.current;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const newX = Math.max(0, Math.min(
          containerRect.width - cropSettings.width,
          e.clientX - dragStart.x
        ));
        const newY = Math.max(0, Math.min(
          containerRect.height - cropSettings.height,
          e.clientY - dragStart.y
        ));
        
        setCropSettings(prev => ({ ...prev, x: newX, y: newY }));
      }
    } else if (isResizing) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      const container = containerRef.current;
      
      if (container) {
        const containerRect = container.getBoundingClientRect();
        
        setCropSettings(prev => {
          let newWidth = prev.width;
          let newHeight = prev.height;
          let newX = prev.x;
          let newY = prev.y;
          
          if (resizeHandle.includes('right')) {
            newWidth = Math.max(50, Math.min(containerRect.width - prev.x, prev.width + deltaX));
          }
          if (resizeHandle.includes('left')) {
            const maxDelta = prev.width - 50;
            const actualDelta = Math.max(-maxDelta, Math.min(prev.x, deltaX));
            newWidth = prev.width - actualDelta;
            newX = prev.x + actualDelta;
          }
          if (resizeHandle.includes('bottom')) {
            newHeight = Math.max(50, Math.min(containerRect.height - prev.y, prev.height + deltaY));
          }
          if (resizeHandle.includes('top')) {
            const maxDelta = prev.height - 50;
            const actualDelta = Math.max(-maxDelta, Math.min(prev.y, deltaY));
            newHeight = prev.height - actualDelta;
            newY = prev.y + actualDelta;
          }
          
          // Maintain aspect ratio for circle
          if (cropShape === 'circle') {
            const size = Math.min(newWidth, newHeight);
            newWidth = size;
            newHeight = size;
          }
          
          return { ...prev, x: newX, y: newY, width: newWidth, height: newHeight };
        });
        
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    }
  }, [isDragging, isResizing, dragStart, resizeHandle, cropShape, cropSettings.width, cropSettings.height]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle('');
  }, []);

  const handleScaleChange = useCallback((delta: number) => {
    setCropSettings(prev => ({
      ...prev,
      scale: Math.max(0.1, Math.min(5, prev.scale + delta)),
    }));
  }, []);

  const handleRotationChange = useCallback((degrees: number) => {
    setCropSettings(prev => ({
      ...prev,
      rotation: (prev.rotation + degrees) % 360,
    }));
  }, []);

  const resetCrop = useCallback(() => {
    if (originalImage && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageAspect = originalImage.width / originalImage.height;
      const containerAspect = containerRect.width / containerRect.height;
      
      let displayWidth, displayHeight;
      if (imageAspect > containerAspect) {
        displayWidth = containerRect.width;
        displayHeight = containerRect.width / imageAspect;
      } else {
        displayHeight = containerRect.height;
        displayWidth = containerRect.height * imageAspect;
      }
      
      const cropSize = Math.min(displayWidth, displayHeight) * 0.6;
      setCropSettings({
        x: (displayWidth - cropSize) / 2,
        y: (displayHeight - cropSize) / 2,
        width: cropSize,
        height: cropSize,
        scale: 1,
        rotation: 0,
      });
    }
  }, [originalImage]);

  const generatePreview = useCallback(() => {
    const previewCanvas = previewCanvasRef.current;
    if (!previewCanvas || !originalImage) return;
    
    const ctx = previewCanvas.getContext('2d');
    if (!ctx) return;
    
    previewCanvas.width = 120;
    previewCanvas.height = 120;
    
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    
    // Calculate crop area relative to original image
    const container = containerRef.current;
    if (!container) return;
    
    const containerRect = container.getBoundingClientRect();
    const imageAspect = originalImage.width / originalImage.height;
    const containerAspect = containerRect.width / containerRect.height;
    
    let displayWidth, displayHeight;
    if (imageAspect > containerAspect) {
      displayWidth = containerRect.width;
      displayHeight = containerRect.width / imageAspect;
    } else {
      displayHeight = containerRect.height;
      displayWidth = containerRect.height * imageAspect;
    }
    
    const scaleX = originalImage.width / displayWidth;
    const scaleY = originalImage.height / displayHeight;
    
    const sourceX = cropSettings.x * scaleX;
    const sourceY = cropSettings.y * scaleY;
    const sourceWidth = cropSettings.width * scaleX;
    const sourceHeight = cropSettings.height * scaleY;
    
    ctx.save();
    
    // Apply shape mask
    if (cropShape === 'circle') {
      ctx.beginPath();
      ctx.arc(previewCanvas.width / 2, previewCanvas.height / 2, previewCanvas.width / 2, 0, 2 * Math.PI);
      ctx.clip();
    }
    
    // Apply transformations
    ctx.translate(previewCanvas.width / 2, previewCanvas.height / 2);
    ctx.rotate((cropSettings.rotation * Math.PI) / 180);
    ctx.scale(cropSettings.scale, cropSettings.scale);
    
    ctx.drawImage(
      originalImage,
      sourceX, sourceY, sourceWidth, sourceHeight,
      -previewCanvas.width / 2, -previewCanvas.height / 2,
      previewCanvas.width, previewCanvas.height
    );
    
    ctx.restore();
  }, [originalImage, cropSettings, cropShape]);

  useEffect(() => {
    generatePreview();
  }, [generatePreview]);

  const generateAvatar = useCallback(async () => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      canvas.width = 200;
      canvas.height = 200;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate crop area relative to original image
      const container = containerRef.current;
      if (!container) return;
      
      const containerRect = container.getBoundingClientRect();
      const imageAspect = originalImage.width / originalImage.height;
      const containerAspect = containerRect.width / containerRect.height;
      
      let displayWidth, displayHeight;
      if (imageAspect > containerAspect) {
        displayWidth = containerRect.width;
        displayHeight = containerRect.width / imageAspect;
      } else {
        displayHeight = containerRect.height;
        displayWidth = containerRect.height * imageAspect;
      }
      
      const scaleX = originalImage.width / displayWidth;
      const scaleY = originalImage.height / displayHeight;
      
      const sourceX = cropSettings.x * scaleX;
      const sourceY = cropSettings.y * scaleY;
      const sourceWidth = cropSettings.width * scaleX;
      const sourceHeight = cropSettings.height * scaleY;
      
      ctx.save();
      
      // Apply shape mask
      if (cropShape === 'circle') {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
        ctx.clip();
      }
      
      // Apply transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((cropSettings.rotation * Math.PI) / 180);
      ctx.scale(cropSettings.scale, cropSettings.scale);
      
      ctx.drawImage(
        originalImage,
        sourceX, sourceY, sourceWidth, sourceHeight,
        -canvas.width / 2, -canvas.height / 2,
        canvas.width, canvas.height
      );
      
      ctx.restore();
      
      const dataURL = canvas.toDataURL('image/png', 0.9);
      onSave(dataURL);
      onClose();
    } catch (error) {
      console.error('Error generating avatar:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [originalImage, cropSettings, cropShape, onSave, onClose]);

  const generateRandomAvatar = useCallback(() => {
    const seed = Math.random().toString(36).substring(7);
    const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
    onSave(randomAvatar);
    onClose();
  }, [onSave, onClose]);

  const displayImage = selectedImage || currentAvatar;

  return (
    <div className="absolute right-0 top-full mt-2 w-[480px] bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 z-50 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Edit Avatar</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Upload Section */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">Upload New Image</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-500 transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag & drop an image or click to browse
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 bg-gradient-to-r from-pink-500/20 to-gray-500/20 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:from-pink-500/30 hover:to-gray-500/30 transition-all duration-300"
            >
              Choose File
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Supports JPG, PNG, GIF (max 5MB)
            </p>
          </div>

          {/* Quick Options */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={generateRandomAvatar}
              className="flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500/20 to-blue-400/20 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:from-blue-500/30 hover:to-blue-400/30 transition-all duration-300"
            >
              <Palette className="w-4 h-4" />
              <span>Random</span>
            </button>
            
            <button
              onClick={() => {
                navigator.mediaDevices.getUserMedia({ video: true })
                  .then(stream => {
                    console.log('Camera access granted');
                    stream.getTracks().forEach(track => track.stop());
                  })
                  .catch(err => console.error('Camera access denied:', err));
              }}
              className="flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-500/20 to-green-400/20 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:from-green-500/30 hover:to-green-400/30 transition-all duration-300"
            >
              <Camera className="w-4 h-4" />
              <span>Camera</span>
            </button>
          </div>
        </div>

        {/* Crop Shape Selection */}
        {displayImage && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Crop Shape</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => setCropShape('circle')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  cropShape === 'circle'
                    ? 'bg-pink-500/20 text-pink-700 border border-pink-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Circle className="w-4 h-4" />
                <span>Circle</span>
              </button>
              <button
                onClick={() => setCropShape('square')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  cropShape === 'square'
                    ? 'bg-pink-500/20 text-pink-700 border border-pink-500/30'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Square className="w-4 h-4" />
                <span>Square</span>
              </button>
            </div>
          </div>
        )}

        {/* Crop Area */}
        {displayImage && imageLoaded && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Adjust Crop Area</h4>
            <div 
              ref={containerRef}
              className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Background Image */}
              <img
                src={displayImage}
                alt="Crop preview"
                className="absolute inset-0 w-full h-full object-contain"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `scale(${cropSettings.scale}) rotate(${cropSettings.rotation}deg)`,
                  transformOrigin: 'center center',
                  translate: '-50% -50%',
                }}
                draggable={false}
              />
              
              {/* Crop Overlay - Fixed to prevent repetition */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `
                    linear-gradient(to right, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) ${cropSettings.x}px, transparent ${cropSettings.x}px, transparent ${cropSettings.x + cropSettings.width}px, rgba(0,0,0,0.5) ${cropSettings.x + cropSettings.width}px, rgba(0,0,0,0.5) 100%),
                    linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) ${cropSettings.y}px, transparent ${cropSettings.y}px, transparent ${cropSettings.y + cropSettings.height}px, rgba(0,0,0,0.5) ${cropSettings.y + cropSettings.height}px, rgba(0,0,0,0.5) 100%)
                  `,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              
              {/* Crop Area */}
              <div
                ref={cropAreaRef}
                className={`absolute border-2 border-white shadow-lg ${
                  cropShape === 'circle' ? 'rounded-full' : 'rounded-lg'
                }`}
                style={{
                  left: cropSettings.x,
                  top: cropSettings.y,
                  width: cropSettings.width,
                  height: cropSettings.height,
                  background: 'transparent',
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
                onMouseDown={(e) => handleMouseDown(e, 'drag')}
              >
                {/* Crop Area Content */}
                <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: cropShape === 'circle' ? '50%' : '8px' }}>
                  <img
                    src={displayImage}
                    alt="Cropped preview"
                    className="absolute object-contain"
                    style={{
                      left: `calc(50% - ${cropSettings.x}px)`,
                      top: `calc(50% - ${cropSettings.y}px)`,
                      width: containerRef.current?.offsetWidth || 0,
                      height: containerRef.current?.offsetHeight || 0,
                      transform: `scale(${cropSettings.scale}) rotate(${cropSettings.rotation}deg)`,
                      transformOrigin: 'center center',
                      translate: '-50% -50%',
                    }}
                    draggable={false}
                  />
                </div>
                
                {/* Resize Handles */}
                {!isDragging && (
                  <>
                    <div
                      className="absolute -top-1 -left-1 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-nw-resize"
                      onMouseDown={(e) => handleMouseDown(e, 'resize-top-left')}
                    />
                    <div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-ne-resize"
                      onMouseDown={(e) => handleMouseDown(e, 'resize-top-right')}
                    />
                    <div
                      className="absolute -bottom-1 -left-1 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-sw-resize"
                      onMouseDown={(e) => handleMouseDown(e, 'resize-bottom-left')}
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-gray-400 rounded-full cursor-se-resize"
                      onMouseDown={(e) => handleMouseDown(e, 'resize-bottom-right')}
                    />
                  </>
                )}
                
                {/* Center Move Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Move className="w-6 h-6 text-white/80 drop-shadow-lg" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        {displayImage && imageLoaded && (
          <div className="space-y-4">
            {/* Scale Control */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-700">Zoom</h5>
                <span className="text-sm text-gray-500">{cropSettings.scale.toFixed(1)}x</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleScaleChange(-0.1)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={cropSettings.scale}
                  onChange={(e) => setCropSettings(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <button
                  onClick={() => handleScaleChange(0.1)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rotation Control */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-700">Rotation</h5>
                <span className="text-sm text-gray-500">{cropSettings.rotation}°</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleRotationChange(-90)}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>-90°</span>
                </button>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={cropSettings.rotation}
                  onChange={(e) => setCropSettings(prev => ({ ...prev, rotation: parseInt(e.target.value) }))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <button
                  onClick={() => handleRotationChange(90)}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>+90°</span>
                </button>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetCrop}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
            >
              <Crop className="w-4 h-4" />
              <span>Reset Crop</span>
            </button>
          </div>
        )}

        {/* Preview */}
        {displayImage && imageLoaded && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Preview</h4>
            <div className="flex justify-center">
              <div className={`w-24 h-24 border-2 border-gray-300 ${cropShape === 'circle' ? 'rounded-full' : 'rounded-lg'} overflow-hidden bg-gray-100`}>
                <canvas
                  ref={previewCanvasRef}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={generateAvatar}
          disabled={isProcessing || !displayImage || !imageLoaded}
          className="px-6 py-2 bg-gradient-to-r from-pink-500/20 to-gray-500/20 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:from-pink-500/30 hover:to-gray-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Save Avatar</span>
            </>
          )}
        </button>
      </div>

      {/* Hidden canvas for final processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default AvatarEditor;