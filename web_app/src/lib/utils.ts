import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import mongoose from "mongoose"
import { createHash } from "crypto"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function generateRandomUUID() {
  return new mongoose.Types.ObjectId().toHexString();
}

export function stringToHex(str : string) {
  let hex = '';
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }

  if (hex.length > 24) {
    hex = hex.slice(0, 24); // Truncate if too long
  } else if (hex.length < 24) {
    hex = hex.padEnd(24, '0'); // Pad with zeroes if too short
  }

  return hex;
}

// Function to convert a hex string back to the original string
export function hexToString(hex : string) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }

  // Remove any padding zeros if they were added
  return str.replace(/\0+$/, '');
}