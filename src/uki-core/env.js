/**
* Copyright (c) 2010 Vladimir Kolesnikov, ukijs
*
* This file was automatically generated from uki source by Facebook.
* @providesModule uki-env
* @option preserve-header
*/

// high level browser objects
exports.root    = global;
exports.doc     = exports.root.document || {};
exports.docElem = exports.doc.documentElement;
exports.nav     = exports.root.navigator || {};
exports.ua      = exports.nav.userAgent || '';

exports.guid = 1;
exports.expando = 'uki' + (+new Date);
