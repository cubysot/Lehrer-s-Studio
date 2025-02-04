const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { TICKET_CONFIG } = require('../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Crea un ticket de soporte en Lehrers Studio. / Create a support ticket in Lehrers Studio.'),
  async execute(interaction) {
    try {
      // Sólo deferReply si la interacción aún no fue reconocida
      if (!interaction.deferred && !interaction.replied) {
        await interaction.deferReply({ ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setTitle('🎫 Soporte de Lehrers Studio / Lehrers Studio Support')
        .setDescription(
          '**¡Hola! ¿Necesitas ayuda? / Hello! Do you need help?**\n' +
          'Crea un ticket para recibir asistencia personalizada. / Create a ticket to receive personalized assistance.\n\n' +
          '**¿Cómo funciona? / How does it work?**\n' +
          '1. Haz clic en el menú de abajo. / Click on the menu below.\n' +
          '2. Elige una categoría. / Choose a category.\n' +
          '3. Describe tu consulta en el formulario. / Describe your request in the form.'
        )
        .setColor(0x5865F2)
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({ 
          text: 'Soporte 24/7 | Lehrers Studio Network / 24/7 Support | Lehrers Studio Network', 
          iconURL: interaction.guild.iconURL() 
        });

      const categories = [
        ...TICKET_CONFIG.PUBLIC_CATEGORIES,
        ...TICKET_CONFIG.PRIVATE_CATEGORIES
      ].map(c => ({
        label: c,
        value: c.toLowerCase().replace(/ \/ .*/, ''), // Se toma la parte en español
        description: `Selecciona para crear un ticket de ${c} / Select to create a ticket for ${c}`
      }));

      const menu = new StringSelectMenuBuilder()
        .setCustomId('select_category')
        .setPlaceholder('Elige una categoría / Choose a category')
        .addOptions(categories);

      const row = new ActionRowBuilder().addComponents(menu);

      await interaction.editReply({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error('Error en el comando /ticket:', error);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ 
          content: '❌ Ocurrió un error al procesar la interacción', 
          ephemeral: true 
        });
      } else {
        await interaction.followUp({ 
          content: '❌ Ocurrió un error al procesar la interacción', 
          ephemeral: true 
        });
      }
    }
  }
};
