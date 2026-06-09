import { useState } from "react";
import API from "../services/api";
import AnimatedButton from "../components/AnimatedButton";

function DownloadReport() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadReport = async () => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem("token");

      const response = await API.get("/report/download", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "FitFlow_Report.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log(error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatedButton
      onClick={downloadReport}
      disabled={isDownloading}
      className="bg-white/90 backdrop-blur-md hover:bg-white text-emerald-700 border border-white/50 px-6 py-3.5 rounded-2xl font-bold transition-all duration-300 flex items-center gap-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] group disabled:opacity-80 disabled:cursor-not-allowed"
    >
      {isDownloading ? (
        <span className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      ) : (
        <span className="text-xl group-hover:-translate-y-0.5 transition-transform">📥</span>
      )}
      <span>{isDownloading ? "Generating..." : "Export Report"}</span>
    </AnimatedButton>
  );
}

export default DownloadReport;