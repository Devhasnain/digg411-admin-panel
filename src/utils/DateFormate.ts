import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";


export const formatToDMY = (isoString: Date) => {
  const date = new Date(isoString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day < 10 ? `0${day}` : day}-${month < 10 ? `0${month}` : month
    }-${year}`;
}

export const loadImageAsBase64 = (url: any) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.src = url;
  });

type DownloadUserInvoiceProps = {
  name: string;
  email: string;
  amount: number;
  monthlyDownloadLimit: number;
  totalDownloads: number;
  start_date: string;
  expires_at: string;
  downloads_list: any[]
}

export const DownloadUserInvoice = (data: DownloadUserInvoiceProps) => {

  let {
  name,
  email,
  amount,
  monthlyDownloadLimit,
  totalDownloads,
  start_date,
  expires_at,
  downloads_list
}=data
  console.log(data,'invoice data')

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const imgWidth = 60; // your chosen width
  const imgHeight = 20; // your chosen height
  const x = (pageWidth - imgWidth) / 2; // center horizontally
  const y = 10; // keep top margin
  doc.addImage(
    "https://petro411.vercel.app/logo-name.png",
    "PNG",
    x,
    y,
    imgWidth,
    imgHeight
  );
  doc.setFontSize(12);
  doc.text(name, 10, 60);
  doc.text(email, 10, 70);

  autoTable(doc, {
    startY: 90,
    theme: "plain",
    styles: { fontSize: 12 },
    columnStyles: { 0: { fontStyle: "bold" } },
    body: [
      ["Subscription", ""],
      ["Amount", amount],
      [
        "Monthly Downloads limit",
        `${monthlyDownloadLimit} counties`,
      ],
      ["Used Downloads", totalDownloads],
      ["Start Date", start_date],
      ["Expiry Date", expires_at],
    ],
  });

  const downloads = downloads_list;

  if (downloads?.length) {
    autoTable(doc, {
      startY: 150,
      head: [["County", "No of rows"]],
      body: downloads.map((d: any) => [d.county, d.items_count]),
    });
  }

  doc.save("user-subscription.pdf");
}