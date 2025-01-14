'use strict';

let Impostos = (function() {
    function Impostos() {

    }

    Impostos.prototype.getBaseDeCalculoDoIcms = function() {
        return this._baseDeCalculoDoIcms || 0;
    };

    Impostos.prototype.getBaseDeCalculoDoIcmsFormatada = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getBaseDeCalculoDoIcms());
    };

    Impostos.prototype.comBaseDeCalculoDoIcms = function(_baseDeCalculoDoIcms) {
        this._baseDeCalculoDoIcms = _baseDeCalculoDoIcms;
        return this;
    };

    Impostos.prototype.getValorDoIcms = function() {
        return this._valorDoIcms || 0;
    };

    Impostos.prototype.getValorDoIcmsFormatado = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorDoIcms());
    };

    Impostos.prototype.comValorDoIcms = function(_valorDoIcms) {
        this._valorDoIcms = _valorDoIcms;
        return this;
    };

    Impostos.prototype.getBaseDeCalculoDoIcmsSt = function() {
        return this._baseDeCalculoDoIcmsSt || 0;
    };

    Impostos.prototype.getBaseDeCalculoDoIcmsStFormatada = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getBaseDeCalculoDoIcmsSt());
    };

    Impostos.prototype.comBaseDeCalculoDoIcmsSt = function(_baseDeCalculoDoIcmsSt) {
        this._baseDeCalculoDoIcmsSt = _baseDeCalculoDoIcmsSt;
        return this;
    };

    Impostos.prototype.getValorDoIcmsSt = function() {
        return this._ValorDoIcmsSt || 0;
    };

    Impostos.prototype.getValorDoIcmsStFormatado = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorDoIcmsSt());
    };

    Impostos.prototype.comValorDoIcmsSt = function(_ValorDoIcmsSt) {
        this._ValorDoIcmsSt = _ValorDoIcmsSt;
        return this;
    };

    Impostos.prototype.getValorDoImpostoDeImportacao = function() {
        return this._valorDoImpostoDeImportacao || 0;
    };

    Impostos.prototype.getValorDoImpostoDeImportacaoFormatado = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorDoImpostoDeImportacao());
    };

    Impostos.prototype.comValorDoImpostoDeImportacao = function(_valorDoImpostoDeImportacao) {
        this._valorDoImpostoDeImportacao = _valorDoImpostoDeImportacao;
        return this;
    };

    Impostos.prototype.getValorDoPis = function() {
        return this._valorDoPis || 0;
    };

    Impostos.prototype.getValorDoPisFormatado = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorDoPis());
    };

    Impostos.prototype.comValorDoPis = function(_valorDoPis) {
        this._valorDoPis = _valorDoPis;
        return this;
    };

    Impostos.prototype.getValorTotalDoIpi = function() {
        return this._valorTotalDoIpi || 0;
    };

    Impostos.prototype.getValorTotalDoIpiFormatado = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorTotalDoIpi());
    };

    Impostos.prototype.comValorTotalDoIpi = function(_valorTotalDoIpi) {
        this._valorTotalDoIpi = _valorTotalDoIpi;
        return this;
    };

    Impostos.prototype.getValorDaCofins = function() {
        return this._valorDaCofins || 0;
    };

    Impostos.prototype.getValorDaCofinsFormatado = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorDaCofins());
    };

    Impostos.prototype.comValorDaCofins = function(_valorDaCofins) {
        this._valorDaCofins = _valorDaCofins;
        return this;
    };

    Impostos.prototype.getValorTotalDosProdutos = function() {
        return this._valorTotalDosProdutos || 0;
    };

    Impostos.prototype.getValorTotalDosProdutosFormatado = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorTotalDosProdutos());
    };

    Impostos.prototype.comValorTotalDosProdutos = function(_valorTotalDosProdutos) {
        this._valorTotalDosProdutos = _valorTotalDosProdutos;
        return this;
    };

    return Impostos;
})();

module.exports = Impostos;
