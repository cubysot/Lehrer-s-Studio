const { 
  SlashCommandBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder 
} = require('discord.js');
const { SOCIAL_MEDIA } = require('../utils/config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('redes')
    .setDescription('Muestra las redes sociales de Lehrer\'s Studio'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🌍 Nuestras Redes Sociales')
      .setDescription('¡Conéctate con nosotros en todas nuestras plataformas!')
      .setColor(0x5865F2)
      .setThumbnail(interaction.guild.iconURL())
      .addFields(
        { name: 'Discord', value: `[Únete aquí](${SOCIAL_MEDIA.DISCORD})`, inline: true },
        { name: 'YouTube', value: `[Suscríbete](${SOCIAL_MEDIA.YOUTUBE})`, inline: true },
        { name: 'Twitter', value: `[Síguenos](${SOCIAL_MEDIA.TWITTER})`, inline: true },
        { name: 'Instagram', value: `[Mira nuestro feed](${SOCIAL_MEDIA.INSTAGRAM})`, inline: true },
        { name: 'TikTok', value: `[Mira nuestros videos](${SOCIAL_MEDIA.TIKTOK})`, inline: true }
      )
      .setFooter({ text: '¡Gracias por tu apoyo!', iconURL: interaction.guild.iconURL() });

    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('Discord')
        .setURL(SOCIAL_MEDIA.DISCORD)
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('YouTube')
        .setURL(SOCIAL_MEDIA.YOUTUBE)
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('Twitter')
        .setURL(SOCIAL_MEDIA.TWITTER)
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('Instagram')
        .setURL(SOCIAL_MEDIA.INSTAGRAM)
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setLabel('TikTok')
        .setURL(SOCIAL_MEDIA.TIKTOK)
        .setStyle(ButtonStyle.Link)
    );

    await interaction.reply({
      embeds: [embed],
      components: [buttons]
    });
  }
};