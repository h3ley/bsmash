import QRCode from "qrcode";
export async function toDataUrl(text: string) {
  return QRCode.toDataURL(text);
}
