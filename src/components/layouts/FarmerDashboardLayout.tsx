import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  PlantIcon,
  CameraIcon,
  WalletIcon,
  ReceiptIcon,
  SettingsIcon,
} from "../Icons";
import styles from "./FarmerDashboardLayout.module.css";
import { APP_ROUTES } from "../../routes";
import { useState } from "react";
import { DismissButton, LogoutButton, TopUpButton } from "./LayoutControls";

function getNavLinkClass(baseClass: string, activeClass: string) {
  return ({ isActive }: { isActive: boolean }) =>
    `${baseClass} ${isActive ? activeClass : ""}`;
}

export function FarmerDashboardLayout() {
  const location = useLocation();

  // Extract initial success message from navigation state
  const [successMsg, setSuccessMsg] = useState<string | null>(
    location.state?.successMessage || null,
  );

  // For immediate visual feedback while testing only. KEEP DISABLED!
  // useEffect(() => {
  //   setSuccessMsg("Farmer registration successful!");
  // });

  return (
    <div className={styles.shell}>
      {/* Desktop Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <NavLink
            to={APP_ROUTES.FARMER_DASHBOARD.DIAGNOSIS}
            end
            className={getNavLinkClass(styles.navLink, styles.activeNavLink)}
          >
            <CameraIcon />
            <span>Crop Diagnosis</span>
          </NavLink>

          <NavLink
            to={APP_ROUTES.FARMER_DASHBOARD.WALLET}
            className={getNavLinkClass(styles.navLink, styles.activeNavLink)}
          >
            <WalletIcon />
            <span>Wallet & Topup</span>
          </NavLink>

          <NavLink
            to={APP_ROUTES.FARMER_DASHBOARD.TRANSACTIONS}
            className={getNavLinkClass(styles.navLink, styles.activeNavLink)}
          >
            <ReceiptIcon />
            <span>Transaction History</span>
          </NavLink>

          <NavLink
            to={APP_ROUTES.FARMER_DASHBOARD.PROFILE}
            className={getNavLinkClass(styles.navLink, styles.activeNavLink)}
          >
            <SettingsIcon />
            <span>Profile Settings</span>
          </NavLink>

          {/* Desktop Logout in Sidebar */}
          {/* Wrapper pushes the button to the bottom */}
          <div className={styles.logoutWrapper}>
            <LogoutButton />
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={styles.mainContainer}>
        <header className={styles.topHeader}>
          {/* Brand Logo with Plant Icon */}
          <div className={styles.brandContainer}>
            <PlantIcon className={styles.brandIcon} />
            <span className={styles.brandText}>FarmXnap</span>
          </div>

          <div className={styles.walletBadge}>
            <WalletIcon className={styles.walletIcon} />
            {/* TODO: Update the wallet balance text */}
            <span>₦12,450.00</span>
            {/* Header Top Up */}
            <TopUpButton to={APP_ROUTES.FARMER_DASHBOARD.WALLET} />
          </div>
        </header>

        {/* Global Registration Success Banner & Dismiss*/}
        {successMsg && (
          <div className={styles.successBanner}>
            <span>{successMsg}</span>
            <DismissButton onDismiss={() => setSuccessMsg(null)} />
          </div>
        )}

        {/* Child pages render here */}
        <main className={styles.contentArea}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <NavLink
          to={APP_ROUTES.FARMER_DASHBOARD.DIAGNOSIS}
          end
          className={getNavLinkClass(
            styles.bottomNavLink,
            styles.activeBottomNavLink,
          )}
        >
          <CameraIcon />
          <span>Diagnosis</span>
        </NavLink>

        <NavLink
          to={APP_ROUTES.FARMER_DASHBOARD.WALLET}
          className={getNavLinkClass(
            styles.bottomNavLink,
            styles.activeBottomNavLink,
          )}
        >
          <WalletIcon />
          <span>Wallet</span>
        </NavLink>

        <NavLink
          to={APP_ROUTES.FARMER_DASHBOARD.TRANSACTIONS}
          className={getNavLinkClass(
            styles.bottomNavLink,
            styles.activeBottomNavLink,
          )}
        >
          <ReceiptIcon />
          <span>Transactions</span>
        </NavLink>

        <NavLink
          to={APP_ROUTES.FARMER_DASHBOARD.PROFILE}
          className={getNavLinkClass(
            styles.bottomNavLink,
            styles.activeBottomNavLink,
          )}
        >
          <SettingsIcon />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}
