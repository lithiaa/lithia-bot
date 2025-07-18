const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  name: 'health',
  description: 'Check bot health and performance',
  data: new SlashCommandBuilder()
    .setName('health')
    .setDescription('Check bot health'),
  
  execute(message, args) {
    const uptime = process.uptime();
    const memUsage = process.memoryUsage();
    
    message.channel.send(`🟢 Bot Health:
• Uptime: ${Math.floor(uptime / 60)} minutes
• Memory: ${Math.round(memUsage.rss / 1024 / 1024)} MB
• Platform: ${process.platform}
• Node: ${process.version}`);
  },

  async executeSlash(interaction) {
    const startTime = Date.now();
    console.log('Health check: Starting...');
    
    try {
      await interaction.deferReply();
      console.log('Health check: Deferred successfully');
      
      const uptime = process.uptime();
      const memUsage = process.memoryUsage();
      const responseTime = Date.now() - startTime;
      
      const healthReport = `🟢 **Bot Health Report**
      
**⏱️ Performance:**
• Response Time: ${responseTime}ms
• Uptime: ${Math.floor(uptime / 60)} minutes
• Memory Usage: ${Math.round(memUsage.rss / 1024 / 1024)} MB

**🖥️ System:**
• Platform: ${process.platform}
• Node Version: ${process.version}
• CPU Usage: ${process.cpuUsage().user}μs

**🌐 Network:**
• Bot Latency: ${interaction.client.ws.ping}ms
• Commands Loaded: ${interaction.client.commands.size}`;

      await interaction.editReply(healthReport);
      console.log('Health check: Completed successfully');
      
    } catch (error) {
      console.error('Health check: Error:', error);
      try {
        if (interaction.deferred) {
          await interaction.editReply('❌ Health check failed');
        } else {
          await interaction.reply('❌ Health check failed');
        }
      } catch (replyError) {
        console.error('Health check: Failed to send error reply:', replyError);
      }
    }
  }
};
