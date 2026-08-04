export default {
  async fetch(request, env, ctx) {
    if (request.method === "POST") {
      const formData = await request.formData();
      const email = formData.get("email");
      const message = formData.get("message");

      if (!email || !message) {
        return new Response("Missing email or message", { status: 400 });
      }

      // Check if already submitted
      const existing = await env.GUESTBOOK.get(email);
      if (existing) {
        return new Response("Submit allowed only once!", { status: 403 });
      }

      // Save entry
      await env.GUESTBOOK.put(email, message);
      return new Response("Thank you! Your entry has been saved.");
    }

    // For GET requests, serve your static index.html
    if (request.method === "GET") {
      return new Response(
        await (await fetch("https://alphasource.pages.dev/index.html")).text(),
        { headers: { "content-type": "text/html" } }
      );
    }

    return new Response("Method not allowed", { status: 405 });
  }
};
