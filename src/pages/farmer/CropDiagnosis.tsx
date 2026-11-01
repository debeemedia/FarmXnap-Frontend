import React, { useEffect, useRef, useState } from "react";
import { CameraIcon } from "../../components/Icons";
import { apiFetch } from "../../services/api";
import { Button } from "../../components/Button";
import { ErrorMessage } from "../../components/ErrorMessage";
import styles from "./CropDiagnosis.module.css";
import { CropDiagnosesHistory } from "./CropDiagnosesHistory";
import type { CropScanResponse } from "../../types/crop_diagnosis";
import { CropDiagnosisDetail } from "../../components/farmer/CropDiagnosisDetail";

/**
 * @todo: Much later, allow for camera scan on desktop.
 */

export function CropDiagnosis() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<
    CropScanResponse["data"] | null
  >(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const processFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return setError(`Please select a ${ACCEPTED_TYPES_TEXT} image.`);
    }

    if (file.size > MAX_FILE_SIZE) {
      return setError(`Image must be ${MAX_FILE_SIZE_MB_TEXT} or smaller.`);
    }

    setError(null);
    setDiagnosisResult(null);
    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // Inspect dragged item types
    const items = Array.from(e.dataTransfer.items);

    const hasInvalidType = items.some(
      (item) => item.kind === "file" && !ACCEPTED_TYPES.includes(item.type),
    );

    if (hasInvalidType) {
      e.dataTransfer.dropEffect = "none";
    } else {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return setError("Please select an image first.");
    }

    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await apiFetch<CropScanResponse>("/crop_scans", {
        method: "POST",
        body: formData,
        requiresAuth: true,
        isFileUpload: true,
      });

      setDiagnosisResult(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to scan image.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setSelectedFile(null);
    setDiagnosisResult(null);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Crop Diagnosis & Treatment</h1>
        <p className={styles.subtitle}>
          Upload or snap a photo of an unhealthy leaf to identify diseases and
          find local treatments.
        </p>
      </header>

      {error && <ErrorMessage errorMessage={error} />}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className={styles.hiddenInput}
        accept={ACCEPTED_TYPES.join(", ")}
      />

      {/* Upload Zone or Image Preview */}
      {!previewUrl ? (
        <div
          className={styles.uploadCard}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className={styles.cameraCircle}>
            <CameraIcon className={styles.cameraIcon} />
          </div>
          <div className={styles.uploadTextGroup}>
            <p className={styles.primaryText}>
              Tap to take photo or upload leaf image
            </p>
            <p className={styles.secondaryText}>
              Or drag and drop ({ACCEPTED_TYPES_TEXT} up to{" "}
              {MAX_FILE_SIZE_MB_TEXT})
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.previewCard}>
          <img
            src={previewUrl}
            alt="Crop Scan Preview"
            className={styles.previewImage}
          />
        </div>
      )}

      {/* Action Buttons */}
      {selectedFile && (
        <div className={styles.actionRow}>
          {!diagnosisResult && (
            <Button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              loading={loading}
              loadingText="Analyzing..."
            >
              Scan Crop
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={handleFileReset}
            disabled={loading}
          >
            Retake Photo
          </Button>
        </div>
      )}

      {/* Diagnosis Results */}
      <CropDiagnosisDetail diagnosisResult={diagnosisResult} />

      {/* Crop Scan Diagnoses History Section */}
      <CropDiagnosesHistory />
    </div>
  );
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

const ACCEPTED_TYPES_TEXT = "JPG, PNG, WEBP, HEIC, or HEIF";
const MAX_FILE_SIZE_MB_TEXT = "10 MB";
