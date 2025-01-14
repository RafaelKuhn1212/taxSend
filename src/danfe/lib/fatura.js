'use strict';

let Fatura = (function() {
    function Fatura() {

    }

    Fatura.prototype.getNumero = function() {
        return this._numero;
    };

    Fatura.prototype.comNumero = function(_numero) {
        this._numero = _numero;
        return this;
    };


    Fatura.prototype.getValorOriginal = function() {
        return this._valorOriginal;
    };

    Fatura.prototype.getValorOriginalFormatado = function() {
        return Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorOriginal() || 0).toString();
    };

    Fatura.prototype.comValorOriginal = function(_valorOriginal) {
        this._valorOriginal = _valorOriginal;
        return this;
    };

    Fatura.prototype.getValorDoDesconto = function() {
        return this._valorDoDesconto;
    };

    Fatura.prototype.getValorDoDescontoFormatado = function() {
        return Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorDoDesconto() || 0).toString();
    };

    Fatura.prototype.comValorDoDesconto = function(_valorDoDesconto) {
        this._valorDoDesconto = _valorDoDesconto;
        return this;
    };

    Fatura.prototype.getValorLiquido = function() {
        return this._valorLiquido;
    };

    Fatura.prototype.getValorLiquidoFormatado = function() {
        return Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorLiquido() || 0).toString();
    };

    Fatura.prototype.comValorLiquido = function(_valorLiquido) {
        this._valorLiquido = _valorLiquido;
        return this;
    };

    return Fatura;
})();

module.exports = Fatura;
