import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/settings")({
  component: () => (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-black mb-4">إعدادات الموقع</h1>
      <p className="text-muted-foreground">هذه الصفحة قيد التطوير حالياً.</p>
    </div>
  ),
});
