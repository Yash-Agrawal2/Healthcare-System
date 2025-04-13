// src/utils/ipfs.js
import { create } from "ipfs-http-client";

// Connect to local IPFS node (adjust if using a remote node)
const ipfs = create({ host: "localhost", port: "5001", protocol: "http" });

export async function uploadToIPFS(file) {
    try {
        const added = await ipfs.add(file);
        return added.path; // Returns the IPFS hash
    } catch (error) {
        console.error("IPFS Upload Error:", error);
        return null;
    }
}

export async function fetchFromIPFS(hash) {
    try {
        const response = await ipfs.cat(hash);
        return new TextDecoder().decode(response); // Decodes IPFS content
    } catch (error) {
        console.error("IPFS Fetch Error:", error);
        return null;
    }
}
