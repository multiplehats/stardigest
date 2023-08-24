import { DISCORD_WEBHOOK_ID, DISCORD_WEBHOOK_TOKEN } from '$env/static/private';
import { APP_NAME } from '$lib/config/constants';
import { DiscordNotifierService } from '$lib/services/discord/discord-notifier.service';

export const discordNotify = new DiscordNotifierService({
	webhookId: DISCORD_WEBHOOK_ID,
	webhookToken: DISCORD_WEBHOOK_TOKEN,
	name: `${APP_NAME} - Notifier`,
	iconUrl: null
});
