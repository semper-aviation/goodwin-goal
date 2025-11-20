import { NextRequest, NextResponse } from "next/server"

// Basic auth credentials (in production, use environment variables)
const VALID_USERNAME = process.env.BASIC_AUTH_USERNAME
const VALID_PASSWORD = process.env.BASIC_AUTH_PASSWORD

function checkAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization")

  if (!authHeader) {
    return false
  }

  // Parse Basic auth header
  const base64Credentials = authHeader.split(" ")[1]
  if (!base64Credentials) {
    return false
  }

  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8")
  const [username, password] = credentials.split(":")

  // Verify credentials
  return username === VALID_USERNAME && password === VALID_PASSWORD
}

export async function GET(request: NextRequest) {
  // Check authentication
  if (!checkAuth(request)) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    })
  }

  try {
    const response = await fetch(
      `${process.env.GOODWIN_BASE_URL}admin/goodwin/goal`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Referer: "x-mobile-client",
          "x-api-key": process.env.ADMIN_API_KEY!,
        },
        // Disable caching to ensure fresh data on each request
        cache: "no-store",
      }
    )
    if (!response.ok) {
      throw new Error(`External API error! status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    console.error("Error fetching goal data:", error)
    return NextResponse.json(
      { error: "Failed to fetch goal data" },
      { status: 500 }
    )
  }
}
