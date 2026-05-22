import * as http from 'http';

const PORT = 3000;

// Simulasi lapisan abstraksi data
const users = [
  { id: 1, name: "Nabil" },
  { id: 2, name: "Fauzan" }
];

const products = [
  { id: 1, name: "HP" },
  { id: 2, name: "Case" }
];

// Fungsi pembantu untuk mem-parsing stream dari Request Body secara asinkron
const parseRequestBody = (req: http.IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("Format JSON pada request payload tidak valid"));
      }
    });
    req.on('error', err => reject(err));
  });
};

const server = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const startTime = Date.now(); 
  const url = req.url || '/';
  const method = req.method || 'GET';
  console.log(`[${new Date().toLocaleTimeString()}] ${method} ${url}`);

  const sendJSON = (statusCode: number, data: any) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
      
    const endTime = Date.now();
    console.log(`⏱ Waktu eksekusi: ${endTime - startTime} ms\n`);
  };

  try {
    if (url === "/" && method === "GET") {
      return sendJSON(200, { message: "Selamat datang di halaman Home!" });
    }

    if (url === "/about" && method === "GET") {
      return sendJSON(200, { message: "Halaman About" });
    }

    if (url === "/products" && method === "GET") {
      return sendJSON(200, products);
    }

    if (url === "/products" && method === "POST") {
      const payload = await parseRequestBody(req);
      const newProduct = { id: products.length + 1, ...payload };
      
      // Simulasi injeksi ke sumber data
      products.push(newProduct);
      return sendJSON(201, { message: "Produk berhasil dibuat", data: newProduct });
    }

    if (url.startsWith("/users/") && method === "GET") {
      const parts = url.split("/");
      const id = parseInt(parts[2], 10);

      if (isNaN(id)) {
        return sendJSON(400, { message: "Parameter ID harus berupa representasi numerik valid" });
      }

      const user = users.find(u => u.id === id);

      if (user) {
        return sendJSON(200, user);
      } else {
        return sendJSON(404, { message: "User tidak ditemukan" });
      }
    }

    if (url === "/users" && method === "POST") {
      const payload = await parseRequestBody(req);
      const newUser = { id: users.length + 1, ...payload };
      
      users.push(newUser);
      return sendJSON(201, { message: "User berhasil dibuat", data: newUser });
    }

    return sendJSON(404, { message: "Route yang dituju tidak ditemukan" });

  } catch (error: any) {
    // Sabuk pengaman: Mencegah terhentinya siklus server jika terjadi galat runtime di dalam blok routing
    return sendJSON(500, { message: "Terjadi anomali pemrosesan internal server", error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
