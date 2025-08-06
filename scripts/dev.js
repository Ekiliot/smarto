const { execSync } = require('child_process');
const os = require('os');

// Функция для получения IP адреса
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Пропускаем IPv6 и loopback
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  
  return 'localhost';
}

const localIP = getLocalIP();

console.log(`🚀 Starting Smarto development server...`);
console.log(`📱 Local IP: ${localIP}`);
console.log(`🌐 Network access: http://${localIP}:3000`);
console.log(`🔗 Local access: http://localhost:3000`);
console.log('');

// Устанавливаем переменные окружения для локальной сети
process.env.NEXT_PUBLIC_SITE_URL = `http://${localIP}:3000`;
process.env.NEXT_PUBLIC_API_URL = `http://${localIP}:3000`;

// Запускаем Next.js с правильными параметрами
const command = `next dev -H 0.0.0.0 -p 3000`;

try {
  execSync(command, { 
    stdio: 'inherit',
    cwd: process.cwd(),
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: `http://${localIP}:3000`,
      NEXT_PUBLIC_API_URL: `http://${localIP}:3000`
    }
  });
} catch (error) {
  console.error('❌ Error starting development server:', error.message);
  process.exit(1);
} 