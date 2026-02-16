import prisma from './prisma';

export function startHeartbeat() {
  console.log('Starting Mission Control Heartbeat...');
  
  // Run every 30 seconds
  setInterval(async () => {
    try {
      // Check for pending tasks
      const pendingTasks = await prisma.task.findMany({
        where: { status: 'Planning' }
      });

      if (pendingTasks.length > 0) {
        await prisma.systemLog.create({
          data: {
            level: 'info',
            module: 'HEARTBEAT',
            message: `Detected ${pendingTasks.length} pending mission(s) awaiting assignment.`
          }
        });
      } else {
        // Optional: log heartbeat alive occasionally
        // await prisma.systemLog.create({
        //   data: { level: 'success', module: 'HEARTBEAT', message: 'System nominal. No pending tasks.' }
        // });
      }

    } catch (error) {
      console.error('Heartbeat pulse failed:', error);
      await prisma.systemLog.create({
        data: {
          level: 'error',
          module: 'HEARTBEAT',
          message: 'Pulse check failed: Database connectivity issue.'
        }
      });
    }
  }, 30000);
}
