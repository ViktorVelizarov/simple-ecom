import connectMongoDB from "/libs/mongodb";
import Cart from "/models/cart";
import { NextResponse } from "next/server";
import Sneaker from "/models/sneaker";

export async function GET() {
    await connectMongoDB();

    try {
        // Find the first cart
        const cart = await Cart.findOne();

        return NextResponse.json({ cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        return NextResponse.error();
    }
}

export async function POST(request: Request) {
    await connectMongoDB();

    try {
        // Find the first cart
        let cart = await Cart.findOne();

        // If no carts are found, create a new empty cart
        if (!cart) {
            cart = new Cart();
        }

        // Extract sneaker ID from request body
        const requestData = await request.json();
        const sneakerId = requestData.sneakerId;

        // Add the specific sneaker to the cart
        const sneaker = await Sneaker.findById(sneakerId);

        if (sneaker) {
            cart.sneakers.push(sneaker);
            await cart.save();
        } else {
            console.error('Sneaker not found with ID:', sneakerId);
        }

        return NextResponse.json({ cart });
    } catch (error) {
        console.error('Error adding sneaker to cart:', error);
        return NextResponse.error();
    }
}


export async function DELETE(request: Request) {
    await connectMongoDB();

    try {
        // Find the first cart
        let cart = await Cart.findOne();

        // Extract sneaker ID from request body
        const requestData = await request.json();
        const sneakerId = requestData.sneakerId;

        // Remove the specific sneaker from the cart
        cart.sneakers = cart.sneakers.filter(sneaker => sneaker._id.toString() !== sneakerId);

        await cart.save();

        return NextResponse.json({ cart });
    } catch (error) {
        console.error('Error removing sneaker from cart:', error);
        return NextResponse.error();
    }
}