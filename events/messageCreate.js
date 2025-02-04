const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  StringSelectMenuBuilder 
} = require('discord.js');
const { TICKET_CONFIG } = require('../utils/config');

module.exports = {
  name: 'messageCreate',
  execute: async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === '!ticket') {
      const embed = new EmbedBuilder()
        .setTitle('🎟️ Soporte de Lehrer\'s Studio')
        .setDescription('¡Hola! ¿Necesitas ayuda? Crea un ticket para asistencia.\n\n**¿Cómo funciona?**\n1. Haz clic en el menú\n2. Elige una categoría\n3. Describe tu consulta')
        .setColor(0x5865F2)
        .setThumbnail(message.guild.iconURL())
        .setFooter({ text: 'Soporte 24/7 | Lehrer\'s Studio' });

      const categories = [
        ...TICKET_CONFIG.PUBLIC_CATEGORIES, 
        ...TICKET_CONFIG.PRIVATE_CATEGORIES,
        ...TICKET_CONFIG.CONFIDENTIAL_CATEGORIES
      ].map(c => ({ label: c, value: c.toLowerCase() }));

      const menu = new StringSelectMenuBuilder()
        .setCustomId('select_category')
        .setPlaceholder('Elige categoría')
        .addOptions(categories);

      await message.channel.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(menu)]
      });
    }
  }
};