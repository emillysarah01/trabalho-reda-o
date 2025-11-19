// script.js
// Dados das redações
let redacoes = [];

// Elementos da página
const homePage = document.getElementById('home-page');
const redacaoPage = document.getElementById('redacao-page');
const redacoesList = document.getElementById('redacoes-list');
const backBtn = document.getElementById('back-btn');
const redacaoTitle = document.getElementById('redacao-title');
const redacaoTema = document.getElementById('redacao-tema');
const redacaoData = document.getElementById('redacao-data');
const redacaoConteudo = document.getElementById('redacao-conteudo');
const saveBtn = document.getElementById('save-btn');
const deleteBtn = document.getElementById('delete-btn');

// Redação atualmente sendo visualizada/editada
let currentRedacaoIndex = -1;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarRedacoes();
    renderizarListaRedacoes();
   
    // Event listeners
    backBtn.addEventListener('click', voltarParaHome);
    saveBtn.addEventListener('click', salvarRedacao);
    deleteBtn.addEventListener('click', excluirRedacao);
});

// Carregar redações do localStorage
function carregarRedacoes() {
    const savedRedacoes = localStorage.getItem('redacoesParana');
   
    if (savedRedacoes) {
        redacoes = JSON.parse(savedRedacoes);
    } else {
        // Inicializar com 14 redações vazias
        redacoes = Array(14).fill().map((_, index) => ({
            id: index + 1,
            tema: '',
            data: '',
            conteudo: '',
            preenchida: false
        }));
        salvarNoLocalStorage();
    }
}

// Salvar redações no localStorage
function salvarNoLocalStorage() {
    localStorage.setItem('redacoesParana', JSON.stringify(redacoes));
}

// Renderizar a lista de redações
function renderizarListaRedacoes() {
    redacoesList.innerHTML = '';
   
    if (redacoes.length === 0) {
        redacoesList.innerHTML = `
            <div class="empty-state">
                <i>📝</i>
                <h3>Nenhuma redação cadastrada</h3>
                <p>Adicione sua primeira redação clicando no botão abaixo.</p>
            </div>
        `;
        return;
    }
   
    redacoes.forEach((redacao, index) => {
        const card = document.createElement('div');
        card.className = 'redacao-card';
        card.dataset.index = index;
       
        const statusClass = redacao.preenchida ? 'status-preenchida' : 'status-vazia';
        const statusText = redacao.preenchida ? 'Preenchida' : 'Vazia';
       
        card.innerHTML = `
            <h3>Redação #${redacao.id}</h3>
            <p><strong>Tema:</strong> ${redacao.tema || 'Não definido'}</p>
            <p><strong>Data:</strong> ${redacao.data || 'Não definida'}</p>
            <span class="status ${statusClass}">${statusText}</span>
        `;
       
        card.addEventListener('click', () => abrirRedacao(index));
        redacoesList.appendChild(card);
    });
}

// Abrir uma redação para visualização/edição
function abrirRedacao(index) {
    currentRedacaoIndex = index;
    const redacao = redacoes[index];
   
    redacaoTitle.textContent = `Redação #${redacao.id}`;
    redacaoTema.textContent = redacao.tema || 'Não definido';
    redacaoData.textContent = redacao.data || 'Não definida';
    redacaoConteudo.value = redacao.conteudo;
   
    homePage.classList.add('hidden');
    redacaoPage.classList.remove('hidden');
}

// Voltar para a página inicial
function voltarParaHome() {
    homePage.classList.remove('hidden');
    redacaoPage.classList.add('hidden');
    currentRedacaoIndex = -1;
}

// Salvar uma redação
function salvarRedacao() {
    if (currentRedacaoIndex === -1) return;
   
    const tema = prompt('Digite o tema da redação:') || '';
    const data = prompt('Digite a data da redação (ex: 15/03/2023):') || '';
   
    redacoes[currentRedacaoIndex].tema = tema;
    redacoes[currentRedacaoIndex].data = data;
    redacoes[currentRedacaoIndex].conteudo = redacaoConteudo.value;
    redacoes[currentRedacaoIndex].preenchida = true;
   
    salvarNoLocalStorage();
    renderizarListaRedacoes();
   
    // Atualizar a visualização atual
    redacaoTema.textContent = tema || 'Não definido';
    redacaoData.textContent = data || 'Não definida';
   
    alert('Redação salva com sucesso!');
}

// Excluir uma redação
function excluirRedacao() {
    if (currentRedacaoIndex === -1) return;
   
    if (confirm('Tem certeza que deseja excluir esta redação?')) {
        redacoes[currentRedacaoIndex].tema = '';
        redacoes[currentRedacaoIndex].data = '';
        redacoes[currentRedacaoIndex].conteudo = '';
        redacoes[currentRedacaoIndex].preenchida = false;
       
        salvarNoLocalStorage();
        renderizarListaRedacoes();
       
        // Atualizar a visualização atual
        redacaoTema.textContent = 'Não definido';
        redacaoData.textContent = 'Não definida';
        redacaoConteudo.value = '';
       
        alert('Redação excluída com sucesso!');
    }
}
