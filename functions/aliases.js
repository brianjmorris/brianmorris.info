// Aliases match complete paths, never arbitrary substrings in unrelated URLs.
const aliases = new Map();
const addAliases = (paths, destination) => {
  for (const alias of paths) aliases.set('/' + alias, destination);
};

const wordAliases = [
  'doc', 'docx', 'docs', 'document', 'documents', 'word', 'ms', 'microsoft', 'office',
  'msword', 'ms-word', 'microsoftword', 'microsoft-word',
  'ms-office', 'microsoft-office', 'office-word', 'ms-office-word', 'microsoft-office-word',
];
const formats = [
  [wordAliases, '/brianmorris.docx', ['doc', 'docx']],
  [['pdf', 'adobe', 'acrobat', 'adobe-acrobat', 'adobe-pdf'], '/brianmorris.pdf', ['pdf']],
  [['json', 'json-resume', 'jsonresume'], '/brianmorris.json', ['json']],
];
for (const [names, destination, extensions] of formats) {
  addAliases(names, destination);
  for (const prefix of ['resume', 'cv']) {
    for (const name of names) {
      addAliases([prefix + '-' + name, name + '-' + prefix, prefix + '/' + name], destination);
    }
    addAliases(extensions.map(extension => prefix + '.' + extension), destination);
  }
}
addAliases(['resume', 'cv'], '/brianmorris.pdf');
addAliases(['contact', 'phone', 'email'], '/#contact');
addAliases(['star', 'stars', 'tree', 'trees', 'sky'], '/#stars');
addAliases(['vcf', 'vcard', 'v-card', 'contact.vcf', 'save-contact'], '/brianmorris.vcf');
addAliases(['profile', 'pic', 'picture', 'photo', 'image', 'face'], '/img/Brian-Morris-Central-Park-Square.jpg');
addAliases(['education', 'school', 'academic'], '/#education');
addAliases(['experience', 'work'], '/#experience');
addAliases(['involvement', 'community', 'volunteer'], '/#community');
addAliases(['skill', 'skills', 'talent', 'knowledge'], '/#skills');
addAliases(['project', 'projects'], '/#projects');
addAliases(['about'], '/#about');
addAliases(['home'], '/');

module.exports = aliases;
