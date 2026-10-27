import envConfig from "@config/environment";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const VERIFY_TIMEOUT_MS = 5000;

// Checks a Cloudflare Turnstile token with Cloudflare.
// Fails closed: any network or Cloudflare error counts as not verified.
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: envConfig.captcha.turnstileSecretKey,
        response: token,
      }),
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error("Turnstile verification request failed:", response.status);
      return false;
    }

    const result = (await response.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    if (!result.success) {
      console.error("Turnstile verification rejected:", result["error-codes"]);
    }

    return result.success === true;
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return false;
  }
}
