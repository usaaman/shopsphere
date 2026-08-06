import { useState, useRef } from 'react';

const CLOUD_NAME = 'dwksuvcdt';
const UPLOAD_PRESET = 'ecommerce_products';

const ImageUpload = ({ value, onUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const uploadToCloudinary = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        setPreview(data.secure_url);
        onUploaded(data.secure_url);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Image upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) uploadToCloudinary(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadToCloudinary(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        uploadToCloudinary(file);
      }
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onPaste={handlePaste}
      onClick={() => fileInputRef.current.click()}
      tabIndex={0}
      className={`sm:col-span-2 border-2 border-dashed rounded p-4 text-center cursor-pointer transition ${
        dragOver ? 'border-gray-900 bg-gray-100' : 'border-gray-300'
      }`}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploading ? (
        <p className="text-gray-500">Uploading...</p>
      ) : preview ? (
        <div className="flex flex-col items-center gap-2">
          <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded" />
          <p className="text-sm text-gray-500">Click, drag a new image, or paste to replace</p>
        </div>
      ) : (
        <p className="text-gray-500">
          Click to choose, drag & drop, or paste (Ctrl+V) an image here
        </p>
      )}
    </div>
  );
};

export default ImageUpload;