const users = [
  { id: 1, name: "Nabil" },
  { id: 2, name: "Fauzan" },
];

const products = [
  { id: 1, name: "HP" },
  { id: 2, name: "Case" },
];

const server = Bun.serve({
  port: 3000,

  async fetch(request) {
    const startTime = Date.now(); 

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    console.log(`[${new Date().toLocaleTimeString()}] ${method} ${path}`);

    const sendJSON = (data, status = 200) => {
      const endTime = Date.now();
      console.log(`⏱ Waktu eksekusi: ${endTime - startTime} ms\n`);

      return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
        status,
      });
    };

    if (path === "/" && method === "GET") {
      return sendJSON({ message: "Selamat datang di halaman Home!" });
    }

    if (path === "/about" && method === "GET") {
      return sendJSON({ message: "Halaman About" });
    }

    if (path === "/products" && method === "GET") {
      return sendJSON(products);
    }

    if (path === "/products" && method === "POST") {
      return sendJSON(
        { message: "Produk berhasil dibuat (simulasi)" },
        201
      );
    }

    if (path.startsWith("/users/") && method === "GET") {
      const parts = path.split("/");
      const id = parseInt(parts[2]);

      const user = users.find((u) => u.id === id);

      if (user) {
        return sendJSON(user);
      } else {
        return sendJSON({ message: "User tidak ditemukan" }, 404);
      }
    }
    
    if (path === "/users" && method === "POST") {
      return sendJSON(
        { message: "User berhasil dibuat (simulasi)" },
        201
      );
    }

    return sendJSON({ message: "Route tidak ditemukan" }, 404);
  },
});

console.log(`🚀 Server Bun berjalan di http://localhost:${server.port}`);
