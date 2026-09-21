import { redirect } from "next/navigation";
import { ModulesPage } from "@/components/dashboard/modules-page";
import { isModuleKey } from "@/lib/modules";

export default async function Page({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;

  if (!isModuleKey(key)) {
    redirect("/modules");
  }

  return <ModulesPage initialKey={key} />;
}
