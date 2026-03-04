// 1. Definisikan tipe agar lebih aman (Type Safe)
type RouteHandler = (request: Request, url: URL) => Response | Promise<Response>;
type RouteMap = Record<string, Record<string, RouteHandler>>;

// 2. Map route untuk memisahkan logika dari server core
const routes: RouteMap = {
  GET: {
    '/': () => 
      new Response(
        '<h1>🏠 Halaman Utama (Bun)</h1><p>Selamat datang di server Bun!</p>', 
        { headers: { 'Content-Type': 'text/html' } }
      ),
      
    '/about': () => 
      new Response(
        '<h1>📄 Tentang Kami (Bun)</h1><p>Routing manual ini lebih rapi!</p>', 
        { headers: { 'Content-Type': 'text/html' } }
      ),
      
    '/api/users': () => 
      Response.json([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]),
  },
  POST: {
    '/api/users': async (req) => {
      // Contoh cara mengambil data body jika diperlukan:
      // const body = await req.json(); 
      return Response.json(
        { message: 'User berhasil dibuat' }, 
        { status: 201 }
      );
    }
  }
};

// 3. Jalankan Server
const server = Bun.serve({
  port: 3000,
  
  async fetch(request) {
    const url = new URL(request.url);
    const { pathname: path } = url;
    const method = request.method;

    console.log(`[${new Date().toLocaleTimeString()}] ${method} ${path}`);

    // Eksekusi handler berdasarkan method dan path
    const handler = routes[method]?.[path];

    if (handler) {
      return handler(request, url);
    }

    // Default 404 response
    return new Response(
      '<h1>❌ 404 - Tidak Ditemukan</h1>', 
      {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  },
});

console.log(`🚀 Server Bun berjalan di http://localhost:${server.port}`);