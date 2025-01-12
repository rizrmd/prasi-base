import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useLocal } from "@/lib/use-local";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { apiClient, apiResult } from "system/api";

const api_sholat = apiClient({
  url: "api/sholat",
  sampleData() {
    return {
      schedule: {
        fajr: "04:30",
        dhuhr: "11:45",
        asr: "15:15",
        maghrib: "17:45",
        isha: "19:00",
      },
    };
  },
});

const lang_sholat = {
  title: "Jadwal Sholat",
  fajr: "Subuh",
  dhuhr: "Dzuhur",
  asr: "Ashar",
  maghrib: "Maghrib",
  isha: "Isya",
  loading: "Memuat jadwal...",
  error: "Gagal memuat jadwal",
};

export default () => {
  const local = useLocal(() => ({
    schedule: apiResult(api_sholat, {
      onResult(result) {
        local.set((d) => {
          d.data = result.value?.schedule;
          d.error = result.error;
        });
      },
    }),
    data: null as any,
    error: "",
  }));

  useEffect(() => {
    local.schedule.call();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{lang_sholat.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {local.schedule.status === "loading" && (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="animate-spin mr-2" />
            <p>{lang_sholat.loading}</p>
          </div>
        )}

        {local.schedule.status === "error" && (
          <Alert variant="destructive">
            <AlertTitle>{lang_sholat.error}</AlertTitle>
            <AlertDescription>{local.error}</AlertDescription>
          </Alert>
        )}

        {local.schedule.status === "done" && local.data && (
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>{lang_sholat.fajr}</TableCell>
                <TableCell className="text-right">{local.data.fajr}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{lang_sholat.dhuhr}</TableCell>
                <TableCell className="text-right">{local.data.dhuhr}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{lang_sholat.asr}</TableCell>
                <TableCell className="text-right">{local.data.asr}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{lang_sholat.maghrib}</TableCell>
                <TableCell className="text-right">
                  {local.data.maghrib}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>{lang_sholat.isha}</TableCell>
                <TableCell className="text-right">{local.data.isha}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
