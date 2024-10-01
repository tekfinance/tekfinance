import {QRCodeCanvas} from "@loskir/styled-qr-code-node";

export const createQRCode = (data: string, image?: string) => {
  return new QRCodeCanvas({
    data,
    image,
    dotsOptions: {
      color: "#000000",
      type: "rounded",
    },
    cornersDotOptions: {
      type: "dot",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
    },
    backgroundOptions: {
      color: "#e9ebee",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 20,
    },
  });
};
