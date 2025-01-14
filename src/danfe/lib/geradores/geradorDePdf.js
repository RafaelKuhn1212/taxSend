'use strict';

let path = require('path'),
    gammautils = require('gammautils'),
    barcode = gammautils.barcode,
    merge = gammautils.object.merge,
    Pdf = require('pdfkit'),

    diretorioDeFontes = path.join(__dirname, './fontes'),
    timesNewRoman = path.join(diretorioDeFontes, 'Times New Roman.ttf'),
    timesNewRomanNegrito = path.join(diretorioDeFontes, 'Times New Roman Bold.ttf'),
    timesNewRomanItalico = path.join(diretorioDeFontes, 'Times New Roman Italic.ttf'),
    timesNewRomanNegritoItalico = path.join(diretorioDeFontes, 'Times New Roman Bold Italic.ttf');

let pdfDefaults = {
    ajusteY: 0,
    ajusteX: 0,
    autor: '',
    titulo: '',
    criador: '',

    tamanhoDaFonteDoTitulo: 5,
    corDoTitulo: 'black',
    alinhamentoDoTitulo: 'left',
    alinhamentoDoTituloDaTabela: 'center',

    tamanhoDaFonteDaSecao: 7,
    corDaSecao: 'black',

    tamanhoDaFonteDoCampo: 7,
    alinhamentoDoCampo: 'center',
    corDoCampo: 'black',

    tamanhoDaFonteDosItens: 7,
    separadorDeItens: true,

    ajusteYDoLogotipo: 0,
    ajusteYDaIdentificacaoDoEmitente: 0,

    ambiente: 'producao',
    opacidadeDaHomologacao: 0.2,
    ajusteYDaHomologacao: 275,

    tamanhoDoCodigoDeBarras: 32,
    corDoLayout: 'black',
    larguraDaPagina: 595.28,
    alturaDaPagina: 841.89,
    size: 'A4',
    creditos: ''
};

module.exports = function(danfe, args, callback) {
    if(typeof args === 'function') {
        callback = args;
        args = pdfDefaults;
    }

    args = merge(pdfDefaults, args);

    let page = 0;
    let ajusteCabecalho = 0;

    let emitente = danfe.getEmitente(),
        destinatario = danfe.getDestinatario(),
        transportador = danfe.getTransportador(),
        impostos = danfe.getImpostos(),
        volumes = danfe.getVolumes(),
        protocolo = danfe.getProtocolo(),
        fatura = danfe.getProtocolo(),
        duplicata = danfe.getProtocolo(),
        itens = danfe.getItens(),
        // fatura = danfe.getFatura(),
        alturaDoBlocoFaturaDuplicatas = 0,
        // duplicata = danfe.getDuplicata(),
        pdf = new Pdf({
            bufferPages: true,
            margin: 28.34,
            size: [
                args.larguraDaPagina,
                args.alturaDaPagina
            ],
            info: {
                Author: args.autor,
                Title: args.titulo,
                Creator: args.criador,
                Producer: 'http://github.com/brasil-js/danfe'
            }
        }),
        pdfTemporario = new Pdf({
            //TODO: Verificar se a criação deste pdf temporario
            //      está causando problemas de performance
            margin: 0,
            size: 'A4'
        });

    if(args.stream) {
        pdf.pipe(args.stream);
    }

    pdf.registerFont('normal', timesNewRoman);
    pdf.registerFont('negrito', timesNewRomanNegrito);
    pdf.registerFont('italico', timesNewRomanItalico);
    pdf.registerFont('negrito-italico', timesNewRomanNegritoItalico);
    pdf.registerFont('codigoDeBarras', barcode.code128.font);
    pdfTemporario.registerFont('normal', timesNewRoman);

    ///////// LAYOUT

    let grossuraDaLinha = 0.5,
        margemTopo = 28.34,
        margemEsquerda = 28.34,
        margemDireita = 566.94,
        larguraDoFormulario = margemDireita - margemEsquerda;

    let alturaInicialDoQuadroDeItens;
    let maximaAlturaItem = 782;

    pdf.lineWidth(grossuraDaLinha);

    function linhaHorizontal(x1, x2, y, cor) {
        y = margemTopo + args.ajusteY + y;
        x1 = margemEsquerda + args.ajusteX + x1;
        x2 = margemDireita + args.ajusteX + x2;

        return pdf.moveTo(x1, y).lineTo(x2, y).stroke().strokeColor('black');
    }

    function linhaHorizontalTracejada(x1, x2, y) {
        y = margemTopo + args.ajusteY + y;
        x1 = margemEsquerda + args.ajusteX + x1;
        x2 = margemDireita + args.ajusteX + x2;

        return pdf.moveTo(x1, y).lineTo(x2, y).dash(3, { space: 5 }).stroke();
    }

    function linhaVertical(y1, y2, x, cor) {
        x = margemEsquerda + args.ajusteX + x;
        y1 = margemTopo + args.ajusteY + y1;
        y2 = margemTopo + args.ajusteY + y2;

        return pdf.moveTo(x, y1).lineTo(x, y2).stroke().strokeColor('black');
    }

    function secao(string, x, y, largura, alinhamento, tamanho) {
        string = string || '';

        x = margemEsquerda + args.ajusteX + x;
        y = margemTopo + args.ajusteY + y;
        pdf.font('negrito')
            .fillColor(args.corDaSecao)
            .fontSize(tamanho || args.tamanhoDaFonteDaSecao)
            .text(string.toUpperCase(), x, y, {
                width: largura,
                align: 'left'
            });
    }

    function titulo(string, x, y, largura, alinhamento, tamanho) {
        string = typeof string !== 'undefined' && string !== null && string.toString() || '';

        x = margemEsquerda + args.ajusteX + x;
        y = margemTopo + args.ajusteY + y;

        pdf.font('normal')
            .fillColor(args.corDoTitulo)
            .fontSize(tamanho || args.tamanhoDaFonteDoTitulo)
            .text(string.toUpperCase(), x, y, {
                width: largura,
                align: alinhamento || args.alinhamentoDoTitulo
            });
    }

    function normal(string, x, y, largura, alinhamento, tamanho, _pdf) {
        string = string || '';

        (_pdf || pdf).font('normal')
            .fillColor(args.corDoTitulo)
            .fontSize(tamanho || 8)
            .text(string,
                margemEsquerda + args.ajusteX + x,
                margemTopo + args.ajusteY + y, {
                width: largura,
                align: alinhamento || 'center',
                lineGap: -1.5
            });
    }

    function italico(string, x, y, largura, alinhamento, tamanho) {
        string = string || '';

        pdf.font('italico')
            .fillColor(args.corDoTitulo)
            .fontSize(tamanho || 6)
            .text(string,
                margemEsquerda + args.ajusteX + x,
                margemTopo + args.ajusteY + y, {
                width: largura,
                align: alinhamento || 'center',
                lineGap: -1.5
            });
    }

    function negrito(string, x, y, largura, alinhamento, tamanho) {
        string = string || '';

        pdf.font('negrito')
            .fillColor(args.corDoTitulo)
            .fontSize(tamanho || 6)
            .text(string,
                margemEsquerda + args.ajusteX + x,
                margemTopo + args.ajusteY + y, {
                width: largura,
                align: alinhamento || 'center',
                lineGap: -1.5
            });
    }

    function campo(string, x, y, largura, alinhamento, tamanho) {

        pdf.font('negrito')
            .fillColor(args.corDoCampo)
            .fontSize(tamanho || args.tamanhoDaFonteDoCampo)
            .text(string,
                margemEsquerda + args.ajusteX + x,
                margemTopo + args.ajusteY + y, {
                width: largura,
                align: alinhamento || args.alinhamentoDoCampo
            });
    }

    function retangulo(x, y, largura, altura) {
        pdf.rect(x + 28.34, y + 28.34, largura, altura);
    }

    function retanguloCinza(x, y, largura, altura) {
        pdf.rect(x + 28.34, y + 28.34, largura, altura)
           .fillAndStroke('#cdcdcd', '#000000');
    }

    function preencheCinza(x, y, largura, altura) {
        pdf.rect(x + 28.34, y + 28.34, largura, altura)
           .fillAndStroke('#cdcdcd', '#cdcdcd');
    }

    function retanguloBranco(x, y, largura, altura) {
        pdf.rect(x + 28.34, y + 28.34, largura, altura)
           .fillAndStroke('#ffffff', '#000000');
    }

    function desenharPagina() {
        if (page === 0) {
            //RECIBO
            linhaHorizontal(0, 0, 0);
            linhaHorizontal(0, -68, 17);
            linhaHorizontal(0, 0, 39.67);

            linhaVertical(0, 39.67, 0);
            linhaVertical(17, 39.67, 70.85);
            linhaVertical(0, 39.67, 470);
            linhaVertical(0, 39.67, larguraDoFormulario);
            normal([
                'Recebemos de',
                emitente.getNome(),
                'os produtos e/ou serviços constantes da nota',
                'fiscal eletrônica indicada abaixo.'
            ].join(' ').toUpperCase(), 1.5, 3, 420, 'left', 5);

            normal([
                'Emissão:',
                danfe.getDataDaEmissaoFormatada(),
                '- Destinatário:',
                destinatario.getNome(),
                '- Valor Total:',
                danfe.getValorTotalDaNotaFormatado()
            ].join(' ').toUpperCase(), 2, 10, 467, 'center', 6);

            normal('NF-e', 460, 1.8, 93, 'center', 12);
            negrito(danfe.getNumeroFormatado(), 460, 15, 93, 'center', 10);
            normal(danfe.getSerieFormatada(), 460, 26, 93, 'center', 10);
            titulo('DATA DE RECEBIMENTO', 2, 19, 97);
            titulo('IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR', 72, 19, 374);
        }

        // PRIMEIRO BLOCO

        // EMITENTE
        linhaHorizontal(0, 0, 51 + ajusteCabecalho);
        linhaHorizontal(300, 0, 85 + ajusteCabecalho);
        linhaHorizontal(300, 0, 107 + ajusteCabecalho);
        linhaHorizontal(0, 0, 130.36 + ajusteCabecalho);
        linhaHorizontal(0, 0, 153 + ajusteCabecalho);
        linhaHorizontal(0, 0, 172.87 + ajusteCabecalho);

        linhaVertical(51 + ajusteCabecalho, 172.87 + ajusteCabecalho, 0);
        linhaVertical(51 + ajusteCabecalho, 130.36 + ajusteCabecalho, 189.88);
        linhaVertical(51 + ajusteCabecalho, 153 + ajusteCabecalho, 300.4);
        linhaVertical(51 + ajusteCabecalho, 172.87 + ajusteCabecalho, 538.6);
        linhaVertical(153 + ajusteCabecalho, 172.87 + ajusteCabecalho, 172.87);
        linhaVertical(153 + ajusteCabecalho, 172.87 + ajusteCabecalho, 345.74);


        //QUADRADO DO TIPO (ENTRADA OU SAIDA)
        linhaHorizontal(266.39, -255, 87.85 + ajusteCabecalho);
        linhaVertical(87.85 + ajusteCabecalho, 104.85 + ajusteCabecalho, 266.39);
        linhaHorizontal(266.39, -255, 104.85 + ajusteCabecalho);
        linhaVertical(87.85 + ajusteCabecalho, 104.85 + ajusteCabecalho, 283.4);


        normal('IDENTIFICAÇÃO DO EMITENTE', 2, 52 + ajusteCabecalho, 238, 'left', 5);

        let temLogotipo = emitente.getLogotipo(),
            identificacaoDoEmitenteY = 86 + ajusteCabecalho,
            identificacaoDoEmitenteX = 2,
            identificacaoDoEmitenteLargura = 190,
            identificacaoDoEmitenteFonte = 1.5;

        if(temLogotipo) {
            let caminhoDoLogotipo = emitente.getLogotipo();
            pdf.image(caminhoDoLogotipo, 92.34, 92.34 + ajusteCabecalho, {
                fit: [60, 60]
            });
        }

        negrito(emitente.getNome(), identificacaoDoEmitenteX, identificacaoDoEmitenteY + args.ajusteYDaIdentificacaoDoEmitente, identificacaoDoEmitenteLargura, 'center', 8 + identificacaoDoEmitenteFonte);

        if(emitente.getEndereco().getPrimeiraLinha()) {
            normal(emitente.getEndereco().getPrimeiraLinha(),
                identificacaoDoEmitenteX,
                pdf.y - margemTopo + 2,
            identificacaoDoEmitenteLargura, 'center', 5 + identificacaoDoEmitenteFonte);
        }

        if(emitente.getEndereco().getSegundaLinha()) {
            normal(emitente.getEndereco().getSegundaLinha(),
                identificacaoDoEmitenteX,
                pdf.y - margemTopo,
            identificacaoDoEmitenteLargura, 'center', 5 + identificacaoDoEmitenteFonte);
        }

        let jaAdicionouEspacamento = false;

        if(emitente.getTelefone()) {
            jaAdicionouEspacamento = true;

            normal('Telefone: ' + emitente.getTelefoneFormatado(),
                identificacaoDoEmitenteX,
                pdf.y - margemTopo + 2,
            identificacaoDoEmitenteLargura, 'center', 5 + identificacaoDoEmitenteFonte);
        }

        if(emitente.getEmail()) {
            normal('Email: ' + emitente.getEmail(),
                identificacaoDoEmitenteX,
                pdf.y - margemTopo + (jaAdicionouEspacamento ? 0 : 2),
            identificacaoDoEmitenteLargura, 'center', 5 + identificacaoDoEmitenteFonte);
        }


        titulo('DANFE', 200, 55 + ajusteCabecalho, 97, 'center', 12);
        normal('DOCUMENTO AUXILIAR DA NOTA FISCAL ELETRÔNICA', 200, 70 + ajusteCabecalho, 97, 'center', 6.5);
        normal('Consulta de autenticidade no portal nacional da NF-e \n www.nfe.fazenda.gov.br/portal\n ou no site da Sefaz Autorizadora', 302, 86 + ajusteCabecalho, 212, 'center', 6);

        normal('0 - ENTRADA', 210, 87 + ajusteCabecalho, 99.5, 'left');
        normal('1 - SAÍDA', 210, 95.5 + ajusteCabecalho, 99.5, 'left');
        negrito(danfe.getTipoFormatado(), 270, 88 + ajusteCabecalho, 12.5, 'center', 14);
        //negrito(page, 270, 88 + ajusteCabecalho, 12.5, 'left', 14);

        negrito(danfe.getNumeroFormatado(), 200, 107 + ajusteCabecalho, 98.5, 'left', 9);
        normal(danfe.getSerieFormatada(), 200, 117 + ajusteCabecalho, 98.5, 'center', 9);


        let codigoDeBarrasCodificado = barcode.code128.encode(danfe.getChaveDeAcesso());
        if(danfe.getChaveDeAcesso()) {
            pdf.font('codigoDeBarras')
                .fontSize(args.tamanhoDoCodigoDeBarras)
                .text(codigoDeBarrasCodificado, 323.23, 80 + ajusteCabecalho, {
                    align: 'center',
                    width: 250
                });
        }

        titulo('CHAVE DE ACESSO', 302, 107.5 + ajusteCabecalho, 244);
        campo(danfe.getChaveDeAcessoFormatada(), 302, 114 + ajusteCabecalho, 218.68);

        if(protocolo.getFormatacao()) {
            titulo('PROTOCOLO DE AUTORIZAÇÃO DE USO', 302, 132 + ajusteCabecalho, 244);
            campo(protocolo.getFormatacao(), 302, 138 + ajusteCabecalho, 218.68, 'left');
        }

        titulo('NATUREZA DA OPERAÇÃO', 2, 132 + ajusteCabecalho, 338);
        campo(danfe.getNaturezaDaOperacao(), 2, 138 + ajusteCabecalho, 300.4, 'left');

        titulo('INSCRIÇÃO ESTADUAL', 2, 154 + ajusteCabecalho, 192.5);
        campo(emitente.getInscricaoEstadual(), 2, 161 + ajusteCabecalho, 172.87, 'left');

        titulo('INSCRIÇÃO ESTADUAL DO SUBST. TRIBUT.', 174, 154 + ajusteCabecalho, 192.5);
        campo(danfe.getInscricaoEstadualDoSubstitutoTributario(), 174, 161, 172.87, 'left');

        titulo('CNPJ', 348, 154 + ajusteCabecalho, 192.5);
        campo(emitente.getRegistroNacionalFormatado(), 348, 161 + ajusteCabecalho, 172.87, 'left');

        if (page === 0) {
            //DESTINATARIO
            const ajusteDestinatario = -11.336
            linhaHorizontal(0, 0, 195.53 + ajusteDestinatario);
            linhaHorizontal(0, 0, 215.33 + ajusteDestinatario);
            linhaHorizontal(0, 0, 235.33 + ajusteDestinatario);
            linhaHorizontal(0, 0, 255.33 + ajusteDestinatario);

            linhaVertical(195.53 + ajusteDestinatario, 255.33 + ajusteDestinatario, 0);
            linhaVertical(195.53 + ajusteDestinatario, 215.33 + ajusteDestinatario, 357.1);
            linhaVertical(215.33 + ajusteDestinatario, 255.33 + ajusteDestinatario, 274.9);
            linhaVertical(235.33 + ajusteDestinatario, 255.33 + ajusteDestinatario, 297.6);
            linhaVertical(215.33 + ajusteDestinatario, 255.33 + ajusteDestinatario, 396.75);
            linhaVertical(195.53 + ajusteDestinatario, 255.33 + ajusteDestinatario, 485);
            linhaVertical(195.53 + ajusteDestinatario, 255.33 + ajusteDestinatario, larguraDoFormulario);

            secao('DESTINATÁRIO / REMETENTE', 1.5, 188.33 + ajusteDestinatario);
            titulo('NOME / RAZÃO SOCIAL', 1.5, 196.33 + ajusteDestinatario, 353.5);
            campo(destinatario.getNome(), 1.5, 204.33 + ajusteDestinatario, 353.5, 'left');

            titulo('CNPJ / CPF', 358, 196.33 + ajusteDestinatario, 133.5);
            campo(destinatario.getRegistroNacionalFormatado(), 358, 204.33 + ajusteDestinatario, 133.5, 'left');

            titulo('DATA DA EMISSÃO', 487, 196.33 + ajusteDestinatario, 90);
            campo(danfe.getDataDaEmissaoFormatada(), 487, 204.33 + ajusteDestinatario, 90, 'left');

            titulo('ENDEREÇO', 1.5, 216.33 + ajusteDestinatario, 272);
            campo(destinatario.getEndereco().getPrimeiraLinha(), 1.5, 224.33 + ajusteDestinatario, 272, 'left', args.tamanhoDaFonteDoCampo - 0.5);

            titulo('BAIRRO / DISTRITO', 276, 216.33 + ajusteDestinatario, 119);
            campo(destinatario.getEndereco().getBairro(), 276, 224.33 + ajusteDestinatario, 119, 'left');

            titulo('CEP', 398, 216.33 + ajusteDestinatario, 93);
            campo(destinatario.getEndereco().getCepFormatado(), 398, 224.33 + ajusteDestinatario, 93);

            titulo('DATA DA SAÍDA', 487, 216.33 + ajusteDestinatario, 90);
            campo(danfe.getDataDaEntradaOuSaidaFormatada(), 487, 224.33 + ajusteDestinatario, 90, 'left');

            titulo('MUNICÍPIO', 1.5, 236.33 + ajusteDestinatario, 272);
            campo(destinatario.getEndereco().getMunicipio(), 1.5, 244.33 + ajusteDestinatario, 272, 'left');

            titulo('UF', 276, 236.33 + ajusteDestinatario, 20);
            campo(destinatario.getEndereco().getUf(), 276, 244.33 + ajusteDestinatario, 20);

            titulo('FONE / FAX', 299, 236.33 + ajusteDestinatario, 96);
            campo(destinatario.getTelefoneFormatado(), 299, 244.33 + ajusteDestinatario, 96, 'left');

            titulo('INSCRIÇÃO ESTADUAL', 398, 236.33 + ajusteDestinatario, 93);
            campo(destinatario.getInscricaoEstadual(), 398, 244.33 + ajusteDestinatario, 93, 'left');

            titulo('HORA DA SAÍDA', 487, 236.33 + ajusteDestinatario, 90);
            campo(danfe.getHorarioDaEntradaOuSaida(), 487, 244.33 + ajusteDestinatario, 90, 'left');


            // FATURA
            const ajusteFatura = 0;
            const ajusteDuplicata = 2;
            retanguloBranco(0, 255 + ajusteFatura, larguraDoFormulario, 22.67);
            retanguloBranco(0, 286 + ajusteDuplicata, larguraDoFormulario, 22.67);
            retanguloCinza(0, 255 + ajusteFatura, larguraDoFormulario, 7.5);
            retanguloCinza(0, 286 + ajusteDuplicata, larguraDoFormulario, 7.5);
            secao('FATURA', 1.5, 248 + ajusteFatura);
            normal('NÚMERO', 153, 256 + ajusteFatura, 85, 'center', 6);
            normal('VALOR ORIGINAL', 240, 256 + ajusteFatura, 105, 'center', 6);
            normal('VALOR DESCONTO', 346, 256 + ajusteFatura, 76, 'center', 6);
            normal('VALOR LÍQUIDO', 425, 256 + ajusteFatura, 90, 'center', 6);

            campo('DADOS DA FATURA', 1.5, 268 + ajusteFatura, 100, 'left', 6);
            campo(fatura.getNumero(), 153, 268 + ajusteFatura, 85, 'center', 6);
            campo(fatura.getValorOriginalFormatado(), 240, 268 + ajusteFatura, 105, 'center', 6);
            campo(fatura.getValorDoDescontoFormatado(), 346, 268 + ajusteFatura, 76, 'center', 6);
            campo(fatura.getValorLiquidoFormatado(), 425, 268 + ajusteFatura, 90, 'center', 6);


            // DUPLICATA
            linhaVertical(286 + ajusteDuplicata, 308.67 + ajusteDuplicata, 134.65 + ajusteDuplicata);
            linhaVertical(286 + ajusteDuplicata, 308.67 + ajusteDuplicata, 269.3 + ajusteDuplicata);
            linhaVertical(286 + ajusteDuplicata, 308.67 + ajusteDuplicata, 403.95 + ajusteDuplicata);
            secao('DUPLICATAS', 1.5, 278 + ajusteDuplicata);
            normal('Nº DUPLICATA', 0 + 1.5, 287 + ajusteDuplicata, 43.21, 'center', 6);
            normal('VENC.', 43.21 + 0, 287 + ajusteDuplicata, 43.21, 'center', 6);
            normal('VALOR', 86.43 + 0, 287 + ajusteDuplicata, 43.21, 'center', 6);
            normal('Nº DUPLICATA', 0 + 137.65, 287 + ajusteDuplicata, 43.21, 'center', 6);
            normal('VENC.', 43.21 + 137.65, 287 + ajusteDuplicata, 43.21, 'center', 6);
            normal('VALOR', 86.43 + 137.65, 287 + ajusteDuplicata, 43.21, 'center', 6);
            normal('Nº DUPLICATA', 0 + 272.3, 287 + ajusteDuplicata, 43.21, 'center', 6);
            normal('VENC.', 43.21 + 272.3, 287 + ajusteDuplicata, 43.21, 'center', 6);
            normal('VALOR', 86.43 + 272.3, 287 + ajusteDuplicata, 43.21, 'center', 6);
            normal('Nº DUPLICATA', 0 + 406.55, 287 + ajusteDuplicata, 43.21, 'center', 6);
            normal('VENC.', 43.21 + 406.55, 287 + ajusteDuplicata, 43.21, 'center', 6);
            normal('VALOR', 86.43 + 406.55, 287 + ajusteDuplicata, 43.21, 'center', 6);


            campo(duplicata.getNumero1(), 0 + 1.5, 299 + ajusteDuplicata, 43.21, 'center', 6);
            campo(duplicata.getVencimentoFormatado1(), 43.21 + 0, 299 + ajusteDuplicata, 43.21, 'center', 6);
            campo(duplicata.getValorFormatado1(), 86.43, 299 + ajusteDuplicata, 43.21, 'center', 6);

            if(duplicata.getNumero2()) {
                campo(duplicata.getNumero2(), 0 + 137.65, 299 + ajusteDuplicata, 43.21, 'center', 6);
                campo(duplicata.getVencimentoFormatado2(), 43.21 + 137.65, 299 + ajusteDuplicata, 43.21, 'center', 6);
                campo(duplicata.getValorFormatado2(), 86.43 + 137.65, 299 + ajusteDuplicata, 43.21, 'center', 6);
            }

            if(duplicata.getNumero3()) {
                campo(duplicata.getNumero3(), 0 + 272.3, 299 + ajusteDuplicata, 43.21, 'center', 6);
                campo(duplicata.getVencimentoFormatado3(), 43.21 + 272.3, 299 + ajusteDuplicata, 43.21, 'center', 6);
                campo(duplicata.getValorFormatado3(), 86.43 + 272.3, 299 + ajusteDuplicata, 43.21, 'center', 6);
            }

            if(duplicata.getNumero4()) {
                campo(duplicata.getNumero4(), 0 + 406.55, 299 + ajusteDuplicata, 43.21, 'center', 6);
                campo(duplicata.getVencimentoFormatado4(), 43.21 + 406.55, 299 + ajusteDuplicata, 43.21, 'center', 6);
                campo(duplicata.getValorFormatado4(), 86.43 + 406.55, 299 + ajusteDuplicata, 43.21, 'center', 6);
            }

                    // if (duplicatas[1]) {
                    //     campo(duplicatas[1].numero, 0 + 129.65, 299 + ajusteDuplicata, 43.21, 'center', 6);
                    //     campo(duplicatas[1].vencimento, 43.21 + 129.65, 299 + ajusteDuplicata, 43.21, 'center', 6);
                    //     campo(duplicatas[1].valor, 86.43 + 129.65, 299 + ajusteDuplicata, 43.21, 'rigth', 6);
                    // }
                    // if (duplicatas[2]) {
                    //     campo(duplicatas[2].numero, 0 + 259.3, 299 + ajusteDuplicata, 43.21, 'center', 6);
                    //     campo(duplicatas[2].vencimento, 43.21 + 259.3, 299 + ajusteDuplicata, 43.21, 'center', 6);
                    //     campo(duplicatas[2].valor, 86.43 + 259.3, 299 + ajusteDuplicata, 43.21, 'center', 6);
                    // }
                    // if (duplicatas[3]) {
                    //     campo(duplicatas[3].numero, 0 + 388.95, 299 + ajusteDuplicata, 43.21, 'center', 6);
                    //     campo(duplicatas[3].vencimento, 43.21 + 388.95, 299 + ajusteDuplicata, 43.21, 'center', 6);
                    //     campo(duplicatas[3].valor, 86.43 + 388.95, 299 + ajusteDuplicata, 43.21, 'center', 6);
                    // }


            //CALCULO DO IMPOSTO
            const ajusteImpostos = 4;
            retanguloCinza(402, 337.1 + ajusteImpostos, 136.6, 21.25)
            linhaHorizontal(0, 0, 315.84 + ajusteImpostos);
            linhaHorizontal(0, 0, 337.1 + ajusteImpostos);
            linhaHorizontal(0, 0, 358.35 + ajusteImpostos);

            linhaVertical(315.84 + ajusteImpostos, 358.35 + ajusteImpostos, 0);
            linhaVertical(315.84 + ajusteImpostos, 337.1 + ajusteImpostos, 99);
            linhaVertical(315.84 + ajusteImpostos, 337.1 + ajusteImpostos, 201);
            linhaVertical(315.84 + ajusteImpostos, 337.1 + ajusteImpostos, 300);
            linhaVertical(315.84 + ajusteImpostos, 358.35 + ajusteImpostos, 402);

            linhaVertical(337.1 + ajusteImpostos, 358.35 + ajusteImpostos, 79);
            linhaVertical(337.1 + ajusteImpostos, 358.35 + ajusteImpostos, 161);
            linhaVertical(337.1 + ajusteImpostos, 358.35 + ajusteImpostos, 241);
            linhaVertical(337.1 + ajusteImpostos, 358.35 + ajusteImpostos, 323);
            linhaVertical(315.84 + ajusteImpostos, 358.35 + ajusteImpostos, larguraDoFormulario);

            secao('CÁLCULO DO IMPOSTO', 1.5, 308 + ajusteImpostos);
            titulo('BASE DE CÁLCULO DO ICMS', 1.5, 316.84 + ajusteImpostos, 79);
            campo(impostos.getBaseDeCalculoDoIcmsFormatada(), 1.5, 325.84 + ajusteImpostos, 79,  'right');

            titulo('VALOR DO ICMS', 100.5, 316.84 + ajusteImpostos, 96);
            campo(impostos.getValorDoIcmsFormatado(), 100.5, 325.84 + ajusteImpostos, 96, 'right');

            titulo('BASE DE CÁLC. ICMS SUBST.', 202.5, 316.84 + ajusteImpostos, 96);
            campo(impostos.getBaseDeCalculoDoIcmsStFormatada(), 202.5, 325.84 + ajusteImpostos, 96, 'right');

            titulo('VALOR DO ICMS SUBST.', 301.5, 316.84 + ajusteImpostos, 96);
            campo(impostos.getValorDoIcmsStFormatado(), 301.5, 325.84 + ajusteImpostos, 96, 'right');

            titulo('VALOR TOTAL DOS PRODUTOS', 402.5, 316.84 + ajusteImpostos, 110);
            campo(impostos.getValorTotalDosProdutosFormatado(), 402.5, 325.84 + ajusteImpostos, 110, 'right');


            titulo('VALOR DO FRETE', 1.5, 338.1 + ajusteImpostos, 73);
            campo(danfe.getValorDoFreteFormatado(), 1.5, 345.84 + ajusteImpostos, 73, 'right');

            titulo('VALOR DO SEGURO', 80.5, 338.1 + ajusteImpostos, 76);
            campo(danfe.getValorDoSeguroFormatado(), 80.5, 345.84 + ajusteImpostos, 76, 'right');

            titulo('DESCONTO', 162.5, 338.1 + ajusteImpostos, 76);
            campo(danfe.getDescontoFormatado(), 162.5, 345.84 + ajusteImpostos, 76, 'right');

            titulo('OUTRAS DESPESAS ACESS.', 242.5, 338.1 + ajusteImpostos, 76);
            campo(danfe.getOutrasDespesasFormatado(), 242.5, 345.84 + ajusteImpostos, 76, 'right');

            titulo('VALOR TOTAL DO IPI', 324.5, 338.1 + ajusteImpostos, 73);
            campo(impostos.getValorTotalDoIpiFormatado(), 324.5, 345.84 + ajusteImpostos, 73, 'right');

            titulo('VALOR TOTAL DA NOTA', 403.5, 338.1 + ajusteImpostos, 110);
            campo(danfe.getValorTotalDaNotaFormatado(false), 403.5, 345.84 + ajusteImpostos, 110, 'right');

            // TRANSPORTADOR
            const ajusteTransportador = 53;
            linhaHorizontal(0, 0, 320 + ajusteTransportador);
            linhaHorizontal(0, 0, 340 + ajusteTransportador);
            linhaHorizontal(0, 0, 360 + ajusteTransportador);
            linhaHorizontal(0, 0, 380 + ajusteTransportador);

            linhaVertical(320 + ajusteTransportador, 380 + ajusteTransportador, 0);
            linhaVertical(320 + ajusteTransportador, 340 + ajusteTransportador, 221);
            linhaVertical(320 + ajusteTransportador, 340 + ajusteTransportador, 297.6);
            linhaVertical(320 + ajusteTransportador, 340 + ajusteTransportador, 351);
            linhaVertical(320 + ajusteTransportador, 360 + ajusteTransportador, 408);
            linhaVertical(320 + ajusteTransportador, 380 + ajusteTransportador, 431);

            linhaVertical(340 + ajusteTransportador, 360 + ajusteTransportador, 266);

            linhaVertical(360 + ajusteTransportador, 380 + ajusteTransportador, 62);
            linhaVertical(360 + ajusteTransportador, 380 + ajusteTransportador, 159);
            linhaVertical(360 + ajusteTransportador, 380 + ajusteTransportador, 278);
            linhaVertical(360 + ajusteTransportador, 380 + ajusteTransportador, 340);

            linhaVertical(320 + ajusteTransportador, 380 + ajusteTransportador, larguraDoFormulario);

            secao('TRANSPORTADOR / VOLUMES TRANSPORTADOS', 1.5, 312.5 + ajusteTransportador);
            titulo('NOME / RAZÃO SOCIAL', 1.5, 321 + ajusteTransportador, 215);
            campo(transportador.getNome(), 1.5, 329 + ajusteTransportador, 215, 'left');

            titulo('FRETE POR CONTA',222.5, 321 + ajusteTransportador, 70);
            campo(danfe.getModalidadeDoFreteFormatada(), 222.5, 329 + ajusteTransportador, 70);

            titulo('CÓDIGO ANTT', 299.1, 321 + ajusteTransportador, 48);
            campo(transportador.getCodigoAntt(), 299.1, 329 + ajusteTransportador, 48);

            titulo('PLACA DO VEÍCULO', 352.5, 321 + ajusteTransportador, 48);
            campo(transportador.getPlacaDoVeiculoFormatada(), 352.5, 329 + ajusteTransportador, 48);

            titulo('UF', 409.5, 321 + ajusteTransportador, 20);
            campo(transportador.getUfDaPlacaDoVeiculo(), 409.5, 329 + ajusteTransportador, 20);

            titulo('CNPJ / CPF', 432.5, 321 + ajusteTransportador, 82);
            campo(transportador.getRegistroNacionalFormatado(), 432.5, 329 + ajusteTransportador, 82);

            titulo('ENDEREÇO', 1.5, 341 + ajusteTransportador, 260);
            campo(transportador.getEndereco().getPrimeiraLinha(), 1.5, 349 + ajusteTransportador, 260, 'left', args.tamanhoDaFonteDoCampo - 0.5);

            titulo('MUNICÍPIO', 267.5, 341 + ajusteTransportador, 136);
            campo(transportador.getEndereco().getMunicipio(), 267.5, 349 + ajusteTransportador, 136);

            titulo('UF', 409.5, 341 + ajusteTransportador, 20);
            campo(transportador.getEndereco().getUf(), 409.5, 349 + ajusteTransportador, 20);

            titulo('INSCRIÇÃO ESTADUAL', 432.5, 341 + ajusteTransportador, 82);
            campo(transportador.getInscricaoEstadual(), 432.5, 349 + ajusteTransportador, 82);

            titulo('QUANTIDADE', 1.5, 361 + ajusteTransportador, 59);
            campo(volumes.getQuantidadeFormatada(), 1.5, 369 + ajusteTransportador, 59);

            titulo('ESPÉCIE', 63.5, 361 + ajusteTransportador, 87);
            campo(volumes.getEspecie(), 63.5, 369 + ajusteTransportador, 87);

            titulo('MARCA', 160.5, 361 + ajusteTransportador, 87);
            campo(volumes.getMarca(), 160.5, 369 + ajusteTransportador, 87);

            titulo('NUMERAÇÃO', 279.5, 361 + ajusteTransportador, 87);
            campo(volumes.getNumeracao(), 279.5, 369 + ajusteTransportador, 87);

            titulo('PESO BRUTO', 341.5, 361 + ajusteTransportador, 85);
            campo(volumes.getPesoBrutoFormatado(), 341.5, 369 + ajusteTransportador, 85);

            titulo('PESO LÍQUIDO', 432.5, 361 + ajusteTransportador, 85);
            campo(volumes.getPesoLiquidoFormatado(), 432.5, 369 + ajusteTransportador, 85);

            // DADOS ADICIONAIS
            retanguloBranco(0, 689, larguraDoFormulario, 96);
            linhaVertical(689, 785, 329);
            secao('DADOS ADICIONAIS', 1.5, 681.33);
            titulo('INFORMAÇÕES COMPLEMENTARES', 1.5, 690.83, 385);
            titulo('RESERVADO AO FISCO', 332, 690.83, 195);
            normal(danfe.getInformacoesComplementares(), 1.5, 700, 300, 'left', 5);
        }

        //QUINTO BLOCO - LISTA DE PRODUTOS
        alturaInicialDoQuadroDeItens = 444.93;
        let segundaLinhaDoQuadroDeItens;


        alturaInicialDoQuadroDeItens = 130;
        let alturaFinalDoQuadroDeItens = 780;
        maximaAlturaItem = 782;
        if (page === 0) {
            maximaAlturaItem = 668;
            alturaInicialDoQuadroDeItens = 444.93;
            alturaFinalDoQuadroDeItens = 668;
        }
        segundaLinhaDoQuadroDeItens = alturaInicialDoQuadroDeItens + 14.2;

        retanguloCinza(0, alturaInicialDoQuadroDeItens, larguraDoFormulario, 13.2);
        // linhaHorizontal(0, 0, alturaInicialDoQuadroDeItens);
        // linhaHorizontal(0, 0, segundaLinhaDoQuadroDeItens);
        linhaHorizontal(0, 0, alturaFinalDoQuadroDeItens);
        linhaHorizontal(504.6, 0, alturaInicialDoQuadroDeItens + 7.5);

        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, 0);
        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, 39.6);
        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, 192.6);
        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, 220.6);
        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, 237.6);
        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, 254.6);
        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, 273.6);
        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, 304.6);
        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, 341.6);
        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, 378.6);
        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, 409.6);
        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, 448.6);
        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, 476.6);
        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, 504.6);
        linhaVertical(alturaInicialDoQuadroDeItens + 7.5, alturaFinalDoQuadroDeItens, 521.6);
        linhaVertical(alturaInicialDoQuadroDeItens, alturaFinalDoQuadroDeItens, larguraDoFormulario);


        let alturaDaSecaoDosItens = 132;
        let alturaDosTitulosDosItens;
        if (page === 0) {
            alturaInicialDoQuadroDeItens = 444.93;
            alturaDaSecaoDosItens = 444.93;
        }

        alturaDosTitulosDosItens = alturaDaSecaoDosItens + 6;
        const ajusteLinhaSimples = 3;
        const ajusteLinhaDupla = 5;

        // QUINTO BLOCO - LISTA DE PRODUTOS
        secao('DADOS DOS PRODUTOS / SERVIÇOS', 1.5, alturaDaSecaoDosItens - 8.49);
        titulo('CÓDIGO DO\nPROD. / SERV. ', 1.5, alturaDosTitulosDosItens - ajusteLinhaDupla, 39.6, 'center');
        titulo('DESCRIÇÃO DO PRODUTO / SERVIÇO', 39.6, alturaDosTitulosDosItens - ajusteLinhaSimples, 153, 'center');
        titulo('NCM/SH', 192.6, alturaDosTitulosDosItens - ajusteLinhaSimples, 28, 'center');
        titulo('CST', 220.6, alturaDosTitulosDosItens - ajusteLinhaSimples, 17, 'center');
        titulo('CFOP', 237.6, alturaDosTitulosDosItens - ajusteLinhaSimples, 17, 'center');
        titulo('UNID.', 254, alturaDosTitulosDosItens - ajusteLinhaSimples, 19, 'center');
        titulo('QUANT.', 273.6, alturaDosTitulosDosItens - ajusteLinhaSimples, 31, 'center');
        titulo('VALOR\nUNITÁRIO ', 304.6, alturaDosTitulosDosItens - ajusteLinhaDupla, 37, 'center');
        titulo('VALOR\nTOTAL ', 341.6, alturaDosTitulosDosItens - ajusteLinhaDupla, 37, 'center');
        titulo('DESCONTO', 378.6, alturaDosTitulosDosItens - ajusteLinhaSimples, 31, 'center');
        titulo('BASE\nCÁLC. ICMS ', 409.6, alturaDosTitulosDosItens - ajusteLinhaDupla, 39, 'center');
        titulo('VALOR\nICMS ', 448.6, alturaDosTitulosDosItens - ajusteLinhaDupla, 28, 'center');
        titulo('VALOR\nIPI ', 476.6, alturaDosTitulosDosItens - ajusteLinhaDupla, 28, 'center');
        titulo('ALÍQUOTAS', 504.6, alturaDosTitulosDosItens - 5, 34, 'center');
        titulo('ICMS', 504.6, alturaDosTitulosDosItens + 1.5, 17, 'center');
        titulo('IPI', 521.6, alturaDosTitulosDosItens + 1.5, 17, 'center');


    }

    desenharPagina();

    let numeroDePaginas = 1,
        yInicialDosItens = alturaInicialDoQuadroDeItens, // + 14.17,
        yDoItemAtual = yInicialDosItens + 14.17,
        alturaAtual = 0;

    itens.forEach(function(item, indexItem) {
        function renderizarLinha(pdf) {
            normal(item.getCodigo(), 1, yDoItemAtual, 38, 'center', 5, pdf);
            let maiorY = pdf.y;

            // let descricao = item.getDescricao();
            // if(item.getInformacoesAdicionais()) {
            //     descricao += '\n' + item.getInformacoesAdicionais();
            // }

            normal(item.getDescricao(), 41, yDoItemAtual, 150, 'justify', 5, pdf);
            maiorY = Math.max(maiorY, pdf.y);

            normal(item.getNcmSh(), 193.6, yDoItemAtual, 27, 'center', 5, pdf);
            maiorY = Math.max(maiorY, pdf.y);

            normal(item.getOCst(), 221.6, yDoItemAtual, 16, 'center', 5, pdf);
            maiorY = Math.max(maiorY, pdf.y);

            normal(item.getCfop(),238.6, yDoItemAtual, 16, 'center', 5, pdf);
            maiorY = Math.max(maiorY, pdf.y);

            normal(item.getUnidade(), 255.6, yDoItemAtual, 18, 'center', 5, pdf);
            maiorY = Math.max(maiorY, pdf.y);

            normal(item.getQuantidadeFormatada(), 273.6, yDoItemAtual,29, 'right', 5, pdf);
            maiorY = Math.max(maiorY, pdf.y);

            normal(item.getValorUnitarioFormatado(), 304.6, yDoItemAtual, 36, 'right', 5, pdf);
            maiorY = Math.max(maiorY, pdf.y);

            normal(item.getValorTotalFormatado(), 341.6, yDoItemAtual, 36, 'right', 5, pdf);
            maiorY = Math.max(maiorY, pdf.y);

            normal(item.getDescontoFormatado(), 378.6, yDoItemAtual, 30, 'right', 5, pdf); // desconto
            maiorY = Math.max(maiorY, pdf.y);

            normal(item.getBaseDeCalculoDoIcmsFormatada(), 409.6, yDoItemAtual, 38, 'right', 5, pdf);
            maiorY = Math.max(maiorY, pdf.y);

            normal(item.getValorDoIcmsFormatado(), 448.6, yDoItemAtual, 27., 'right', 5, pdf);
            maiorY = Math.max(maiorY, pdf.y);

            normal(item.getValorDoIpiFormatado(), 476.6, yDoItemAtual, 27, 'right', 5, pdf);
            maiorY = Math.max(maiorY, pdf.y);

            normal(item.getAliquotaDoIcmsFormatada(), 504.6, yDoItemAtual, 16, 'center', 5, pdf);
            maiorY = Math.max(maiorY, pdf.y);

            normal(item.getAliquotaDoIpiFormatada(), 521.6, yDoItemAtual, 16, 'right', 5, pdf);
            maiorY = Math.max(maiorY, pdf.y);

            if(args.separadorDeItens && (yDoItemAtual < maximaAlturaItem)) {
            // normal(item.getAliquotaDoIpiFormatada(), 522.6, yDoItemAtual, 16, 'right', 5, pdf);
                linhaHorizontal(0, 0, yDoItemAtual - 1); // maiorY);
            }

            return 10.5 + (args.separadorDeItens ? 2 : 0); // maiorY + (args.separadorDeItens ? 2 : 0);
        }

        let altura = renderizarLinha(pdfTemporario); // - yDoItemAtual;

        // console.log('ALTURA: ', alturaAtual, altura, renderizarLinha(pdfTemporario), yDoItemAtual, indexItem, page, maximaAlturaItem);

        // if((alturaAtual + altura + alturaInicialDoQuadroDeItens) > maximaAlturaItem) {
        if(yDoItemAtual > maximaAlturaItem) {
            numeroDePaginas += 1;
            pdf.addPage();
            yDoItemAtual = 145; //yInicialDosItens;
            alturaAtual = 0;
            page++;
            ajusteCabecalho = -51;

            desenharPagina();
        }

        renderizarLinha(pdf);

        alturaAtual += altura;
        yDoItemAtual = yDoItemAtual + altura;

    });

    let paginas = pdf.bufferedPageRange();

    for(let i = paginas.start; i < paginas.start + paginas.count; i++) {
        pdf.switchToPage(i);
        if (i === 0) {
            normal('fl. ' + (i + 1) + '/' + numeroDePaginas, 200, 107, 88.5, 'right', 9);
            linhaHorizontalTracejada(0, 0, 46);
        } else {
            normal('fl. ' + (i + 1) + '/' + numeroDePaginas, 200, 107 + ajusteCabecalho, 88.5, 'right', 9)
        }
    }

    pdf.flushPages();
    pdf.end();

    callback(null, pdf);
};

//fswatch ./lib/geradores/geradorDePdf.js | xargs -n1 /usr/local/bin/nodeunit ./tests/geradorTest.js
