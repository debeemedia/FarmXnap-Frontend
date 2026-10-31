import { useEffect, useState } from "react";
import styles from "./CropDiagnosesHistory.module.css";
import type { Diagnosis, Treatment } from "../../types/crop_diagnosis";
import type { ApiLink } from "../../types/common";
import { apiFetch } from "../../services/api";
import { Button } from "../../components/Button";
import { CropDiagnosisDetail } from "../../components/farmer/CropDiagnosisDetail";
import { formatDate } from "../../utils/helpers";

type CropScanHistory = Diagnosis & {
  id: string;
  created_at: string;
  links: Record<string, ApiLink>;
};

type CropScanHistoryResponse = {
  data: CropScanHistory[];
};

type CropScanTreatmentsResponse = {
  data: Treatment[];
};

export function CropDiagnosesHistory() {
  const [loadingHistories, setLoadingHistories] = useState(false);
  const [loadingTreatments, setLoadingTreatments] = useState(false);
  const [histories, setHistories] = useState<CropScanHistory[]>();
  const [selectedHistory, setSelectedHistory] =
    useState<CropScanHistory | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>();

  useEffect(() => {
    (async () => {
      setLoadingHistories(true);

      try {
        const response = await apiFetch<CropScanHistoryResponse>(
          "/crop_scans",
          {
            method: "GET",
            requiresAuth: true,
          },
        );

        setHistories(response["data"]);
      } catch (err) {
        console.error("Failed to get diagnoses history:", err);
      } finally {
        setLoadingHistories(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedHistory) {
        return setTreatments([]);
      }

      const getTreatmentsLink = selectedHistory?.links.get_treatments;

      if (!getTreatmentsLink) {
        return setTreatments([]);
      }

      setLoadingTreatments(true);
      setTreatments([]);

      try {
        const response = await apiFetch<CropScanTreatmentsResponse>(
          getTreatmentsLink.href,
          {
            method: getTreatmentsLink.method,
            requiresAuth: true,
          },
        );

        setTreatments(response["data"] || []);
      } catch (err) {
        console.error("Failed to get treatments:", err);
      } finally {
        setLoadingTreatments(false);
      }
    })();
  }, [selectedHistory]);

  return (
    <section className={styles.historySection}>
      <h2 className={styles.historyTitle}>Recent Diagnoses & History</h2>

      {loadingHistories ? (
        <p className={styles.loadingText}>Loading your diagnoses history...</p>
      ) : histories?.length ? (
        <ul className={styles.historyList}>
          {histories?.map((history) => {
            return (
              <li
                key={history.id}
                className={styles.historyItem}
                onClick={() => setSelectedHistory(history)}
              >
                <div className={styles.historyItemContent}>
                  <span className={styles.historyCropInfo}>
                    {history.crop} — {history.disease || "Healthy Crop"}
                  </span>
                  <span className={styles.historyDate}>
                    {formatDate(history.created_at)}
                  </span>
                </div>
                <span style={{ color: "var(--color-text-muted)" }}>›</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className={styles.emptyText}>
          There are no diagnosed crops to show.
        </p>
      )}

      {selectedHistory && (
        <dialog
          className={styles.historyModal}
          ref={(node) => {
            if (node && !node.open) {
              node.showModal();
            }
          }}
          onClose={() => setSelectedHistory(null)}
          onClick={(e) => {
            // If the click target is the dialog itself (i.e. the backdrop, not elements inside the dialog), close it
            if (e.target === e.currentTarget) {
              // e.currentTarget.close(); // Not necessary because the dialog only renders when selectedHistory is truthy.
              setSelectedHistory(null);
            }
          }}
        >
          <div className={styles.modalHeader}>
            <Button
              type="button"
              variant="text"
              className={styles.modalCloseBtn}
              onClick={() => setSelectedHistory(null)}
            >
              ✕
            </Button>
          </div>

          <CropDiagnosisDetail
            diagnosisResult={{
              diagnosis: selectedHistory,
              treatments: treatments,
            }}
          />
          {loadingTreatments && (
            <p className={styles.loadingText}>
              Fetching recommended treatments...
            </p>
          )}
        </dialog>
      )}
    </section>
  );
}
