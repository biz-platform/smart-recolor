"use client";

import { useState } from "react";

export default function UploadPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultImage(null); // 초기화
    }
  };

  const handleUpload = async () => {
    if (!imageFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("이미지 변환 실패");

      const blob = await res.blob();
      const resultUrl = URL.createObjectURL(blob);
      setResultImage(resultUrl);
    } catch (err) {
      alert("에러 발생: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">🎨 이미지 색상 변환</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4"
      />

      {previewUrl && (
        <div className="mb-6">
          <p className="font-medium mb-1">원본 이미지:</p>
          <img src={previewUrl} alt="원본" className="rounded shadow w-full" />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading || !imageFile}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? "처리 중..." : "변환 요청"}
      </button>

      {resultImage && (
        <div className="mt-8">
          <p className="font-medium mb-1">변환된 이미지:</p>
          <img
            src={resultImage}
            alt="결과 이미지"
            className="rounded shadow w-full"
          />
        </div>
      )}
    </div>
  );
}
