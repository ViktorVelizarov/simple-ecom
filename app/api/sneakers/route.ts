import connectMongoDB from "/libs/mongodb";
import Sneaker from "/models/sneaker";
import { NextResponse } from "next/server";


export async function GET() {
    await connectMongoDB();
    const sneakers = await Sneaker.find();
    return NextResponse.json({ sneakers });
  }
  