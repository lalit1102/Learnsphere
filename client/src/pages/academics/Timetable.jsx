import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext"; // Note: Context used in this project
import GeneratorControls from "@/components/timetable/GeneratorControls";
import TimetableGrid from "@/components/timetable/TimetableGrid";
import { CalendarDays } from "lucide-react";

const Timetable = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isStudent = user?.role === "student";

  const [scheduleData, setScheduleData] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");

  const fetchTimetable = useCallback(
    async (classId) => {
      if (!classId) return;

      setLoadingSchedule(true);
      try {
        const { data } = await api.get(`/timetables/${classId}`);
        setScheduleData(data.schedule || []);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setScheduleData([]);
          if (!isAdmin) {
            toast("No schedule found for this class", { icon: "📅" });
          }
        } else {
          toast.error("Failed to load timetable");
        }
      } finally {
        setLoadingSchedule(false);
      }
    },
    [isAdmin]
  );

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable(selectedClass);
    }
  }, [selectedClass, fetchTimetable]);

  const handleGenerate = useCallback(
    async (selectedClassStr, yearId, settings) => {
      try {
        setIsGenerating(true);
        const { data } = await api.post("/timetables/generate", {
          classId: selectedClassStr,
          academicYearId: yearId,
          settings,
        });

        toast.success(data.message || "AI Generation Started");

        // Poll for updates allowing background AI worker to complete
        setTimeout(() => {
          fetchTimetable(selectedClassStr);
          setIsGenerating(false);
          toast.success("Schedule refreshed!");
        }, 7000);
      } catch (error) {
        toast.error(error.response?.data?.message || "Generation failed");
        setIsGenerating(false);
      }
    },
    [fetchTimetable]
  );

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto font-geist">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
              <CalendarDays className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-100">
              Smart Timetable
            </h1>
          </div>
          <p className="text-slate-500 font-medium">
            {isStudent
              ? "View your weekly class schedule and active periods."
              : "Orchestrate, manage, and view dynamic weekly schedules."}
          </p>
        </div>
      </div>

      {/* Controls Section */}
      {!isStudent && (
        <GeneratorControls
          onGenerate={handleGenerate}
          onClassChange={fetchTimetable}
          isGenerating={isGenerating}
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
        />
      )}

      {/* Visual Grid Section */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight mb-4 flex items-center gap-2">
          Weekly Roster
        </h3>
        <TimetableGrid schedule={scheduleData} isLoading={loadingSchedule} />
      </div>
    </div>
  );
};

export default Timetable;
