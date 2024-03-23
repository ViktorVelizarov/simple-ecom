import connectMongoDB from "/libs/mongodb";
import Sneaker from "/models/sneaker";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  // Assuming you're expecting JSON data in the request body
  const requestData = await request.json();
  const sneakerId = requestData.sneakerId;
  const sneaker = await Sneaker.findById(sneakerId );

  // Return the ID as JSON response
  return NextResponse.json({ sneaker });
}
