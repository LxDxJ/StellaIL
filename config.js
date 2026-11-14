// ============================================================
//  STELLA SITE SETTINGS — edit this file, nothing else needed.
//  Replace every "#" with a real link.
// ============================================================
window.STELLA = {
  discordInvite: "https://discord.gg/FrKU2ebJHd",        // your main server invite, e.g. https://discord.gg/xxxx
  addBotLink: "https://discord.com/oauth2/authorize?client_id=1558525761495765047",           // the "Add Stella to your server" OAuth link
  topggLink: "#",            // top.gg page (optional)
  apiBase: "",               // Stella's website API, e.g. https://api.yourdomain (leave empty until it is online)
  contactEmail: "",          // e.g. "hello@yourdomain.com" (leave empty to hide)

  // Payment links from whichever provider you choose (Ko-fi, Patreon, PayPal, Stripe...).
  // Each one is just a URL that opens the checkout.
  pay: {
    oneTime: {
      3: "#",
      5: "#",
      10: "#",
      custom: "#"            // a "pay what you want" link
    },
    monthly: {
      supporter: "#",        // $3 / month
      star: "#",             // $5 / month
      constellation: "#"     // $10 / month
    }
  }
};
