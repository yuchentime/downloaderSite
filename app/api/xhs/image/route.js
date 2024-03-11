export async function GET(request) {
  const searchParams = new URL(request.url);
  const imageUrl = JSON.parse(searchParams.searchParams.get("url"));
  console.log("imageUrl: ", imageUrl);
  if (!imageUrl) {
    console.error("imageUrl is null");
    return Response.error();
  }
  try {
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();

    return new Response(imageBuffer, {
      headers: {
        "Content-Type": response.headers.get("content-type"),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).end("Internal Server Error");
  }
}
