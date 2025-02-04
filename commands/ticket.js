const { SlashCommandBuilder, EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const { TICKET_CONFIG } = require('../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Crea un ticket de soporte en Lehrers Studio. / Create a support ticket in Lehrers Studio.'),
  async execute(interaction) {
    // Crear un Embed con un diseño más atractivo
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
      .setColor(0x5865F2) // Color azul de Discord
      .setThumbnail(interaction.guild.iconURL()) // Usar el ícono del servidor
      .setFooter({ text: 'Soporte 24/7 | Lehrers Studio Network / 24/7 Support | Lehrers Studio Network', iconURL: interaction.guild.iconURL() });

    // Crear opciones para el menú de selección
    const categories = [
      ...TICKET_CONFIG.PUBLIC_CATEGORIES, 
      ...TICKET_CONFIG.PRIVATE_CATEGORIES
    ].map(c => ({ 
      label: c, 
      value: c.toLowerCase().replace(/ \/ .*/, ''), // Solo toma la parte en español para el valor
      description: `Selecciona para crear un ticket de ${c} / Select to create a ticket for ${c}` // Descripción en ambos idiomas
    }));

    // Crear el menú de selección
    const menu = new StringSelectMenuBuilder()
      .setCustomId('select_category')
      .setPlaceholder('Elige una categoría / Choose a category')
      .addOptions(categories);

    // Crear una fila de componentes (menú de selección)
    const row = new ActionRowBuilder().addComponents(menu);

    // Responder con el Embed y el menú de selección
    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};
