let ganhou_ou_perdeu = false
let clicado = false

function get_quadrado(linha, coluna) {
    posicao = (linha *= tam_colunas) + coluna;
    let quadrado = document.getElementsByClassName("quadrado")[posicao];
    return quadrado;
}

function get_posicao_absoluta(linha, coluna) {
    return ((linha * tam_colunas) + coluna);
}

function has_child_with_type(parent,type) {
    let childs = parent.childNodes
    // console.log(childs.length)

    for(let i = 0; i < childs.length; i++){
        if(childs[i].nodeType == type){
            // console.log(childs[i])
            return [true, childs[i]]
        }
    }

    return[false, null]
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function mostra_conteudo_quadrado(linha,coluna){
    let coordenadas = get_coordenadas(linha,coluna);
    let qtde_bombas = qtde_bombas_ao_redor(coordenadas);
    let quadrado = get_quadrado(linha,coluna);
    

    
    if(qtde_bombas != 0){
        quadrado.innerHTML = qtde_bombas;
        quadrado.classList.add("aberto");
    }
    else{
        quadrado.innerHTML = "";
        quadrado.classList.add("aberto");
    }
}

function mostra_bombas() {
    let quadrados = document.getElementsByClassName("quadrado");
    // console.log(quadrados[posicoes_bombas[0]].childNodes[0].nodeType)

    if(!clicado){
        clicado = true
        for (let i = 0; i < num_bombas; i++) {
            let pos = posicoes_bombas[i];
            let has_child = has_child_with_type(quadrados[pos],1)[0]
            if(!has_child) {
                let imagem = document.createElement("img");
                imagem.classList.add("bomba");
                imagem.setAttribute("src", "../img/bomba.png");
                quadrados[pos].appendChild(imagem);
            }
            // console.log(quadrados[pos]);
        }
        esconde_bombas();
    }
}

async function esconde_bombas() {
    // console.log(clicado)
    await sleep(10000);
    clicado = false
    if(!ganhou_ou_perdeu){
        let bombas = document.getElementsByClassName("bomba");

        for (let i = 0; i < num_bombas; i++) {
            bombas[0].remove();
        }
    }
}

function verifica_se_ha_bomba (num) {
    let bomba_ja_existe = posicoes_bombas.find(element => element == num);

    bomba_ja_existe = (bomba_ja_existe == undefined ? false : true);

    return bomba_ja_existe;
}

function get_coordenadas(linha_central,coluna_central) {
    let linha_inicial = linha_central - 1, coluna_inicial = coluna_central - 1;
    let linha_final = linha_central + 1, coluna_final = coluna_central + 1;
    // console.log("Depois: " + linha_inicial + " , " + coluna_inicial + " , " + linha_final + " , " + coluna_final)


    linha_inicial = (linha_inicial < 0 ? linha_inicial = 0 : linha_inicial);
    coluna_inicial = (coluna_inicial < 0 ? coluna_inicial = 0 : coluna_inicial);

    linha_final = (linha_final >= tam_linhas ? (linha_final = tam_linhas - 1) : linha_final);
    coluna_final = (coluna_final >= tam_colunas ? (coluna_final = tam_colunas - 1) : coluna_final);

    return {
        linha_inicial,
        coluna_inicial,
        linha_final,
        coluna_final,
        linha_central,
        coluna_central
    };
}

function qtde_bombas_ao_redor(coordenadas){
    let ha_bomba, bombas_ao_redor = 0;

    let { linha_inicial, coluna_inicial, linha_final, 
        coluna_final, linha_central, coluna_central } = coordenadas;

    for (let i = linha_inicial; i <= linha_final; i++) {
        for (let n = coluna_inicial; n <= coluna_final; n++) {
            posicao_absoluta = get_posicao_absoluta(i, n);
            ha_bomba = verifica_se_ha_bomba(posicao_absoluta);
            if(ha_bomba){
                if (i != linha_central || n != coluna_central) {
                    bombas_ao_redor++;
                }
            }
        }
    }
    return bombas_ao_redor
}

async function abre_posicoes(coordenadas) {
    // console.log(ha_bombas)

    let { linha_inicial, coluna_inicial, linha_final, 
        coluna_final, linha_central, coluna_central } = coordenadas;
    
    let ha_bombas = qtde_bombas_ao_redor(coordenadas)

    if(ha_bombas == 0){
        for (let i = linha_inicial; i <= linha_final; i++) {
            for (let n = coluna_inicial; n <= coluna_final; n++) {
                if (i != linha_central || n != coluna_central) {
                    let quadrado = get_quadrado(i,n)
                    if(quadrado.classList.contains("aberto") == false){
                        let novas_coordenadas = get_coordenadas(i,n);
                        mostra_conteudo_quadrado(i,n);
                        // console.log(i + "," + n)
                        await sleep(30);
                        abre_posicoes(novas_coordenadas);
                    }
                }
            }
        }
    }
    else {
        return mostra_conteudo_quadrado(linha_central,coluna_central);
    }

}


async function pressiona_quadrado(linha, coluna) {
    let posicao_absoluta = get_posicao_absoluta(linha, coluna);
    let ha_bomba = verifica_se_ha_bomba(posicao_absoluta);
    let coordenadas = get_coordenadas(linha,coluna);
    // console.log(coordenadas);
    // console.log("teste")


    if (ha_bomba) {
        ganhou_ou_perdeu = true
        mostra_bombas();
        alert("Você perdeu!");
        perdeu = true
        // let jogo = 
        // new Historico(nome_jogador, `${tam_linhas}, ${tam_colunas}`, num_bombas, modalidade, tempo, "Derrota", new Date);
    }
    else {
        mostra_conteudo_quadrado(linha, coluna);
        await abre_posicoes(coordenadas);
        if(jogador_venceu())
        {
            alert("Você Ganhou!");
            ganhou_ou_perdeu = true
            mostra_bombas();
        }
    }
}

function botao_direito(linha,coluna){
    let quadrado = get_quadrado(linha,coluna)
    let texto = document.createTextNode("?")

    
    if(!quadrado.classList.contains("aberto")) {
        let nodes_quadrado = has_child_with_type(quadrado, 3)
        if (nodes_quadrado[0] == true) {
            nodes_quadrado[1].remove()
        }
        else{
            quadrado.appendChild(texto);
            // console.log(nodes_quadrado[0].nodeType("Text"))
        }
    }

    // if(quadrado.innerHTML === "?"){
    //     quadrado.innerHTML = ""
    // }

    return false;
}

function jogador_venceu(){
    let tam_quadrados = document.getElementsByClassName("aberto").length;
    let num_posicoes = (tam_linhas * tam_colunas) - num_bombas;

    let ganhou = (tam_quadrados == num_posicoes ? true : false);
    
    return ganhou;

}

function bloqueia_tabuleiro() {

}


// class Historico{

//     constructor(nome_jogador, dimensoes, num_bombas, modalidade, tempo_total, resultado, data_hora){
//         this.nome_jogador= nome_jogador
//         this.dimensoes = dimensoes
//         this.num_bombas = num_bombas
//         this.modalidade = modalidade
//         this.tempo_total = tempo_total
//         this.resultado = resultado
//         this.data_hora = data_hora
//     }
// }
