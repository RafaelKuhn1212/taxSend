'use strict';

let Protocolo = (function() {
    function Protocolo() {

    }

    Protocolo.prototype.getCodigo = function() {
        return this._codigo || '';
    };

    Protocolo.prototype.comCodigo = function(_codigo) {
        this._codigo = _codigo;
        return this;
    };

    Protocolo.prototype.getData = function() {
        return this._data;
    };

    Protocolo.prototype.getDataFormatada = function() {
        if(this.getData()) {
            return formatarData(this._data) + ' ' + formatarHora(this._data);
        }

        return '';
    };

    Protocolo.prototype.comData = function(_data) {
        this._data = _data;
        return this;
    };

    Protocolo.prototype.getFormatacao = function() {
        var resultado = '';

        if(this.getCodigo()) {
            resultado += this.getCodigo();
        }

        if(this.getCodigo() && this.getData()) {
            resultado += ' - ';
        }

        if(this.getData()) {
            resultado += this.getDataFormatada();
        }

        return resultado;
    };

    Protocolo.prototype.getNumero = function() {
        return this._numero;
    };

    Protocolo.prototype.comNumero = function(_numero) {
        this._numero = _numero;
        return this;
    };


    Protocolo.prototype.getValorOriginal = function() {
        return this._valorOriginal;
    };

    Protocolo.prototype.getValorOriginalFormatado = function() {
        return Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorOriginal() || 0).toString();
    };

    Protocolo.prototype.comValorOriginal = function(_valorOriginal) {
        this._valorOriginal = _valorOriginal;
        return this;
    };

    Protocolo.prototype.getValorDoDesconto = function() {
        return this._valorDoDesconto;
    };

    Protocolo.prototype.getValorDoDescontoFormatado = function() {
        return Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorDoDesconto() || 0).toString();
    };

    Protocolo.prototype.comValorDoDesconto = function(_valorDoDesconto) {
        this._valorDoDesconto = _valorDoDesconto;
        return this;
    };

    Protocolo.prototype.getValorLiquido = function() {
        return this._valorLiquido;
    };

    Protocolo.prototype.getValorLiquidoFormatado = function() {
        return Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorLiquido() || 0).toString();
    };

    Protocolo.prototype.comValorLiquido = function(_valorLiquido) {
        this._valorLiquido = _valorLiquido;
        return this;
    };

    Protocolo.prototype.getNumero1 = function() {
        return this._numero1 || '';
    };

    Protocolo.prototype.comNumero1 = function(_numero1) {
        this._numero1 = _numero1;
        return this;
    };

    Protocolo.prototype.getVencimento1 = function() {
        return this._vencimento1;
    };

    Protocolo.prototype.getVencimentoFormatado1 = function() {
        if(this._vencimento1) {
            return formatarData(this._vencimento1);
        }

        return '';
    };

    Protocolo.prototype.comVencimento1 = function(_vencimento1) {
        this._vencimento1 = _vencimento1;
        return this._vencimento1;
    };

    Protocolo.prototype.getValor1 = function() {
        return this._valor1;
    };

    Protocolo.prototype.getValorFormatado1 = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this._valor1);
    };

    Protocolo.prototype.comValor1 = function(_valor1) {
        this._valor1 = _valor1;
        return this;
    };

    Protocolo.prototype.getNumero2 = function() {
        return this._numero2 || '';
    };

    Protocolo.prototype.comNumero2 = function(_numero2) {
        this._numero2 = _numero2;
        return this;
    };

    Protocolo.prototype.getVencimento2 = function() {
        return this._vencimento2;
    };

    Protocolo.prototype.getVencimentoFormatado2 = function() {
        if(this._vencimento2) {
            return formatarData(this._vencimento2);
        }

        return '';
    };

    Protocolo.prototype.comVencimento2 = function(_vencimento2) {
        this._vencimento2 = _vencimento2;
        return this._vencimento2;
    };

    Protocolo.prototype.getValor2 = function() {
        return this._valor2;
    };

    Protocolo.prototype.getValorFormatado2 = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this._valor2);
    };

    Protocolo.prototype.comValor2 = function(_valor2) {
        this._valor2 = _valor2;
        return this;
    };

    Protocolo.prototype.getNumero3 = function() {
        return this._numero3 || '';
    };

    Protocolo.prototype.comNumero3 = function(_numero3) {
        this._numero3 = _numero3;
        return this;
    };

    Protocolo.prototype.getVencimento3 = function() {
        return this._vencimento3;
    };

    Protocolo.prototype.getVencimentoFormatado3 = function() {
        if(this._vencimento3) {

            return formatarData(this._vencimento3);
        }

        return '';
    };

    Protocolo.prototype.comVencimento3 = function(_vencimento3) {
        this._vencimento3 = _vencimento3;
        return this._vencimento3;
    };

    Protocolo.prototype.getValor3 = function() {
        return this._valor3;
    };

    Protocolo.prototype.getValorFormatado3 = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this._valor3);
    };

    Protocolo.prototype.comValor3 = function(_valor3) {
        this._valor3 = _valor3;
        return this;
    };

    Protocolo.prototype.getNumero4 = function() {
        return this._numero4 || '';
    };

    Protocolo.prototype.comNumero4 = function(_numero4) {
        this._numero4 = _numero4;
        return this;
    };

    Protocolo.prototype.getVencimento4 = function() {
        return this._vencimento4;
    };

    Protocolo.prototype.getVencimentoFormatado4 = function() {
        if(this._vencimento4) {
            return formatarData(this._vencimento4);
        }

        return '';
    };

    Protocolo.prototype.comVencimento4 = function(_vencimento4) {
        this._vencimento4 = _vencimento4;
        return this._vencimento4;
    };

    Protocolo.prototype.getValor4 = function() {
        return this._valor4;
    };

    Protocolo.prototype.getValorFormatado4 = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this._valor4);
    };

    Protocolo.prototype.comValor4 = function(_valor4) {
        this._valor4 = _valor4;
        return this;
    };

    function formatarData(data) {
        if (data) {
            let separaDataHora = data.toString().split('T');
            data = separaDataHora[0].split('-');

            return data[2] + '/' + data[1] + '/' + data[0];
        }
        return '';
    }

    function formatarHora(data) {
        if (data) {
            let separaDataHora = data.toString().split('T');
            data = separaDataHora[1].split('-');

            return data[0];
        }
        return '';
    }

    return Protocolo;
})();

module.exports = Protocolo;
