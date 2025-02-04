const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require('discord.js');
const { TICKET_CONFIG } = require('../utils/config');
const { userSelections } = require('./handleSelectMenu');

let tickets = {};

function getNextTicketNumber() {
  const numbers = Object.keys(tickets).map(k => parseInt(k.split('-')[1]) || 0);
  return (Math.max(...numbers, 0) + 1).toString().padStart(4, '0');
}

module.exports = {
  tickets,
  handleTicketModal: async (interaction) => {
    await interaction.deferReply({ flags: 'Ephemeral' });
    
    const category = userSelections.get(interaction.user.id);
    if (!category) {
      return interaction.editReply('❌ No se pudo encontrar la categoría seleccionada');
    }
    
    const description = interaction.fields.getTextInputValue('description');
    const isPublic = TICKET_CONFIG.PUBLIC_CATEGORIES.includes(category.toUpperCase());
    const targetRole = isPublic ? TICKET_CONFIG.STAFF_ROLE : TICKET_CONFIG.ADMIN_ROLE;

    let categoryChannel = interaction.guild.channels.cache.find(c => 
      c.name === category.toUpperCase() && c.type === 4
    );
    
    if (!categoryChannel) {
      categoryChannel = await interaction.guild.channels.create({
        name: category.toUpperCase(),
        type: 4,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ['ViewChannel']
          },
          {
            id: targetRole,
            allow: ['ViewChannel', 'ManageChannels']
          }
        ]
      });
    }

    const ticketNumber = getNextTicketNumber();
    const ticketId = `ticket-${ticketNumber}`;
    const channel = await interaction.guild.channels.create({
      name: ticketId,
      type: 0,
      parent: categoryChannel.id,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: ['ViewChannel']
        },
        {
          id: interaction.user.id,
          allow: ['ViewChannel', 'SendMessages']
        },
        {
          id: targetRole,
          allow: ['ViewChannel', 'SendMessages', 'ManageMessages']
        }
      ],
      topic: `Ticket de ${category} - Usuario: ${interaction.user.tag}`
    });

    tickets[ticketId] = {
      user: interaction.user.id,
      category: category,
      description: description,
      created: Date.now(),
      parentCategory: categoryChannel.id
    };

    const embed = new EmbedBuilder()
      .setTitle(`📨 Ticket #${ticketNumber}`)
      .addFields(
        { name: 'Usuario', value: interaction.user.toString(), inline: true },
        { name: 'Categoría', value: category.toUpperCase(), inline: true },
        { name: 'Descripción', value: description }
      )
      .setFooter({ text: 'Lehrer\'s Studio', iconURL: interaction.guild.iconURL() })
      .setColor(0x5865F2);

    const userButton = new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Cerrar Ticket')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔒');

    await channel.send({
      content: `${interaction.user} <@&${targetRole}>`,
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(userButton)]
    });

    const successEmbed = new EmbedBuilder()
      .setTitle('✅ Ticket Creado')
      .setDescription(`Se ha creado un ticket en la categoría **${categoryChannel.name}**.`)
      .addFields(
        { name: 'Categoría', value: categoryChannel.name, inline: true },
        { name: 'Canal', value: channel.toString(), inline: true },
        { name: 'Descripción', value: description }
      )
      .setColor(0x00FF00)
      .setFooter({ text: 'Lehrer\'s Studio', iconURL: interaction.guild.iconURL() });

    await interaction.editReply({ embeds: [successEmbed] });
  }
};