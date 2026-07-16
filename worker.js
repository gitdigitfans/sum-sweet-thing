const DB_KEY = 'payment_methods_db';

const SEED_DATA = {
  nextId: 4,
  methods: [
    { id: 1, name: 'التحويل البنكي - CIB', type: 'bank_transfer', is_active: 1, sort_order: 1, settings: { bank_name: 'CIB مصر', account_holder_ar: 'كيرينزا للمستلزمات الطبية أحمد كمال أحمد معوض', account_holder_en: 'CURENZA AHMED KAMAL AHMED MOUAWAD', accounts: [{ currency: 'EGP', currency_label: 'الجنيه المصري', account_number: '100074553774', iban: 'EG740010006700000100074553774', note: 'يفضل استخدام حساب CIB بالجنيه المصري لتجار الجملة داخل مصر.' }, { currency: 'USD', currency_label: 'الدولار الأمريكي', account_number: '100074553731', iban: 'EG710010006700000100074553731', note: 'حساب الدولار الأمريكي مخصص للمدفوعات القادمة من خارج جمهورية مصر العربية.' }], swift_code: 'CIBEEGCX141', instructions: 'بعد التحويل يرجى إرسال إثبات الدفع لإتمام مراجعة الطلب.' }, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 2, name: 'بطاقة ائتمان / مدى', type: 'card', is_active: 1, sort_order: 2, settings: { description: 'يمكنك الدفع عبر بطاقات الائتمان أو بطاقة مدى.' }, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { id: 3, name: 'محفظة إلكترونية', type: 'wallet', is_active: 0, sort_order: 3, settings: { description: 'الدفع عبر المحافظ الإلكترونية (فودافون كاش، أورانج كاش، إتصالات كاش).' }, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  ]
};

const MIME_TYPES = {
  '.html': 'text/html;charset=utf-8',
  '.css': 'text/css;charset=utf-8',
  '.js': 'text/javascript;charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

async function getDb() {
  const val = await IRON_ASSETS.get(DB_KEY, 'text');
  if (val) return JSON.parse(val);
  const data = JSON.parse(JSON.stringify(SEED_DATA));
  data.methods.forEach(m => {
    m.created_at = new Date().toISOString();
    m.updated_at = new Date().toISOString();
  });
  await IRON_ASSETS.put(DB_KEY, JSON.stringify(data));
  return data;
}

async function saveDb(data) {
  await IRON_ASSETS.put(DB_KEY, JSON.stringify(data));
}

function jsonResponse(data, status) {
  if (!status) status = 200;
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { 'Content-Type': 'application/json;charset=utf-8', 'Access-Control-Allow-Origin': '*' },
  });
}

async function handleApi(request, pathname) {
  const url = new URL(request.url);
  const method = request.method;
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'api' || parts[1] !== 'payment-methods') return null;
  const id = parts[2] ? parseInt(parts[2]) : null;
  const action = parts[3] || null;
  if (method === 'GET') {
    const db = await getDb();
    if (id) {
      const m = db.methods.find(x => x.id === id);
      if (!m) return jsonResponse({ success: false, message: 'طريقة الدفع غير موجودة' }, 404);
      return jsonResponse({ success: true, data: m });
    }
    if (action === 'active') {
      return jsonResponse({ success: true, data: db.methods.filter(m => m.is_active === 1) });
    }
    return jsonResponse({ success: true, data: db.methods });
  }
  if (method === 'POST') {
    const body = await request.json();
    const { name, type, is_active, sort_order, settings } = body;
    if (!name || !name.trim()) {
      return jsonResponse({ success: false, message: 'اسم طريقة الدفع مطلوب' }, 400);
    }
    const db = await getDb();
    const newMethod = {
      id: db.nextId, name: name.trim(), type: type || 'bank_transfer',
      is_active: is_active !== undefined ? (is_active ? 1 : 0) : 1,
      sort_order: sort_order || 0, settings: settings || {},
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    db.methods.push(newMethod);
    db.nextId++;
    await saveDb(db);
    return jsonResponse({ success: true, data: newMethod }, 201);
  }
  if (method === 'PUT' && id) {
    const body = await request.json();
    const db = await getDb();
    const index = db.methods.findIndex(m => m.id === id);
    if (index === -1) return jsonResponse({ success: false, message: 'طريقة الدفع غير موجودة' }, 404);
    const existing = db.methods[index];
    const { name, type, is_active, sort_order, settings } = body;
    db.methods[index] = {
      ...existing,
      name: name !== undefined ? name.trim() : existing.name,
      type: type || existing.type,
      is_active: is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      sort_order: sort_order !== undefined ? sort_order : existing.sort_order,
      settings: settings !== undefined ? settings : existing.settings,
      updated_at: new Date().toISOString(),
    };
    await saveDb(db);
    return jsonResponse({ success: true, data: db.methods[index] });
  }
  if (method === 'PATCH' && id && action === 'toggle') {
    const db = await getDb();
    const index = db.methods.findIndex(m => m.id === id);
    if (index === -1) return jsonResponse({ success: false, message: 'طريقة الدفع غير موجودة' }, 404);
    db.methods[index].is_active = db.methods[index].is_active ? 0 : 1;
    db.methods[index].updated_at = new Date().toISOString();
    await saveDb(db);
    return jsonResponse({ success: true, data: db.methods[index] });
  }
  if (method === 'DELETE' && id) {
    const db = await getDb();
    const index = db.methods.findIndex(m => m.id === id);
    if (index === -1) return jsonResponse({ success: false, message: 'طريقة الدفع غير موجودة' }, 404);
    db.methods.splice(index, 1);
    await saveDb(db);
    return jsonResponse({ success: true, message: 'تم حذف طريقة الدفع بنجاح' });
  }
  return jsonResponse({ success: false, message: 'Method not allowed' }, 405);
}

async function serveStatic(pathname) {
  let key = pathname === '/' ? 'index.html' : pathname.substring(1);
  if (key === 'gold-challenge') key = 'gold-challenge.html';
  if (key === 'admin') key = 'admin.html';
  if (key === 'checkout') key = 'checkout.html';
  const ext = key.substring(key.lastIndexOf('.'));
  const mime = MIME_TYPES[ext] || 'application/octet-stream';
  const value = await IRON_ASSETS.get(key, 'arrayBuffer');
  if (value === null) return null;
  return new Response(value, {
    status: 200,
    headers: {
      'Content-Type': mime,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function handleRequest(request) {
  try {
    const url = new URL(request.url);
    const pathname = url.pathname;
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }
    if (pathname.startsWith('/api/')) {
      const apiResponse = await handleApi(request, pathname);
      if (apiResponse) return apiResponse;
    }
    const staticResponse = await serveStatic(pathname);
    if (staticResponse) return staticResponse;
    return new Response('Not Found', { status: 404 });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=utf-8', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
