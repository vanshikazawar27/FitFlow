import API from "../services/api";

function DownloadReport() {
  const downloadReport = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response =
        await API.get(
          "/report/download",
          {
            responseType: "blob",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "FitFlow_Report.pdf"
      );

      document.body.appendChild(
        link
      );

      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      onClick={downloadReport}
      className="bg-[#1E293B] hover:bg-slate-800 text-white border border-slate-700 hover:border-[#A3E635] px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center gap-2 shadow-md"
    >
      <span>📄</span> Download Report
    </button>
  );
}

export default DownloadReport;