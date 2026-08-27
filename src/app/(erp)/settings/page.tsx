"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Factory,
  Boxes,
  DollarSign,
  Bell,
  Save,
  RefreshCw,
  CheckCircle2,
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

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<SettingsData>(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

          daily_production_target:
            String(
              data.daily_production_target ??
                DEFAULT_SETTINGS.daily_production_target
            ),

          morning_shift_target:
            String(
              data.morning_shift_target ??
                DEFAULT_SETTINGS.morning_shift_target
            ),

          night_shift_target:
            String(
              data.night_shift_target ??
                DEFAULT_SETTINGS.night_shift_target
            ),

          flour_low_stock:
            String(
              data.flour_low_stock ??
                DEFAULT_SETTINGS.flour_low_stock
            ),

          sugar_low_stock:
            String(
              data.sugar_low_stock ??
                DEFAULT_SETTINGS.sugar_low_stock
            ),

          yeast_low_stock:
            String(
              data.yeast_low_stock ??
                DEFAULT_SETTINGS.yeast_low_stock
            ),

          butter_low_stock:
            String(
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
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings() {
    setSaving(true);
    setSaved(false);

    try {
      const { data: existing } = await supabase
        .from("settings")
        .select("id")
        .limit(1)
        .maybeSingle();

      let error;

      if (existing?.id) {
        const result = await supabase
          .from("settings")
          .update({
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
          })
          .eq("id", existing.id);

        error = result.error;
      } else {
        const result = await supabase
          .from("settings")
          .insert({
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
          });

        error = result.error;
      }

      if (error) {
        throw error;
      }

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <RefreshCw
            size={24}
            className="animate-spin"
          />
          <span className="text-lg font-semibold">
            Loading system settings...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 lg:p-10 text-white">

      {/* HEADER */}
      <div className="rounded-[32px] overflow-hidden border border-white/10 shadow-2xl mb-8">

        <div className="bg-gradient-to-r from-[#071426] via-[#0B1F3A] to-[#102B52] p-8 lg:p-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div>

              <span className="inline-flex items-center rounded-full bg-blue-500/20 border border-blue-400/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                ERP Configuration
              </span>

              <h1 className="text-4xl lg:text-5xl font-black mt-4">
                System Settings
              </h1>

              <p className="text-slate-300 text-lg mt-3 max-w-3xl">
                Configure the operational settings that control
                your NKIRUKA bakery ERP.
              </p>

            </div>

            <button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 px-7 py-4 font-black shadow-xl transition"
            >
              {saving ? (
                <>
                  <RefreshCw
                    size={20}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Settings
                </>
              )}
            </button>

          </div>

          {saved && (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-emerald-300 font-semibold">
              <CheckCircle2 size={20} />
              Settings saved successfully.
            </div>
          )}

        </div>

      </div>


      {/* COMPANY PROFILE */}
      <section className="bg-[#0D1728] border border-white/10 rounded-[30px] shadow-2xl p-7 lg:p-8 mb-7">

        <SectionHeader
          icon={<Building2 size={25} />}
          title="Company Profile"
          description="Basic information used throughout the ERP."
        />

        <div className="grid lg:grid-cols-2 gap-6 mt-7">

          <InputField
            label="Company Name"
            value={settings.company_name}
            onChange={(value) =>
              updateSetting("company_name", value)
            }
          />

          <InputField
            label="Company Phone"
            value={settings.company_phone}
            onChange={(value) =>
              updateSetting("company_phone", value)
            }
          />

          <InputField
            label="Company Email"
            value={settings.company_email}
            onChange={(value) =>
              updateSetting("company_email", value)
            }
            type="email"
          />

          <InputField
            label="Company Address"
            value={settings.company_address}
            onChange={(value) =>
              updateSetting("company_address", value)
            }
          />

        </div>

      </section>


      {/* PRODUCTION */}
      <section className="bg-[#0D1728] border border-white/10 rounded-[30px] shadow-2xl p-7 lg:p-8 mb-7">

        <SectionHeader
          icon={<Factory size={25} />}
          title="Production Settings"
          description="Configure daily production targets and shift targets."
        />

        <div className="grid md:grid-cols-3 gap-6 mt-7">

          <NumberField
            label="Daily Production Target"
            value={settings.daily_production_target}
            onChange={(value) =>
              updateSetting(
                "daily_production_target",
                value
              )
            }
            suffix="bags"
          />

          <NumberField
            label="Morning Shift Target"
            value={settings.morning_shift_target}
            onChange={(value) =>
              updateSetting(
                "morning_shift_target",
                value
              )
            }
            suffix="bags"
          />

          <NumberField
            label="Night Shift Target"
            value={settings.night_shift_target}
            onChange={(value) =>
              updateSetting(
                "night_shift_target",
                value
              )
            }
            suffix="bags"
          />

        </div>

        <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-5">

          <p className="text-blue-300 font-semibold">
            Production target
          </p>

          <p className="text-slate-400 text-sm mt-1">
            These values are configuration targets. Actual
            production remains based on the production records
            entered by your production team.
          </p>

        </div>

      </section>


      {/* INVENTORY */}
      <section className="bg-[#0D1728] border border-white/10 rounded-[30px] shadow-2xl p-7 lg:p-8 mb-7">

        <SectionHeader
          icon={<Boxes size={25} />}
          title="Inventory Settings"
          description="Set the minimum stock levels that should trigger low-stock warnings."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-7">

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
            suffix="bags"
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
          />

        </div>

      </section>


      {/* FINANCE */}
      <section className="bg-[#0D1728] border border-white/10 rounded-[30px] shadow-2xl p-7 lg:p-8 mb-7">

        <SectionHeader
          icon={<DollarSign size={25} />}
          title="Finance Settings"
          description="Configure the basic financial preferences used by the ERP."
        />

        <div className="grid md:grid-cols-2 gap-6 mt-7">

          <SelectField
            label="Currency"
            value={settings.currency}
            onChange={(value) =>
              updateSetting("currency", value)
            }
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
            value={settings.default_payment_method}
            onChange={(value) =>
              updateSetting(
                "default_payment_method",
                value
              )
            }
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

      </section>


      {/* NOTIFICATIONS */}
      <section className="bg-[#0D1728] border border-white/10 rounded-[30px] shadow-2xl p-7 lg:p-8 mb-7">

        <SectionHeader
          icon={<Bell size={25} />}
          title="Notifications"
          description="Control operational alerts generated by the ERP."
        />

        <div className="grid md:grid-cols-2 gap-5 mt-7">

          <ToggleSetting
            title="Low Stock Alerts"
            description="Show warnings when inventory falls below configured limits."
            checked={settings.low_stock_alerts}
            onChange={(value) =>
              updateSetting(
                "low_stock_alerts",
                value
              )
            }
          />

          <ToggleSetting
            title="Email Notifications"
            description="Enable email notification preferences."
            checked={settings.email_notifications}
            onChange={(value) =>
              updateSetting(
                "email_notifications",
                value
              )
            }
          />

        </div>

      </section>


      {/* SAVE FOOTER */}
      <div className="flex justify-end">

        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center gap-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 px-8 py-4 font-black shadow-xl transition"
        >
          {saving ? (
            <>
              <RefreshCw
                size={20}
                className="animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Save size={20} />
              Save All Settings
            </>
          )}
        </button>

      </div>

    </div>
  );
}


/* =====================================================
   SECTION HEADER
===================================================== */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">

      <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-400/20 flex items-center justify-center text-blue-300">
        {icon}
      </div>

      <div>

        <h2 className="text-2xl font-black text-white">
          {title}
        </h2>

        <p className="text-slate-400 mt-1">
          {description}
        </p>

      </div>

    </div>
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>

      <label className="block text-sm font-bold text-slate-300 mb-2">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-2xl border border-white/10 bg-[#162844] px-5 py-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix: string;
}) {
  return (
    <div>

      <label className="block text-sm font-bold text-slate-300 mb-2">
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
          className="w-full rounded-2xl border border-white/10 bg-[#162844] px-5 py-4 pr-20 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />

        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-semibold">
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    label: string;
    value: string;
  }[];
}) {
  return (
    <div>

      <label className="block text-sm font-bold text-slate-300 mb-2">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-2xl border border-white/10 bg-[#162844] px-5 py-4 text-white outline-none focus:border-blue-500"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

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
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-[#162844] p-5 cursor-pointer hover:border-blue-400/30 transition">

      <div>

        <p className="font-bold text-white">
          {title}
        </p>

        <p className="text-sm text-slate-400 mt-1">
          {description}
        </p>

      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(e.target.checked)
        }
        className="w-6 h-6 accent-blue-600 shrink-0"
      />

    </label>
  );
}

