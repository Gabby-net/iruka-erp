"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Factory,
  Boxes,
  WalletCards,
  Bell,
  Save,
  RefreshCw,
  CheckCircle2,
  Settings2,
  ShieldCheck,
  ChevronRight,
  Info,
  Phone,
  Mail,
  MapPin,
  Package,
  CreditCard,
  Calculator,
  AlertTriangle,
  Database,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type SettingsData = {
  company_name: string;
  company_address: string;
  company_phone: string;
  company_email: string;

  daily_production_target: string;
  morning_shift_target: string;
  night_shift_target: string;

  flour_low_stock: string;
  sugar_low_stock: string;
  yeast_low_stock: string;
  butter_low_stock: string;

  currency: string;
  default_payment_method: string;

  low_stock_alerts: boolean;
  email_notifications: boolean;
};

const DEFAULT_SETTINGS: SettingsData = {
  company_name: "NKIRUKA INDUSTRIES LTD",
  company_address: "",
  company_phone: "",
  company_email: "",

  daily_production_target: "200",
  morning_shift_target: "100",
  night_shift_target: "100",

  flour_low_stock: "400",
  sugar_low_stock: "50",
  yeast_low_stock: "10",
  butter_low_stock: "10",

  currency: "NGN",
  default_payment_method: "Cash",

  low_stock_alerts: true,
  email_notifications: false,
};

const NAV_ITEMS = [
  {
    id: "general",
    label: "General",
    description: "Company information",
    icon: Building2,
  },
  {
    id: "production",
    label: "Production",
    description: "Production targets",
    icon: Factory,
  },
  {
    id: "inventory",
    label: "Inventory",
    description: "Stock thresholds",
    icon: Boxes,
  },
  {
    id: "finance",
    label: "Finance",
    description: "Financial preferences",
    icon: WalletCards,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "System alerts",
    icon: Bell,
  },
];

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<SettingsData>(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [activeSection, setActiveSection] =
    useState("general");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Settings load error:", error);
        return;
      }

      if (data) {
        setSettings({
          company_name:
            data.company_name ??
            DEFAULT_SETTINGS.company_name,

          company_address:
            data.company_address ??
            DEFAULT_SETTINGS.company_address,

          company_phone:
            data.company_phone ??
            DEFAULT_SETTINGS.company_phone,

          company_email:
            data.company_email ??
            DEFAULT_SETTINGS.company_email,

          daily_production_target: String(
            data.daily_production_target ??
              DEFAULT_SETTINGS.daily_production_target
          ),

          morning_shift_target: String(
            data.morning_shift_target ??
              DEFAULT_SETTINGS.morning_shift_target
          ),

          night_shift_target: String(
            data.night_shift_target ??
              DEFAULT_SETTINGS.night_shift_target
          ),

          flour_low_stock: String(
            data.flour_low_stock ??
              DEFAULT_SETTINGS.flour_low_stock
          ),

          sugar_low_stock: String(
            data.sugar_low_stock ??
              DEFAULT_SETTINGS.sugar_low_stock
          ),

          yeast_low_stock: String(
            data.yeast_low_stock ??
              DEFAULT_SETTINGS.yeast_low_stock
          ),

          butter_low_stock: String(
            data.butter_low_stock ??
              DEFAULT_SETTINGS.butter_low_stock
          ),

          currency:
            data.currency ??
            DEFAULT_SETTINGS.currency,

          default_payment_method:
            data.default_payment_method ??
            DEFAULT_SETTINGS.default_payment_method,

          low_stock_alerts:
            data.low_stock_alerts ??
            DEFAULT_SETTINGS.low_stock_alerts,

          email_notifications:
            data.email_notifications ??
            DEFAULT_SETTINGS.email_notifications,
        });
      }
    } catch (error) {
      console.error("Settings load error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    setSaved(false);

    try {
      const payload = {
        company_name: settings.company_name,
        company_address: settings.company_address,
        company_phone: settings.company_phone,
        company_email: settings.company_email,

        daily_production_target:
          Number(settings.daily_production_target) || 0,

        morning_shift_target:
          Number(settings.morning_shift_target) || 0,

        night_shift_target:
          Number(settings.night_shift_target) || 0,

        flour_low_stock:
          Number(settings.flour_low_stock) || 0,

        sugar_low_stock:
          Number(settings.sugar_low_stock) || 0,

        yeast_low_stock:
          Number(settings.yeast_low_stock) || 0,

        butter_low_stock:
          Number(settings.butter_low_stock) || 0,

        currency: settings.currency,

        default_payment_method:
          settings.default_payment_method,

        low_stock_alerts:
          settings.low_stock_alerts,

        email_notifications:
          settings.email_notifications,
      };

      const { data: existing, error: existingError } =
        await supabase
          .from("settings")
          .select("id")
          .limit(1)
          .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      let error;

      if (existing?.id) {
        const result = await supabase
          .from("settings")
          .update(payload)
          .eq("id", existing.id);

        error = result.error;
      } else {
        const result = await supabase
          .from("settings")
          .insert(payload);

        error = result.error;
      }

      if (error) {
        throw error;
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3500);
    } catch (error: any) {
      console.error("Settings save error:", error);

      alert(
        error?.message ||
          "Unable to save system settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function updateSetting(
    key: keyof SettingsData,
    value: string | boolean
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050B14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">
            <RefreshCw
              size={25}
              className="text-blue-400 animate-spin"
            />
          </div>

          <div className="text-center">
            <p className="text-white font-bold">
              Loading Settings
            </p>

            <p className="text-slate-500 text-sm mt-1">
              Preparing your ERP configuration...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050B14] text-white">

      {/* TOP HEADER */}
      <div className="border-b border-white/[0.06] bg-[#07101D]/90 backdrop-blur-xl sticky top-0 z-40">

        <div className="px-5 lg:px-8 py-5">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center">
                <Settings2
                  size={23}
                  className="text-blue-400"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">

                  <h1 className="text-xl lg:text-2xl font-black tracking-tight">
                    System Settings
                  </h1>

                  <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    System Active
                  </span>

                </div>

                <p className="text-slate-500 text-sm mt-1">
                  Configure your NKIRUKA ERP environment
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={loadSettings}
                disabled={saving}
                className="h-11 px-4 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:text-white transition flex items-center gap-2 text-sm font-semibold"
              >
                <RefreshCw size={16} />
                <span className="hidden sm:inline">
                  Reload
                </span>
              </button>

              <button
                onClick={saveSettings}
                disabled={saving}
                className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 shadow-lg shadow-blue-900/20 transition flex items-center gap-2 text-sm font-bold"
              >
                {saving ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>

            </div>

          </div>

          {saved && (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3">
              <CheckCircle2
                size={18}
                className="text-emerald-400"
              />

              <div>
                <p className="text-sm font-bold text-emerald-300">
                  Settings saved successfully
                </p>

                <p className="text-xs text-emerald-400/60">
                  Your ERP configuration has been updated.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>


      {/* MAIN CONTENT */}
      <div className="max-w-[1500px] mx-auto p-5 lg:p-8">

        <div className="grid lg:grid-cols-[250px_1fr] gap-7">

          {/* SIDEBAR */}
          <aside className="lg:sticky lg:top-[105px] lg:self-start">

            <div className="rounded-2xl border border-white/[0.07] bg-[#091321] p-2">

              <div className="px-3 py-3 mb-1">

                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-600">
                  Configuration
                </p>

              </div>

              <div className="space-y-1">

                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active =
                    activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() =>
                        setActiveSection(item.id)
                      }
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition group ${
                        active
                          ? "bg-blue-500/10 border border-blue-400/10"
                          : "hover:bg-white/[0.03] border border-transparent"
                      }`}
                    >

                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                          active
                            ? "bg-blue-500/15 text-blue-400"
                            : "bg-white/[0.03] text-slate-500 group-hover:text-slate-300"
                        }`}
                      >
                        <Icon size={17} />
                      </div>

                      <div className="flex-1 min-w-0">

                        <p
                          className={`text-sm font-bold ${
                            active
                              ? "text-white"
                              : "text-slate-400 group-hover:text-white"
                          }`}
                        >
                          {item.label}
                        </p>

                        <p className="text-[11px] text-slate-600 mt-0.5 truncate">
                          {item.description}
                        </p>

                      </div>

                      {active && (
                        <ChevronRight
                          size={15}
                          className="text-blue-400"
                        />
                      )}

                    </button>
                  );
                })}

              </div>

            </div>


            {/* SYSTEM STATUS */}
            <div className="mt-4 rounded-2xl border border-white/[0.07] bg-[#091321] p-4">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <ShieldCheck
                    size={17}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-xs font-bold text-white">
                    ERP Configuration
                  </p>

                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Connected to Supabase
                  </p>
                </div>

              </div>

              <div className="mt-4 h-px bg-white/[0.05]" />

              <div className="flex items-center justify-between mt-3">

                <span className="text-[11px] text-slate-500">
                  Database
                </span>

                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Connected
                </span>

              </div>

            </div>

          </aside>


          {/* SETTINGS AREA */}
          <main className="space-y-6">

            {/* GENERAL */}
            {activeSection === "general" && (
              <SettingsSection
                icon={<Building2 size={21} />}
                eyebrow="GENERAL CONFIGURATION"
                title="Company Profile"
                description="Manage the identity and contact information displayed across your ERP."
              >

                <div className="grid md:grid-cols-2 gap-5">

                  <InputField
                    label="Company Name"
                    value={settings.company_name}
                    onChange={(value) =>
                      updateSetting(
                        "company_name",
                        value
                      )
                    }
                    icon={<Building2 size={16} />}
                  />

                  <InputField
                    label="Company Phone"
                    value={settings.company_phone}
                    onChange={(value) =>
                      updateSetting(
                        "company_phone",
                        value
                      )
                    }
                    icon={<Phone size={16} />}
                  />

                  <InputField
                    label="Company Email"
                    value={settings.company_email}
                    onChange={(value) =>
                      updateSetting(
                        "company_email",
                        value
                      )
                    }
                    type="email"
                    icon={<Mail size={16} />}
                  />

                  <InputField
                    label="Company Address"
                    value={settings.company_address}
                    onChange={(value) =>
                      updateSetting(
                        "company_address",
                        value
                      )
                    }
                    icon={<MapPin size={16} />}
                  />

                </div>


                <InfoBox
                  icon={<Database size={17} />}
                  title="Company identity"
                  text="These details can be used by other ERP modules for company headers, reports, invoices and financial documents."
                />

              </SettingsSection>
            )}


            {/* PRODUCTION */}
            {activeSection === "production" && (
              <SettingsSection
                icon={<Factory size={21} />}
                eyebrow="OPERATIONS"
                title="Production Configuration"
                description="Define the bakery's expected daily production capacity and shift targets."
              >

                <div className="grid md:grid-cols-3 gap-5">

                  <NumberField
                    label="Daily Production Target"
                    value={
                      settings.daily_production_target
                    }
                    onChange={(value) =>
                      updateSetting(
                        "daily_production_target",
                        value
                      )
                    }
                    suffix="bags"
                    icon={<Factory size={16} />}
                  />

                  <NumberField
                    label="Morning Shift Target"
                    value={
                      settings.morning_shift_target
                    }
                    onChange={(value) =>
                      updateSetting(
                        "morning_shift_target",
                        value
                      )
                    }
                    suffix="bags"
                    icon={<Factory size={16} />}
                  />

                  <NumberField
                    label="Night Shift Target"
                    value={
                      settings.night_shift_target
                    }
                    onChange={(value) =>
                      updateSetting(
                        "night_shift_target",
                        value
                      )
                    }
                    suffix="bags"
                    icon={<Factory size={16} />}
                  />

                </div>


                <div className="mt-6 grid md:grid-cols-2 gap-4">

                  <MetricCard
                    label="Morning + Night"
                    value={`${Number(
                      settings.morning_shift_target || 0
                    ) + Number(
                      settings.night_shift_target || 0
                    )} bags`}
                    description="Combined shift target"
                  />

                  <MetricCard
                    label="Target Per Shift"
                    value={`${Number(
                      settings.daily_production_target || 0
                    ) / 2 || 0} bags`}
                    description="Based on a two-shift operation"
                  />

                </div>


                <InfoBox
                  icon={<Info size={17} />}
                  title="Targets do not replace production records"
                  text="These figures define expected production levels. Actual production, flour consumption and stock movement should continue to come from production records."
                />

              </SettingsSection>
            )}


            {/* INVENTORY */}
            {activeSection === "inventory" && (
              <SettingsSection
                icon={<Boxes size={21} />}
                eyebrow="STOCK CONTROL"
                title="Inventory Configuration"
                description="Define the minimum stock levels used to trigger inventory warnings."
              >

                <div className="grid md:grid-cols-2 gap-5">

                  <NumberField
                    label="Flour"
                    value={settings.flour_low_stock}
                    onChange={(value) =>
                      updateSetting(
                        "flour_low_stock",
                        value
                      )
                    }
                    suffix="bags"
                    icon={<Package size={16} />}
                  />

                  <NumberField
                    label="Sugar"
                    value={settings.sugar_low_stock}
                    onChange={(value) =>
                      updateSetting(
                        "sugar_low_stock",
                        value
                      )
                    }
                    suffix="kg"
                    icon={<Package size={16} />}
                  />

                  <NumberField
                    label="Yeast"
                    value={settings.yeast_low_stock}
                    onChange={(value) =>
                      updateSetting(
                        "yeast_low_stock",
                        value
                      )
                    }
                    suffix="units"
                    icon={<Package size={16} />}
                  />

                  <NumberField
                    label="Butter"
                    value={settings.butter_low_stock}
                    onChange={(value) =>
                      updateSetting(
                        "butter_low_stock",
                        value
                      )
                    }
                    suffix="units"
                    icon={<Package size={16} />}
                  />

                </div>


                <div className="mt-6 rounded-2xl border border-amber-400/10 bg-amber-400/[0.04] p-5">

                  <div className="flex gap-3">

                    <div className="w-9 h-9 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0">
                      <AlertTriangle
                        size={17}
                        className="text-amber-400"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-amber-300">
                        Low-stock thresholds
                      </p>

                      <p className="text-xs text-slate-500 mt-1 leading-5">
                        When inventory falls below these
                        configured values, the ERP can flag
                        the material as requiring attention.
                      </p>
                    </div>

                  </div>

                </div>

              </SettingsSection>
            )}


            {/* FINANCE */}
            {activeSection === "finance" && (
              <SettingsSection
                icon={<WalletCards size={21} />}
                eyebrow="FINANCIAL CONTROL"
                title="Finance Configuration"
                description="Set the financial preferences used across sales, payments and reports."
              >

                <div className="grid md:grid-cols-2 gap-5">

                  <SelectField
                    label="System Currency"
                    value={settings.currency}
                    onChange={(value) =>
                      updateSetting(
                        "currency",
                        value
                      )
                    }
                    icon={<Calculator size={16} />}
                    options={[
                      {
                        label: "Nigerian Naira (₦)",
                        value: "NGN",
                      },
                      {
                        label: "US Dollar ($)",
                        value: "USD",
                      },
                      {
                        label: "British Pound (£)",
                        value: "GBP",
                      },
                    ]}
                  />

                  <SelectField
                    label="Default Payment Method"
                    value={
                      settings.default_payment_method
                    }
                    onChange={(value) =>
                      updateSetting(
                        "default_payment_method",
                        value
                      )
                    }
                    icon={<CreditCard size={16} />}
                    options={[
                      {
                        label: "Cash",
                        value: "Cash",
                      },
                      {
                        label: "Bank Transfer",
                        value: "Bank Transfer",
                      },
                      {
                        label: "POS",
                        value: "POS",
                      },
                      {
                        label: "Online Payment",
                        value: "Online Payment",
                      },
                    ]}
                  />

                </div>


                <div className="mt-6 grid md:grid-cols-2 gap-4">

                  <MetricCard
                    label="Active Currency"
                    value={
                      settings.currency === "NGN"
                        ? "₦ NGN"
                        : settings.currency
                    }
                    description="Used as the system financial currency"
                  />

                  <MetricCard
                    label="Default Payment"
                    value={
                      settings.default_payment_method
                    }
                    description="Default option for new transactions"
                  />

                </div>


                <InfoBox
                  icon={<WalletCards size={17} />}
                  title="Finance preference"
                  text="Changing these values affects configuration preferences. Existing historical transactions should retain their original financial records."
                />

              </SettingsSection>
            )}


            {/* NOTIFICATIONS */}
            {activeSection === "notifications" && (
              <SettingsSection
                icon={<Bell size={21} />}
                eyebrow="SYSTEM ALERTS"
                title="Notification Settings"
                description="Control which operational alerts are enabled for your ERP."
              >

                <div className="space-y-3">

                  <ToggleSetting
                    title="Low Stock Alerts"
                    description="Notify the ERP when inventory materials fall below configured minimum levels."
                    checked={
                      settings.low_stock_alerts
                    }
                    onChange={(value) =>
                      updateSetting(
                        "low_stock_alerts",
                        value
                      )
                    }
                    icon={
                      <Boxes size={18} />
                    }
                  />

                  <ToggleSetting
                    title="Email Notifications"
                    description="Enable email notification preferences for supported ERP events."
                    checked={
                      settings.email_notifications
                    }
                    onChange={(value) =>
                      updateSetting(
                        "email_notifications",
                        value
                      )
                    }
                    icon={
                      <Mail size={18} />
                    }
                  />

                </div>


                <div className="mt-6 rounded-2xl border border-blue-400/10 bg-blue-500/[0.04] p-5">

                  <div className="flex gap-3">

                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Bell
                        size={17}
                        className="text-blue-400"
                      />
                    </div>

                    <div>

                      <p className="text-sm font-bold text-blue-300">
                        Notification preferences
                      </p>

                      <p className="text-xs text-slate-500 mt-1 leading-5">
                        These settings control notification
                        preferences. Actual email delivery
                        requires a configured notification
                        service.
                      </p>

                    </div>

                  </div>

                </div>

              </SettingsSection>
            )}


            {/* BOTTOM SAVE */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-[#091321] p-5">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <ShieldCheck
                    size={18}
                    className="text-blue-400"
                  />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    Configuration ready
                  </p>

                  <p className="text-xs text-slate-600 mt-0.5">
                    Review your changes before saving.
                  </p>
                </div>

              </div>

              <button
                onClick={saveSettings}
                disabled={saving}
                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 transition flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-blue-900/20"
              >
                {saving ? (
                  <>
                    <RefreshCw
                      size={16}
                      className="animate-spin"
                    />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save All Settings
                  </>
                )}
              </button>

            </div>

          </main>

        </div>

      </div>
    </div>
  );
}


/* =====================================================
   SETTINGS SECTION
===================================================== */

function SettingsSection({
  icon,
  eyebrow,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-[#091321] overflow-hidden">

      <div className="p-6 lg:p-7 border-b border-white/[0.06]">

        <div className="flex items-start gap-4">

          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-400/10 flex items-center justify-center text-blue-400 shrink-0">
            {icon}
          </div>

          <div>

            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-400/70">
              {eyebrow}
            </p>

            <h2 className="text-xl lg:text-2xl font-black text-white mt-1">
              {title}
            </h2>

            <p className="text-sm text-slate-500 mt-1.5 max-w-2xl leading-6">
              {description}
            </p>

          </div>

        </div>

      </div>

      <div className="p-6 lg:p-7">
        {children}
      </div>

    </section>
  );
}


/* =====================================================
   INPUT FIELD
===================================================== */

function InputField({
  label,
  value,
  onChange,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>

      <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
        {icon && (
          <span className="text-slate-600">
            {icon}
          </span>
        )}
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full h-12 rounded-xl border border-white/[0.08] bg-[#0E1A2B] px-4 text-sm text-white placeholder:text-slate-700 outline-none transition focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/[0.06] hover:border-white/[0.12]"
      />

    </div>
  );
}


/* =====================================================
   NUMBER FIELD
===================================================== */

function NumberField({
  label,
  value,
  onChange,
  suffix,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>

      <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
        {icon && (
          <span className="text-slate-600">
            {icon}
          </span>
        )}
        {label}
      </label>

      <div className="relative">

        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full h-12 rounded-xl border border-white/[0.08] bg-[#0E1A2B] px-4 pr-16 text-sm text-white outline-none transition focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/[0.06] hover:border-white/[0.12]"
        />

        <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-white/[0.04] border border-white/[0.05] px-2 py-1 text-[10px] font-bold text-slate-500">
          {suffix}
        </span>

      </div>

    </div>
  );
}


/* =====================================================
   SELECT FIELD
===================================================== */

function SelectField({
  label,
  value,
  onChange,
  options,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    label: string;
    value: string;
  }[];
  icon?: React.ReactNode;
}) {
  return (
    <div>

      <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2">
        {icon && (
          <span className="text-slate-600">
            {icon}
          </span>
        )}
        {label}
      </label>

      <div className="relative">

        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="appearance-none w-full h-12 rounded-xl border border-white/[0.08] bg-[#0E1A2B] px-4 pr-10 text-sm text-white outline-none transition focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/[0.06] hover:border-white/[0.12]"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-[#0E1A2B]"
            >
              {option.label}
            </option>
          ))}
        </select>

        <ChevronRight
          size={15}
          className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-600 pointer-events-none"
        />

      </div>

    </div>
  );
}


/* =====================================================
   TOGGLE
===================================================== */

function ToggleSetting({
  title,
  description,
  checked,
  onChange,
  icon,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <label
      className={`flex items-center justify-between gap-5 rounded-2xl border p-5 cursor-pointer transition ${
        checked
          ? "border-blue-400/15 bg-blue-500/[0.04]"
          : "border-white/[0.06] bg-[#0E1A2B] hover:border-white/[0.1]"
      }`}
    >

      <div className="flex items-center gap-4">

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            checked
              ? "bg-blue-500/10 text-blue-400"
              : "bg-white/[0.03] text-slate-600"
          }`}
        >
          {icon}
        </div>

        <div>

          <p className="text-sm font-bold text-white">
            {title}
          </p>

          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-5">
            {description}
          </p>

        </div>

      </div>


      <div className="relative shrink-0">

        <input
          type="checkbox"
          checked={checked}
          onChange={(e) =>
            onChange(e.target.checked)
          }
          className="sr-only"
        />

        <div
          className={`w-12 h-6 rounded-full transition ${
            checked
              ? "bg-blue-600"
              : "bg-slate-700"
          }`}
        >

          <div
            className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all ${
              checked
                ? "left-7"
                : "left-1"
            }`}
          />

        </div>

      </div>

    </label>
  );
}


/* =====================================================
   INFO BOX
===================================================== */

function InfoBox({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="mt-6 flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">

      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div>

        <p className="text-xs font-bold text-slate-300">
          {title}
        </p>

        <p className="text-xs text-slate-600 mt-1 leading-5">
          {text}
        </p>

      </div>

    </div>
  );
}


/* =====================================================
   METRIC CARD
===================================================== */

function MetricCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0E1A2B] p-4">

      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-600">
        {label}
      </p>

      <p className="text-lg font-black text-white mt-1">
        {value}
      </p>

      <p className="text-[11px] text-slate-600 mt-1">
        {description}
      </p>

    </div>
  );
}