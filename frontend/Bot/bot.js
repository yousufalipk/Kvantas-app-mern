const { Telegraf, Markup } = require("telegraf");
const TOKEN = "7318708895:AAEX__GIGjueSNYnBi5f4iwgX1rmdE6KzzI";
const bot = new Telegraf(TOKEN);
const express = require("express");
const app = express();
app.use(express.json());
const web_link = "https://kvants.vercel.app";
const community_link = "https://t.me/iarsalmumtaz";

bot.start(async (ctx) => {
	const chatId = ctx.message.chat.id;
	const userId = ctx.message.from.id;
	const startPayload = ctx.startPayload;
	const chatMember = await ctx.getChatMember(chatId, userId);
	if (chatMember?.user?.is_premium) {
		const urlSent = `${web_link}?ref=${startPayload}&isPremium=${true}`;
		console.log(urlSent);
		// const user = ctx.message.from;
		// const userName = user.username ? `@${user.username}` : user.first_name;
		ctx.replyWithMarkdown(`*Hey, Welcome to My Bot!*`, {
			reply_markup: {
				inline_keyboard: [
					[{ text: "👋 Start now!", web_app: { url: urlSent } }],
					[{ text: "Join our Community", url: community_link }],
				],
				in: true,
			},
		});
	} else {
		const urlSent = `${web_link}?ref=${startPayload}&isPremium=${false}`;
		console.log(urlSent);
		// const user = ctx.message.from;
		// const userName = user.username ? `@${user.username}` : user.first_name;
		ctx.replyWithMarkdown(`*Hey, Welcome to My Bot!*`, {
			reply_markup: {
				inline_keyboard: [
					[{ text: "👋 Start now!", web_app: { url: urlSent } }],
					[{ text: "Join our Community", url: community_link }],
				],
				in: true,
			},
		});
	}
});

bot.launch();

app.get("/", (req, res) => {
	res.send("bot is runing");
});

app.listen(3005, () => {
	console.log("server is me and now running");
});
