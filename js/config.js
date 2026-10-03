/* ============================================================
   config.js — the settings Dr Mompel changes by hand. Nothing here is generated.
   ============================================================ */
window.WUL_CONFIG = {

  /* Where a signed-in student's work is saved, and where their homework is read from: the labs'
     own Apps Script, the same /exec address as the Biology Hub's js/local.js and Bio English
     Lab's js/config.js. One spreadsheet, one teacher page and one homework list serve the labs,
     Bio English Lab and this site; this site's work lands in its "📝 Write-Up Lab" tab. Leave it
     empty and the site still works: progress stays in the browser and no homework is shown. */
  submitUrl: 'https://script.google.com/macros/s/AKfycbzwjMHaa88OL_GzR8wZ2mV6a8rs1CKYahbW5iOTQPyzWzCGIrAZPApGsP2oujK34tRc/exec',

  /* The same Google sign-in as the Biology Hub and every lab, so a student signed in there is
     signed in here. A Client ID is a name-tag for the app, not a secret. */
  googleClientId: '749068441640-jgh9s0rbg8ed9hl14mtv6kdhg5jg6ddf.apps.googleusercontent.com'
};
