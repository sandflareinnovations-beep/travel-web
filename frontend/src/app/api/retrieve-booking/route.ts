import { NextResponse } from "next/server";

const API_BASE_URL = "http://13.228.159.25:3001/flight/Utils";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const response = await fetch(`${API_BASE_URL}/RetrieveBooking`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: process.env.AKBAR_AUTH_TOKEN!,
                },
                body: JSON.stringify(body),
            }
        );

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: "RetrieveBooking failed" },
            { status: 500 }
        );
    }
}
