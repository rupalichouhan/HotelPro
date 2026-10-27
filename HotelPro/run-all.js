const { spawn } = require('child_process');
const path = require('path');
const net = require('net');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('====================================================');
console.log('🏨 Starting HotelPro Full-Stack Application...');
console.log('📡 Starting Backend (Port 8001) + Frontend (Port 5173)');
console.log('====================================================');

// Helper to check if a port is in use
const checkPort = (port) => {
  return new Promise((resolve) => {
    const tester = net.createServer();
    tester.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false); // In use
      } else {
        resolve(true);
      }
    });
    tester.once('listening', () => {
      tester.close(() => resolve(true));
    });
    tester.listen(port);
  });
};

const startServices = async () => {
  const is8001Free = await checkPort(8001);
  const is5173Free = await checkPort(5173);

  if (!is8001Free) {
    console.warn('⚠️  Port 8001 is already in use by another process.');
    console.warn('👉 If another terminal or background process is running, close it or run:');
    console.warn('   Stop-Process -Id (Get-NetTCPConnection -LocalPort 8001).OwningProcess -Force\n');
  }

  if (!is5173Free) {
    console.warn('⚠️  Port 5173 is already in use by another process.\n');
  }

  // Spawn without passing args array to shell:true to eliminate Node 24 DEP0190 warning
  const serverProc = spawn(`${npmCmd} start`, {
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit',
    shell: true,
  });

  const clientProc = spawn(`${npmCmd} run dev`, {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
    shell: true,
  });

  const cleanup = () => {
    console.log('\n🛑 Shutting down HotelPro services...');
    try {
      if (isWindows) {
        if (serverProc.pid) spawn(`taskkill /pid ${serverProc.pid} /T /F`, { shell: true });
        if (clientProc.pid) spawn(`taskkill /pid ${clientProc.pid} /T /F`, { shell: true });
      } else {
        serverProc.kill();
        clientProc.kill();
      }
    } catch (e) {
      // Ignore cleanup errors
    }
    process.exit();
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
};

startServices();
