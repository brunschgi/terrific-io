var cfg = require('./config.defaults');

cfg.env = 'production';

cfg.auth.ldap.enable = true;
cfg.auth.ldap.url = 'ldap://ldap1.namics.com:389';
cfg.auth.ldap.adminDn = 'cn=ldapconnect,o=namics';
cfg.auth.ldap.adminPassword = '1dap4u';
cfg.auth.ldap.searchBase = 'o=namics';
cfg.auth.ldap.searchFilter = '(!(|(!(objectClass=dominoPerson))(!(dominocertificate=*))))';

cfg.auth.twitter.enable = true;
cfg.auth.twitter.consumerKey = 'Gy7wIuajjHGpgTJxdbB1eg';
cfg.auth.twitter.consumerSecret = 'ivpsmlkmpUOqWtGYtpiSO2uvO6l7cm4O9xKM2EbzcI';
cfg.auth.twitter.callbackURL = 'http://127.0.0.1:3000/auth/twitter/callback';

module.exports = cfg;
