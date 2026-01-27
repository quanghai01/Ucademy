import crypto from "crypto";

/**
 * Sort object keys alphabetically
 */
function sortObject(obj: any): any {
    const sorted: any = {};
    const str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

/**
 * Generate VNPay payment URL
 * Based on VNPay official demo code
 */
export function generateVNPayUrl(params: {
    amount: number;
    orderNumber: string;
    orderInfo: string;
    ipAddr: string;
    returnUrl: string;
    tmnCode: string;
    hashSecret: string;
    vnpUrl: string;
}): string {
    const { amount, orderNumber, orderInfo, ipAddr, returnUrl, tmnCode, hashSecret, vnpUrl } = params;

    const date = new Date();
    const createDate =
        date.getFullYear().toString() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);

    const vnpParams: any = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Amount: (amount * 100).toString(),
        vnp_CreateDate: createDate,
        vnp_CurrCode: "VND",
        vnp_IpAddr: ipAddr,
        vnp_Locale: "vn",
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: "other",
        vnp_ReturnUrl: returnUrl,
        vnp_TxnRef: orderNumber,
    };

    const sortedParams = sortObject(vnpParams);

    let signData = "";
    for (const key in sortedParams) {
        if (sortedParams.hasOwnProperty(key)) {
            signData += key + "=" + sortedParams[key] + "&";
        }
    }
    signData = signData.slice(0, -1); // Remove last &

    const hmac = crypto.createHmac("sha512", hashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const finalUrl = vnpUrl + "?" + signData + "&vnp_SecureHash=" + signed;
    return finalUrl;
}

/**
 * Verify VNPay callback signature
 */
export function verifyVNPaySignature(
    params: Record<string, string>,
    secureHash: string,
    secretKey: string
): boolean {
    const { vnp_SecureHash, vnp_SecureHashType, ...paramsWithoutHash } = params;

    const sortedParams = sortObject(paramsWithoutHash);

    let signData = "";
    for (const key in sortedParams) {
        if (sortedParams.hasOwnProperty(key)) {
            signData += key + "=" + sortedParams[key] + "&";
        }
    }
    signData = signData.slice(0, -1);

    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    return signed === secureHash;
}

/**
 * Parse VNPay amount (divide by 100)
 */
export function parseVNPayAmount(vnpAmount: number): number {
    return vnpAmount / 100;
}
