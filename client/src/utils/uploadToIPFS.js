export const uploadToIPFS = async (file) => {
  const jwt = import.meta.env.VITE_PINATA_JWT;

  if (!jwt) {
    throw new Error("❌ Missing Pinata JWT in environment");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to upload: ${errorText}`);
    }

    const data = await res.json();
    const cid = data.IpfsHash;

    if (!cid) throw new Error("CID not returned");

    return `https://gateway.pinata.cloud/ipfs/${cid}`;
  } catch (err) {
    console.error("❌ Upload to IPFS failed:", err);
    throw err;
  }
};
