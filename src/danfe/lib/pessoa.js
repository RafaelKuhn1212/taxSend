'use strict';

let Endereco = require('./endereco');

let Pessoa = (function() {
    function Pessoa() {
        this.comEndereco(new Endereco());
    }

    Pessoa.prototype.getNome = function() {
        return this._nome || '';
    };

    Pessoa.prototype.comNome = function(_nome) {
        this._nome = _nome;
        return this;
    };

    Pessoa.prototype.getRegistroNacional = function() {
        return this._registroNacional || '';
    };

    Pessoa.prototype.getRegistroNacionalFormatado = function() {
        return this.getRegistroNacional().slice(0,2) +  '.' + this.getRegistroNacional().slice(2,5) +  '.' + this.getRegistroNacional().slice(5,8) +  '/' + this.getRegistroNacional().slice(8,12) +  '-' + this.getRegistroNacional().slice(12,14);
    };

    Pessoa.prototype.comRegistroNacional = function(_registroNacional) {

        this._registroNacional = _registroNacional;
        return this;
    };

    Pessoa.prototype.getEndereco = function() {
        return this._endereco;
    };

    Pessoa.prototype.comEndereco = function(_endereco) {
        this._endereco = _endereco;
        return this;
    };

    Pessoa.prototype.getInscricaoEstadual = function() {
        return this._inscricaoEstadual || '';
    };

    Pessoa.prototype.comInscricaoEstadual = function(_inscricaoEstadual) {

        this._inscricaoEstadual = _inscricaoEstadual;
        return this;
    };

    Pessoa.prototype.getTelefone = function() {
        return this._telefone || '';
    };

    Pessoa.prototype.getTelefoneFormatado = function() {
        if (this.getTelefone().length === 10) {
            return '(' + this.getTelefone().slice(0,2) + ') ' + this.getTelefone().slice(2,6)  + '-' + this.getTelefone().slice(6,10);
        }

        else if (this.getTelefone().length === 11) {
            return '(' + this.getTelefone().slice(0,2) + ') ' + this.getTelefone().slice(2,7)  + '-' + this.getTelefone().slice(7,11);
        } else {
            return this.getTelefone();
        }
    };

    Pessoa.prototype.comTelefone = function(_telefone) {

        this._telefone = _telefone;
        return this;
    };

    Pessoa.prototype.getEmail = function() {
        return this._email || '';
    };

    Pessoa.prototype.comEmail = function(_email) {

        this._email = _email;
        return this;
    };

    return Pessoa;
})();

module.exports = Pessoa;
