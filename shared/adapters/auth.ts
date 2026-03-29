export async function requestMockOtp(phone: string) {
  await new Promise((resolve) => setTimeout(resolve, 350));
  return {
    phone,
    code: "4826",
    expiresAt: Date.now() + 5 * 60 * 1000,
  };
}

export async function verifyMockOtp(code: string, expectedCode: string) {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return code.trim() === expectedCode.trim();
}
