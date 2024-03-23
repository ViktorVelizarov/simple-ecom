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

        // Add the specific sneaker to the cart
        const sneakerId = '65fc8363a640d9500ea26e06'; // ID of the sneaker to add
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
