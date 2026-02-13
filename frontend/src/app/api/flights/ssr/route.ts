import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://13.228.159.25:3001/flight';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjMwMCIsIkFnZW50SW5mbyI6Ii9MRldjVENVQ3lkWVBjVGNuaFdLaWo0UXhhcXN2eFBIcWV0a0psY3NGZklxWmVCUkZIUlNTOFFRWE1ybk8vVDhFcmt6UnMyYzk3cnloS01sWXc3NitRPT0iLCJwd2QiOiJMMkV0NEcvWHE0bExYQUd4Q3M2REh3PT0iLCJhZ2VudENvZGUiOiIvS2ZkWXdlc3FQdz0iLCJjbGllbnRJZCI6IjJmelhFa014VkRVPSIsIkJyb3dzZXJLZXkiOiIrNlg5SlVvTSttNE9VdFRBMVoxamlaTlViRHhCMWIwY0VLR21ud2JyTmVwZERvd0xHeVVzT2c9PSIsIm5iZiI6MTc2OTkyNTEzOCwiZXhwIjoxNzc4NTY1MTM4LCJpYXQiOjE3Njk5MjUxMzgsImlzcyI6IndlYmNvbm5lY3QiLCJhdWQiOiJjbGllbnQifQ.c27RhBOUtzwNupSqCj0_zXxYJuOvTocoRazG6qtG5OE';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(
            `${API_BASE_URL}/Flights/SSR`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN,
                },
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            console.error('❌ Backend SSR failed with status:', response.status);
            throw new Error(`Backend SSR failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ SSR API Raw Response:', JSON.stringify(data, null, 2));

        return NextResponse.json(data);
    } catch (error) {
        console.error('❌ SSR API Error', error);

        return NextResponse.json(
            {
                Code: '500',
                Msg: ['Failed to fetch SSR data'],
                SSR: [],
            },
            { status: 500 }
        );
    }
}
