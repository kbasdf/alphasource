export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle form submissions
    if (url.pathname === "/submit" && request.method === "POST") {
      const formData = await request.formData();
      const email = formData.get("email");
      const message = formData.get("message");

      if (!email || !message) {
        return new Response("Missing email or message", { status: 400 });
      }

      // Append to KV "entry.txt"
      let existing = await env.GUESTBOOK.get("entry.txt");
      if (!existing) existing = "";

      const newEntry = `${email}: ${message}\n`;
      const updated = existing + newEntry;

      await env.GUESTBOOK.put("entry.txt", updated);

      return new Response("Thank you! Your entry has been saved.");
    }

    // Serve entry.txt contents
    if (url.pathname === "/entry.txt" && request.method === "GET") {
      const contents = await env.GUESTBOOK.get("entry.txt");
      return new Response(contents || "", {
        headers: { "content-type": "text/plain" },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  }
};
