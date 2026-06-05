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
      className="bg-red-600 text-white px-6 py-3 rounded-lg"
    >
      Download PDF Report 📄
    </button>
  );
}

export default DownloadReport;