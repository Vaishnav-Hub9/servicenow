import { Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Overview } from "@/pages/Overview";
import { Analyze } from "@/pages/Analyze";
import { Students } from "@/pages/Students";
import { StudentProfile } from "@/pages/StudentProfile";
import { CheckIn } from "@/pages/CheckIn";
import { EarlySignals } from "@/pages/EarlySignals";
import { SupportActions } from "@/pages/SupportActions";
import { Insights } from "@/pages/Insights";
import { Settings } from "@/pages/Settings";
import { Privacy } from "@/pages/Privacy";
import { NotFound } from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Overview />} />
        <Route path="students" element={<Students />} />
        <Route path="analyze" element={<Analyze />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="students/:id/check-in" element={<CheckIn />} />
        <Route path="signals" element={<EarlySignals />} />
        <Route path="support" element={<SupportActions />} />
        <Route path="insights" element={<Insights />} />
        <Route path="settings" element={<Settings />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
