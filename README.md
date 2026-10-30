# brianmorris.info

Local backup copies use a `.bak` suffix after the full filename, for example
`home.ejs.bak` or `stars-2026-07-07.js.bak`. These copies are excluded from Git
and Firebase deployments. Use Git commits and branches for shared history.

The generated bundles in `public/js/` and `public/style/` remain tracked.
Run `npm run build` after changing JavaScript or SCSS and include the updated
bundles in the same commit. Firebase deployment exclusions omit local backups,
source maps, and debug logs; the Functions upload also excludes tests, coverage,
and ESLint configuration.

URL shortcuts are listed in `functions/index.js` and match complete paths.
Word aliases such as `/doc`, `/docx`, `/word`, `/ms-word`, and `/microsoft-word`
open the DOCX résumé. `/resume` and `/cv` default to PDF; format-specific paths
such as `/resume.docx`, `/resume/pdf`, and `/resume-json` select a format.
Aliases accept case, accents, spaces, underscores, and trailing-slash variants.
Contact, section, vCard, profile, and stars shortcuts are also supported.
Unknown paths return HTTP 404 rather than redirecting to an unrelated resource.

* Hosted with [Firebase](https://firebase.com "Visit firebase.com") and [NodeJS](https://nodejs.org "Visit nodejs.org")
* Built with [EJS](https://ejs.co/ "Visit ejs.co") and [SASS](https://sass-lang.com/ "Visit sass-lang.com")
* Background created with HTML5 canvas and JS
<br />

[View](https://brianmorris.info "Visit brianmorris.info")
