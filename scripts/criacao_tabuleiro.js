let tam_linhas, tam_colunas;
let posicoes_bombas = [];
let num_bombas = 20; //NUMERO ARBITRARIO PARA TESTE
// let nome_jogador = "Joaquim" //NOME ARBITRARIO PARA TESTE
// let modalidade = "Classico" // ARBITRARIA PARA TESTE

function gera_linha() {
    let jogo = document.getElementById("jogo");

    let cria_linha = document.createElement("div");
    cria_linha.classList.add("linha");
    jogo.appendChild(cria_linha);
}

function gera_quadrado(cor, linha, coluna) {
    let elemento_linha = document.getElementsByClassName("linha");

    let cria_quadrado = document.createElement("button");
    cria_quadrado.classList.add("quadrado");
    cria_quadrado.classList.add(cor);
    cria_quadrado.setAttribute("onclick", "pressiona_quadrado(" + linha + "," + coluna + ")");
    cria_quadrado.setAttribute("oncontextmenu", "botao_direito(" + linha + "," + coluna + ")");
    cria_quadrado.addEventListener('contextmenu', event => event.preventDefault());

    elemento_linha[linha].appendChild(cria_quadrado);
}

function define_tamanho() {
    let linha = document.forms["tabuleiro"]["linha"].value;
    let coluna = document.forms["tabuleiro"]["coluna"].value;
    linha = Number(linha);
    coluna = Number(coluna);
     //falta criar o campo para o usuario escolher o numero de bombas!!

    cria_tabuleiro(linha,coluna);


    return false;
}

function get_random_int(min, max) { //retorna um inteiro entre min e max, sem incluir max
    let random = Math.random();
    let num = Math.floor(random * (max - min)) + min;
    return num;
}

function cria_tabuleiro(linhas,colunas) {
    tam_linhas = linhas;
    tam_colunas = colunas;
    limpa_tabuleiro();

    let cor = "";
    let cor_inicial = 0;


    for(let i = 0; i < linhas; i++){
        gera_linha()

        for(let n = cor_inicial; n < colunas; n++){ 
            
            cor = (n%2 ? "azul" : "roxo");

            let coluna = n - cor_inicial;
            gera_quadrado(cor, i, coluna)  ;          
        }

        colunas = (cor_inicial == 0 ? colunas + 1 : colunas - 1);
        cor_inicial = (cor_inicial == 0 ? 1 : 0);
    }

    define_bombas();
}

function verifica_se_ha_bomba (num) {
    let bomba_ja_existe = posicoes_bombas.find(element => element == num);

    bomba_ja_existe = (bomba_ja_existe == undefined ? false : true);

    return bomba_ja_existe;
}

function define_bombas(){
    for(let i=0; i<num_bombas; i++){

        do {
            random_num =  get_random_int(0, (tam_colunas * tam_linhas));
            bomba_ja_existe = verifica_se_ha_bomba(random_num);
        }while(bomba_ja_existe)

        posicoes_bombas.push(random_num);

    }
    // console.log(posicoes_bombas);

}


function limpa_tabuleiro() {
    let acha_linha = document.getElementsByClassName("linha");
    let size_linhas = acha_linha.length;
    
    for(let i = 0; i < size_linhas; i++)
    {
        acha_linha[0].remove();
    }

    posicoes_bombas = [];
    ganhou_ou_perdeu = false;
}
