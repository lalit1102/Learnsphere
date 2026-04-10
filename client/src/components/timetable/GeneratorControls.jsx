import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext"; // Note: Project might use context/AuthContext

const GeneratorControls = ({
  onGenerate,
  onClassChange,
  isGenerating,
  selectedClass,
  setSelectedClass,
}) => {
  const { user } = useAuth();
  const hideGenerate = user?.role !== "admin" && user?.role !== "teacher";
  const [classes, setClasses] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  
  // Time Settings
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("14:00");
  const [periods, setPeriods] = useState("5");

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const [clsRes, yearRes] = await Promise.all([
          api.get("/classes"),
          api.get("/academic-years"), // Get all years so we can see history if needed
        ]);
        setClasses(clsRes.data.classes || []);
        
        const yearsData = yearRes.data.years || yearRes.data || [];
        setYears(yearsData);

        // Auto-select current year
        const current = Array.isArray(yearsData)
          ? yearsData.find((y) => y.isCurrent)
          : yearsData;

        if (current?._id) setSelectedYear(current._id);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load selection data");
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleGenerateClick = () => {
    if (!selectedClass || !selectedYear) {
      toast.error("Please select both a Class and Academic Year");
      return;
    }
    onGenerate(selectedClass, selectedYear, {
      startTime,
      endTime,
      periods: parseInt(periods, 10) || 5,
    });
  };

  const handleClassSelect = (val) => {
    setSelectedClass(val);
    onClassChange(val);
  };
  
  return (
    <Card className="w-full font-geist border-slate-100 dark:border-slate-800 shadow-sm rounded-3xl overflow-hidden">
      <CardHeader className="bg-slate-50 border-b border-slate-100 dark:bg-slate-900/50 dark:border-slate-800/50 pb-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {hideGenerate ? "View Timetable" : "Timetable Controls"}
            </CardTitle>
            <CardDescription className="text-sm font-medium">
              {hideGenerate
                ? "Select a class to view its schedule"
                : "Configure constraints and generate dynamic schedule"}
            </CardDescription>
          </div>
          {isGenerating && (
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full shadow-sm animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              <span>AI Engine Processing...</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Academic Year</Label>
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
              disabled={loadingData}
            >
              <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 focus:ring-indigo-500">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {years.map((y) => (
                  <SelectItem key={y._id} value={y._id} className="rounded-lg">
                    {y.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Select Class</Label>
            <Select
              value={selectedClass}
              onValueChange={handleClassSelect}
              disabled={loadingData}
            >
              <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 focus:ring-indigo-500">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {classes.map((c) => (
                  <SelectItem key={c._id} value={c._id} className="rounded-lg">
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {!hideGenerate && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50">
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Start Time</Label>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  disabled={isGenerating}
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 focus:ring-indigo-500 text-center font-medium"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">End Time</Label>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  disabled={isGenerating}
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 focus:ring-indigo-500 text-center font-medium"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wide text-slate-500">Periods / Day</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={periods}
                  onChange={(e) => setPeriods(e.target.value)}
                  disabled={isGenerating}
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 dark:bg-slate-900 dark:border-slate-800 focus:ring-indigo-500 text-center font-bold"
                />
              </div>
            </div>

            <Button
              className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[15px] transition-all hover:scale-[1.01] shadow-lg shadow-indigo-100 dark:shadow-none"
              onClick={handleGenerateClick}
              disabled={isGenerating || !selectedClass || !selectedYear}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Optimizing Schedule Flow...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" /> Generate Smart Timetable
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeneratorControls;
