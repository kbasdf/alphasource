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

      // Save entry (email as key, message as value)
      await env.GUESTBOOK.put(email, message);

      return new Response("Thank you! Your entry has been saved.");
    }

    return new Response("Method not allowed", { status: 405 });
  }
};
