export async function connectZaloMock() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    connected: true,
    provider: "zalo-placeholder",
    todo: "Replace with real Zalo OAuth and delivery setup.",
  };
}
