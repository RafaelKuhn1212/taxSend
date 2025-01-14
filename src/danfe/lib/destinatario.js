'use strict';

let util = require('util');
let Pessoa = require('./pessoa');

let Destinatario = (function() {
    function Destinatario() {
        Pessoa.apply(this, arguments);
    }

    util.inherits(Destinatario, Pessoa);

    return Destinatario;
})();


module.exports = Destinatario;
