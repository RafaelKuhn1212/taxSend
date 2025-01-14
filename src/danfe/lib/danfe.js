'use strict';

let gammautils = require('gammautils'),
    eDataValida = gammautils.date.isValidDate,
    Impostos = require('./impostos'),
    Emitente = require('./emitente'),
    Destinatario = require('./destinatario'),
    Fatura = require('./fatura'),
    Duplicata = require('./duplicata'),
    Protocolo = require('./protocolo'),
    Transportador = require('./transportador'),
    Volumes = require('./volumes');

let Danfe = (function() {
    function Danfe() {
        this.comOrientacao('retrato');
        this.comEmitente(new Emitente());
        this.comDestinatario(new Destinatario());
        this.comFatura(new Fatura());
        this.comDuplicata(new Duplicata());
        this.comTransportador(new Transportador());
        this.comProtocolo(new Protocolo());
        this.comImpostos(new Impostos());
        this.comVolumes(new Volumes());
        this._itens = [];
        this._duplicatas = [];
    }

    Danfe.prototype.getProtocolo = function() {
        return this._protocolo;
    };

    Danfe.prototype.comProtocolo = function(_protocolo) {
        this._protocolo = _protocolo;
        return this;
    };

    Danfe.prototype.getEmitente = function() {
        return this._emitente;
    };

    Danfe.prototype.comEmitente = function(_emitente) {
        this._emitente = _emitente;
        return this;
    };

    Danfe.prototype.getDestinatario = function() {
        return this._destinatario;
    };

    Danfe.prototype.comDestinatario = function(_destinatario) {
        this._destinatario = _destinatario;
        return this;
    };

    Danfe.prototype.getFatura = function() {
        return this._fatura;
    };

    Danfe.prototype.comFatura = function(_fatura) {
        this._fatura = _fatura;
        return this;
    };

    Danfe.prototype.getDuplicata = function() {
        return this._duplicata;
    };

    Danfe.prototype.comDuplicata = function(_duplicata) {
        this._duplicata = _duplicata;
        return this;
    };

    Danfe.prototype.getTransportador = function() {
        return this._transportador;
    };

    Danfe.prototype.comTransportador = function(_transportador) {
        this._transportador = _transportador;
        return this;
    };

    Danfe.prototype.getImpostos = function() {
        return this._impostos;
    };

    Danfe.prototype.comImpostos = function(_impostos) {
        this._impostos = _impostos;
        return this;
    };

    Danfe.prototype.adicionarItem = function(_item) {
        this._itens.push(_item);
        return this;
    };

    Danfe.prototype.getDuplicatas1 = function() {
        return this._duplicatas1;
    };

    Danfe.prototype.comDuplicatas1 = function(_duplicatas) {
        this._duplicatas1 = _duplicatas;
        return this;
    };

    Danfe.prototype.adicionarDuplicata = function(_duplicata) {

        this._duplicatas.push(_duplicata);
        return this;
    };

    Danfe.prototype.getItens = function() {
        return this._itens;
    };

    Danfe.prototype.comItens = function(_itens) {
        this._itens = _itens;
        return this;
    };

    Danfe.prototype.getInformacoesComplementares = function() {
        return this._informacoesComplementares || '';
    };

    Danfe.prototype.comInformacoesComplementares = function(_informacoesComplementares) {
        console.log('INFO: ', _informacoesComplementares);
        if(!_informacoesComplementares) {
            this._informacoesComplementares = _informacoesComplementares;
            return this;
        }

        this._informacoesComplementares = _informacoesComplementares.toString();
        return this;
    };

    Danfe.prototype.getValorTotalDaNota = function() {
        return this._valorTotalDaNota || 0;
    };

    Danfe.prototype.getValorTotalDaNotaFormatado = function(simbolo) {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorTotalDaNota());
    };

    Danfe.prototype.comValorTotalDaNota = function(_valorTotalDaNota) {
        this._valorTotalDaNota = parseFloat(_valorTotalDaNota);
        return this;
    };

    Danfe.prototype.getValorTotalDosProdutos = function() {
        return this._valorTotalDosProdutos || 0;
    };

    Danfe.prototype.getValorTotalDosProdutosFormatado = function() {
        return new Intl.NumberFormat('pt-BR').format(this.getValorTotalDosProdutos());
    };

    Danfe.prototype.comValorTotalDosProdutos = function(_valorTotalDosProdutos) {
        this._valorTotalDosProdutos = parseFloat(_valorTotalDosProdutos);
        return this;
    };

    Danfe.prototype.getValorTotalDosServicos = function() {
        return this._valorTotalDosServicos || 0;
    };

    Danfe.prototype.getValorTotalDosServicosFormatado = function() {
        return new Intl.NumberFormat('pt-BR').format(this.getValorTotalDosServicos());
    };

    Danfe.prototype.comValorTotalDosServicos = function(_valorTotalDosServicos) {
        this._valorTotalDosServicos = parseFloat(_valorTotalDosServicos);
        return this;
    };

    Danfe.prototype.getOrientacao = function() {
        return this._orientacao;
    };

    Danfe.prototype.comOrientacao = function(_orientacao) {
        if(['retrato', 'paisagem'].indexOf(_orientacao) === -1) {
            throw new Error('Os valores permitidos são as strings "retrato" e "paisagem"');
        }

        this._orientacao = _orientacao;

        return this;
    };

    Danfe.prototype.getInscricaoEstadualDoSubstitutoTributario = function() {
        return this._inscricaoEstadualDoSubstitutoTributario || '';
    };

    Danfe.prototype.comInscricaoEstadualDoSubstitutoTributario = function(_inscricaoEstadualDoSubstitutoTributario) {

        this._inscricaoEstadualDoSubstitutoTributario = _inscricaoEstadualDoSubstitutoTributario;
        return this;
    };

    Danfe.prototype.getValorDoFrete = function() {
        return this._valorDoFrete || 0;
    };

    Danfe.prototype.getValorDoFreteFormatado = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorDoFrete());
    };

    Danfe.prototype.comValorDoFrete = function(_valorDoFrete) {
        this._valorDoFrete = _valorDoFrete;
        return this;
    };

    Danfe.prototype.getValorDoSeguro = function() {
        return this._valorDoSeguro || 0;
    };

    Danfe.prototype.getValorDoSeguroFormatado = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getValorDoSeguro());
    };

    Danfe.prototype.comValorDoSeguro = function(_valorDoSeguro) {
        this._valorDoSeguro = _valorDoSeguro;
        return this;
    };

    Danfe.prototype.getDesconto = function() {
        return this._desconto || 0;
    };

    Danfe.prototype.getDescontoFormatado = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getDesconto());
    };

    Danfe.prototype.comDesconto = function(_desconto) {
        this._desconto = _desconto;
        return this;
    };

    Danfe.prototype.getOutrasDespesas = function() {
        return this._outrasDespesas || 0;
    };

    Danfe.prototype.getOutrasDespesasFormatado = function() {
        return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.getOutrasDespesas());
    };

    Danfe.prototype.comOutrasDespesas = function(_outrasDespesas) {
        this._outrasDespesas = _outrasDespesas;
        return this;
    };

    Danfe.prototype.getTipo = function() {
        return this._tipo;
    };

    Danfe.prototype.getTipoFormatado = function() {
        return this.getTipo();
    };

    Danfe.prototype.comTipo = function(_tipo) {

        this._tipo = _tipo;

        return this;
    };

    Danfe.prototype.getNumero = function() {
        return this._numero;
    };

    Danfe.prototype.getNumeroFormatado = function() {
        if(this.getNumero()) {
            return 'Nº ' + this.getNumero();
        }

        return '';
    };

    Danfe.prototype.comNumero = function(_numero) {
        _numero = parseInt(_numero, 10);

        if(isNaN(_numero)) {
            throw new Error('Não é um número válido. Valor encontrado: ' + _numero);
        }

        if(_numero < 1 || _numero > 999999999) {
            throw new Error('O número deve ser um valor entre 1 e 999.999.999');
        }

        this._numero = _numero;

        return this;
    };

    Danfe.prototype.getSerie = function() {
        return this._serie;
    };

    Danfe.prototype.getSerieFormatada = function() {
        if(this.getSerie()) {
            return 'SÉRIE 00' + this.getSerie();
        }

        return '';
    };

    Danfe.prototype.comSerie = function(_serie) {
        _serie = parseInt(_serie, 10);

        if(isNaN(_serie)) {
            throw new Error('Não é um número válido. Valor encontrado: ' + _serie);
        }

        if(_serie < 1 || _serie > 999) {
            throw new Error('A série deve ser um valor entre 1 e 999');
        }

        this._serie = _serie;

        return this;
    };

    Danfe.prototype.getChaveDeAcesso = function() {
        return this._chaveDeAcesso || '';
    };

    Danfe.prototype.getChaveDeAcessoFormatada = function() {
        return this.getChaveDeAcesso().slice(0, 4) + ' ' + this.getChaveDeAcesso().slice(4, 8) + ' ' + this.getChaveDeAcesso().slice(8, 12) + ' ' + this.getChaveDeAcesso().slice(12, 16) + ' ' + this.getChaveDeAcesso().slice(16, 20) + ' ' + this.getChaveDeAcesso().slice(20, 24) + ' ' + this.getChaveDeAcesso().slice(24, 28) + ' ' + this.getChaveDeAcesso().slice(28, 32) + ' ' + this.getChaveDeAcesso().slice(32, 36) + ' ' + this.getChaveDeAcesso().slice(36, 40) + ' ' + this.getChaveDeAcesso().slice(40, 44);
    };

    Danfe.prototype.comChaveDeAcesso = function(_chaveDeAcesso) {

        this._chaveDeAcesso = _chaveDeAcesso;

        return this;
    };

    Danfe.prototype.getDataDaEmissao = function() {
        return this._dataDaEmissao;
    };

    Danfe.prototype.getDataDaEmissaoFormatada = function() {
        return this._dataDaEmissao
        if(this.getDataDaEmissao()) {
            return formatarData(this._dataDaEmissao);
        }

        return '';
    };

    Danfe.prototype.comDataDaEmissao = function(_dataDaEmissao) {
        this._dataDaEmissao = _dataDaEmissao;
        return this;
    };

    Danfe.prototype.getDataDaEntradaOuSaida = function() {
        return new Date().toISOString();
    };

    Danfe.prototype.getDataDaEntradaOuSaidaFormatada = function() {
        return new Date().toLocaleDateString();

        if(this.getDataDaEntradaOuSaida()) {
            return formatarData(this._dataDaEntradaOuSaida);
        }

        return '';
    };

    Danfe.prototype.getHorarioDaEntradaOuSaida = function() {
        return ((new Date().getHours())-2) + ':' + new Date().getMinutes();

        if(this.getDataDaEntradaOuSaida()) {
            return formatarHora(this._dataDaEntradaOuSaida);
        }

        return '';
    };

    Danfe.prototype.comDataDaEntradaOuSaida = function(_dataDaEntradaOuSaida) {
        return this._dataDaEntradaOuSaida
        this._dataDaEntradaOuSaida = _dataDaEntradaOuSaida;

        return this;
    };

    Danfe.prototype.getVolumes = function() {
        return this._volumes;
    };

    Danfe.prototype.comVolumes = function(_volumes) {
        this._volumes = _volumes;
        return this;
    };

    Danfe.prototype.getModalidadeDoFrete = function() {
        return this._modalidadeDoFrete;
    };

    Danfe.prototype.comModalidadeDoFrete = function(_modalidadeDoFrete) {

        this._modalidadeDoFrete = _modalidadeDoFrete;

        return this;
    };

    Danfe.prototype.getModalidadeDoFreteFormatada = function() {
        return {
            9: '9 - SEM FRETE',
            0: '0 - EMITENTE',
            1: '1 - DESTINATARIO',
            2: '2 - TERCEIROS'
        }[this.getModalidadeDoFrete()] || '';
    };

    Danfe.prototype.getNaturezaDaOperacao = function() {
        return this._naturezaDaOperacao || '';
    };

    Danfe.prototype.comNaturezaDaOperacao = function(_naturezaDaOperacao) {
        this._naturezaDaOperacao = _naturezaDaOperacao;
        return this;
    };

    function formatarData(data) {
        return data
        if (data) {
            let separaDataHora = data.toString().split('T');
            data = separaDataHora[0].split('-');

            return data[2] + '/' + data[1] + '/' + data[0];
        }
        return '';
    }
    // Data is Date
    function formatarHora(data) {

        return new Date(data).getHours() + ':' + new Date(data).getMinutes();
        if (data) {
            let separaDataHora = data.toString().split('T');
            data = separaDataHora[1].split('-');

            return data[0];
        }
        return '';
    }

    return Danfe;
})();

module.exports = Danfe;
