import { prisma } from "@/lib/prisma";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settingsList = await prisma.storeSetting.findMany();
  const settingsMap: Record<string, string> = {};
  settingsList.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Store Settings
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Configure optional taxes, shipping fee rules, payment options, and customer support channels.
        </p>
      </div>

      <SettingsForm initialSettings={settingsMap} />
    </div>
  );
}
