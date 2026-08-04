export default {
  async fetch(request, env, ctx) {
    if (request.method === "POST") {
      const formData = await request.formData();
      const email = formData.get("email");
      const message = formData.get("message");

      if (!email || !message) {
        return new Response("Missing email or message", { status: 400 });
      }

      // Get existing file contents
      let existing = await env.GUESTBOOK.get("entry.txt");
      if (!existing) existing = "";

      // Append new line
      const newEntry = `${email}: ${message}\n`;
      const updated = existing + newEntry;

      // Save back to KV
      await env.GUESTBOOK.put("entry.txt", updated);

      return new Response("Thank you! Your entry has been saved.");
    }

    // Serve entry.txt when requested
    if (request.method === "GET" && new URL(request.url).pathname === "/entry.txt") {
      const contents = await env.GUESTBOOK.get("entry.txt");
      return new Response(contents || "", {
        headers: { "content-type": "text/plain" },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  }
};
