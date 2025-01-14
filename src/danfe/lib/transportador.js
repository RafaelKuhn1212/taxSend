'use strict';

let util = require('util');
let Pessoa = require('./pessoa');

let Transportador = (function() {
    function Transportador() {
        Pessoa.apply(this, arguments);
    }

    util.inherits(Transportador, Pessoa);

    Transportador.prototype.getCodigoAntt = function() {
        return this._codigoAntt || '';
    };

    Transportador.prototype.comCodigoAntt = function(_codigoAntt) {
        if(_codigoAntt) {
            this._codigoAntt = _codigoAntt.toUpperCase();
        }

        return this;
    };

    Transportador.prototype.getPlacaDoVeiculoFormatada = function() {
        if(this.getPlacaDoVeiculo()) {
            return this.getPlacaDoVeiculo().slice(0,3) + '-' + this.getPlacaDoVeiculo().slice(3,7);
        }
        return '';
    };

    Transportador.prototype.getPlacaDoVeiculo = function() {
        return this._placaDoVeiculo || '';
    };

    Transportador.prototype.comPlacaDoVeiculo = function(_placaDoVeiculo) {

        this._placaDoVeiculo = _placaDoVeiculo.toUpperCase();
        return this;
    };

    Transportador.prototype.getUfDaPlacaDoVeiculo = function() {
        return this._ufDaPlacaDoVeiculo || '';
    };

    Transportador.prototype.comUfDaPlacaDoVeiculo = function(_ufDaPlacaDoVeiculo) {
        _ufDaPlacaDoVeiculo = _ufDaPlacaDoVeiculo.toUpperCase();

        this._ufDaPlacaDoVeiculo = _ufDaPlacaDoVeiculo.toUpperCase();
        return this;
    };

    return Transportador;
})();


module.exports = Transportador;
