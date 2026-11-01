import type { CropScanResponse } from "../../types/crop_diagnosis";
import { formatPrice, getScanMatchLabel } from "../../utils/helpers";
import styles from "./CropDiagnosisDetail.module.css";
import { MapPinIcon, PhoneIcon } from "../Icons";

export function CropDiagnosisDetail({
  diagnosisResult,
}: {
  diagnosisResult: CropScanResponse["data"] | null;
}) {
  return (
    <>
      {diagnosisResult && (
        <section className={styles.resultsCard}>
          <div className={styles.diagnosisHeader}>
            <div>
              <span className={styles.cropBadge}>
                {diagnosisResult.diagnosis.crop}
              </span>
              <h2 className={styles.diseaseTitle}>
                {diagnosisResult.diagnosis.disease || "Healthy Crop"}
              </h2>
            </div>
          </div>

          <div className={styles.sectionBlock}>
            <h3 className={styles.sectionHeading}>Instructions & Analysis</h3>
            <p className={styles.instructionsText}>
              {diagnosisResult.diagnosis.instructions}
            </p>
          </div>

          {/* Treatments Section */}
          {diagnosisResult.treatments && !!diagnosisResult.treatments.length ? (
            <div className={styles.sectionBlock}>
              <h3 className={styles.sectionHeading}>
                Recommended Treatments from Verified AgroDealers
              </h3>
              <div className={styles.treatmentGrid}>
                {diagnosisResult.treatments.map((treatment) => {
                  const scanMatchInfo = getScanMatchLabel(treatment.rank);

                  return (
                    <div key={treatment.id} className={styles.treatmentCard}>
                      {/* Header: Scan Match Rank Badge & Category */}
                      <div className={styles.cardHeader}>
                        <span
                          className={`${styles.rankBadge} ${styles[scanMatchInfo.style]}`}
                        >
                          {scanMatchInfo.label}
                        </span>
                        <span className={styles.categoryBadge}>
                          {treatment.category}
                        </span>
                      </div>

                      {/* Product Title & Formatted Price */}
                      <div className={styles.treatmentTop}>
                        <span className={styles.treatmentName}>
                          {treatment.name}
                        </span>
                        <span className={styles.treatmentPrice}>
                          {formatPrice(treatment.price)}
                        </span>
                        <span className={styles.stockText}>
                          {treatment.stock_quantity > 0
                            ? `In Stock (${treatment.stock_quantity}: ${treatment.unit})`
                            : "Out of Stock"}
                        </span>
                      </div>

                      {/* Active Ingredient & Target Problems */}
                      <p className={styles.treatmentIngredient}>
                        <strong>Active Ingredient:</strong>{" "}
                        {treatment.active_ingredient}
                      </p>

                      {treatment.target_problems && (
                        <p className={styles.targetProblems}>
                          <strong>Target Problems:</strong>{" "}
                          {treatment.target_problems}
                        </p>
                      )}

                      <p className={styles.treatmentDesc}>
                        {treatment.description}
                      </p>

                      {/* AgroDealer Contact & Location Info */}
                      <div className={styles.dealerBox}>
                        <span className={styles.dealerName}>
                          {treatment.business_name}
                        </span>

                        <div className={styles.dealerDetailRow}>
                          <MapPinIcon className={styles.dealerIcon} />
                          <span>
                            {treatment.business_address}, {treatment.lga},{" "}
                            {treatment.state}
                          </span>
                        </div>

                        <div className={styles.dealerDetailRow}>
                          <PhoneIcon className={styles.dealerIcon} />
                          <a
                            href={`tel:${treatment.phone_number}`}
                            className={styles.dealerPhoneLink}
                          >
                            {treatment.phone_number}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : diagnosisResult.diagnosis.disease ? (
            /* Render Empty State ONLY when crop is diseased AND no agrodealer treatments are available */
            <div className={styles.emptyTreatmentCard}>
              <p className={styles.emptyTreatmentText}>
                No recommended treatments currently available from nearby
                AgroDealers.
              </p>
              <span className={styles.emptyTreatmentSubtext}>
                Check back later, or contact nearby farmers or input suppliers
                for recommended alternatives.
              </span>
            </div>
          ) : null}
        </section>
      )}
    </>
  );
}
