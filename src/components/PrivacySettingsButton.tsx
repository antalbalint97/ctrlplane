"use client";

export default function PrivacySettingsButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event("open-analytics-settings"))} style={{ padding: "12px 18px", minHeight: 44, border: "1px solid currentColor", borderRadius: 8, background: "transparent", font: "inherit", cursor: "pointer" }}>Süti beállítások megnyitása</button>;
}
