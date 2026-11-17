// ============================================================
//  STELLA SITE SETTINGS — edit this file, nothing else needed.
//  Replace every "#" with a real link.
// ============================================================
window.STELLA = {
  discordInvite: "https://discord.gg/FrKU2ebJHd",        // your main server invite, e.g. https://discord.gg/xxxx
  addBotLink: "https://discord.com/oauth2/authorize?client_id=1558525761495765047",           // the "Add Stella to your server" OAuth link
  topggLink: "https://top.gg/bot/1558525761495765047",            // top.gg page
  voteLink: "https://top.gg/bot/1558525761495765047/vote",     // top.gg vote page
  appBase: "https://stellacardbot.apps.bot-hosting.cloud",   // where Stats and My Stella (logged-in pages) are served
  contactEmail: "",          // e.g. "hello@yourdomain.com" (leave empty to hide)

  // Payments. PayPal is the main option, Ko-fi sits next to it. Leave a value empty ("") until it exists:
  // its button then shows "Coming soon".
  paypal: {
    me: "",                  // your PayPal.me name, e.g. "stellabot" (paypal.me/stellabot): one-time amounts use it
    monthly: {               // PayPal subscription links (create three plans in PayPal, paste each link here)
      supporter: "",         // $3 / month
      star: "",              // $5 / month
      constellation: ""      // $10 / month
    }
  },
  kofi: {
    page: "",                // e.g. "https://ko-fi.com/yourname" (one-time donations)
    tiers: ""                // e.g. "https://ko-fi.com/yourname/tiers" (monthly memberships); empty = page + "/tiers"
  }
};
