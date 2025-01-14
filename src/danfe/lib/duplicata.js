'use strict';

let Duplicata = (function() {
    function Duplicata() {

    }

    Duplicata.prototype.getNumero1 = function() {
        return this._numero1 || '';
    };

    Duplicata.prototype.comNumero1 = function(_numero1) {
        this._numero1 = _numero1;
        return this;
    };

    Duplicata.prototype.getVencimento1 = function() {
        return this._vencimento1;
    };

    Duplicata.prototype.getVencimentoFormatado1 = function() {
        if(this._vencimento1) {
            return new Intl.DateTimeFormat('pt-BR').format(this._vencimento1);
        }

        return '';
    };

    Duplicata.prototype.comVencimento1 = function(_vencimento1) {
        this._vencimento1 = new Date(_vencimento1);
        return new Intl.DateTimeFormat('pt-BR').format(this._vencimento1);
    };

    Duplicata.prototype.getValor1 = function() {
        return this._valor1;
    };

    Duplicata.prototype.getValorFormatado1 = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this._valor1);
    };

    Duplicata.prototype.comValor1 = function(_valor1) {
        this._valor1 = _valor1;
        return this;
    };

    Duplicata.prototype.getNumero2 = function() {
        return this._numero2 || '';
    };

    Duplicata.prototype.comNumero2 = function(_numero2) {
        this._numero2 = _numero2;
        return this;
    };

    Duplicata.prototype.getVencimento2 = function() {
        return this._vencimento2;
    };

    Duplicata.prototype.getVencimentoFormatado2 = function() {
        if(this._vencimento2) {
            return new Intl.DateTimeFormat('pt-BR').format(this._vencimento2);
        }

        return '';
    };

    Duplicata.prototype.comVencimento2 = function(_vencimento2) {
        this._vencimento2 = new Date(_vencimento2);
        return new Intl.DateTimeFormat('pt-BR').format(this._vencimento2);
    };

    Duplicata.prototype.getValor2 = function() {
        return this._valor2;
    };

    Duplicata.prototype.getValorFormatado2 = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this._valor2);
    };

    Duplicata.prototype.comValor2 = function(_valor2) {
        this._valor2 = _valor2;
        return this;
    };

    Duplicata.prototype.getNumero3 = function() {
        return this._numero3 || '';
    };

    Duplicata.prototype.comNumero3 = function(_numero3) {
        this._numero3 = _numero3;
        return this;
    };

    Duplicata.prototype.getVencimento3 = function() {
        return this._vencimento3;
    };

    Duplicata.prototype.getVencimentoFormatado3 = function() {
        if(this._vencimento3) {
            return new Intl.DateTimeFormat('pt-BR').format(this._vencimento3);
        }

        return '';
    };

    Duplicata.prototype.comVencimento3 = function(_vencimento3) {
        this._vencimento3 = new Date(_vencimento3);
        return new Intl.DateTimeFormat('pt-BR').format(this._vencimento3);
    };

    Duplicata.prototype.getValor3 = function() {
        return this._valor3;
    };

    Duplicata.prototype.getValorFormatado3 = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this._valor3);
    };

    Duplicata.prototype.comValor3 = function(_valor3) {
        this._valor3 = _valor3;
        return this;
    };

    Duplicata.prototype.getNumero4 = function() {
        return this._numero4 || '';
    };

    Duplicata.prototype.comNumero4 = function(_numero4) {
        this._numero4 = _numero4;
        return this;
    };

    Duplicata.prototype.getVencimento4 = function() {
        return this._vencimento4;
    };

    Duplicata.prototype.getVencimentoFormatado4 = function() {
        if(this._vencimento4) {
            return new Intl.DateTimeFormat('pt-BR').format(this._vencimento4);
        }

        return '';
    };

    Duplicata.prototype.comVencimento4 = function(_vencimento4) {
        this._vencimento4 = new Date(_vencimento4);
        return new Intl.DateTimeFormat('pt-BR').format(this._vencimento4);
    };

    Duplicata.prototype.getValor4 = function() {
        return this._valor4;
    };

    Duplicata.prototype.getValorFormatado4 = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this._valor4);
    };

    Duplicata.prototype.comValor4 = function(_valor4) {
        this._valor4 = _valor4;
        return this;
    };

    return Duplicata;
})();

module.exports = Duplicata;
