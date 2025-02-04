const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { generateHTMLTranscript } = require('../utils/transcript');
const { tickets } = require('./handleModals');

module.exports = {
  handleTicketButtons: async (interaction) => {
    const ticketId = interaction.channel.name;
    const ticket = tickets[ticketId];
    
    if (!ticket) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Error')
        .setDescription('No se pudo encontrar la información del ticket.')
        .setColor(0xFF0000)
        .setFooter({ text: 'Lehrer\'s Studio', iconURL: interaction.guild.iconURL() });

      return interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    }

    switch (interaction.customId) {
      case 'close_ticket':
        await interaction.channel.permissionOverwrites.edit(ticket.user, {
          ViewChannel: false,
          SendMessages: false
        });

        const staffButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('transcribe')
            .setLabel('Transcribir')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('📄'),
          new ButtonBuilder()
            .setCustomId('delete')
            .setLabel('Eliminar')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🗑️'),
          new ButtonBuilder()
            .setCustomId('reopen')
            .setLabel('Reabrir')
            .setStyle(ButtonStyle.Success)
            .setEmoji('🔓')
        );

        const embed = new EmbedBuilder()
          .setTitle('🔒 Ticket Cerrado')
          .setDescription('El ticket ha sido cerrado. Selecciona una acción:')
          .setColor(0x5865F2)
          .setFooter({ text: 'Lehrer\'s Studio', iconURL: interaction.guild.iconURL() });

        await interaction.reply({ 
          embeds: [embed],
          components: [staffButtons],
          ephemeral: true
        });
        break;

      case 'transcribe':
        await interaction.deferReply({ ephemeral: true });
        const transcript = await generateHTMLTranscript(interaction.channel);
        
        const transcriptEmbed = new EmbedBuilder()
          .setTitle('📄 Transcripción Generada')
          .setDescription('Se ha generado la transcripción del ticket.')
          .setColor(0x5865F2)
          .setFooter({ text: 'Lehrer\'s Studio', iconURL: interaction.guild.iconURL() });

        await interaction.editReply({
          embeds: [transcriptEmbed],
          files: [{
            attachment: transcript,
            name: `transcripcion-${interaction.channel.name}.html`
          }]
        });
        
        fs.unlinkSync(transcript);
        break;

      case 'delete':
        delete tickets[interaction.channel.name];
        await interaction.channel.delete('Ticket eliminado por staff');
        break;

      case 'reopen':
        await interaction.channel.permissionOverwrites.edit(ticket.user, {
          ViewChannel: true,
          SendMessages: true
        });
        
        const parentCategory = interaction.guild.channels.cache.get(ticket.parentCategory);
        if (parentCategory) {
          await parentCategory.permissionOverwrites.edit(ticket.user, {
            ViewChannel: true
          });
        }

        const reopenEmbed = new EmbedBuilder()
          .setTitle('🔓 Ticket Reabierto')
          .setDescription('El ticket ha sido reabierto.')
          .setColor(0x00FF00)
          .setFooter({ text: 'Lehrer\'s Studio', iconURL: interaction.guild.iconURL() });

        await interaction.update({ 
          embeds: [reopenEmbed],
          components: []
        });
        break;
    }
  }
};
