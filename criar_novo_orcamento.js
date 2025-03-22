document.addEventListener('DOMContentLoaded', function () {
    const servicos = [
        { nome: 'Reposição da Pastilha de Freio', preco: 49.99 },
        { nome: 'Rotação do Pneu', preco: 149.99 },
        { nome: 'Diagnóstico do Motor', preco: 35.99 },
        { nome: 'Reposição de Filtro de Ar', preco: 89.99 },
        { nome: 'Outro Serviço', preco: 29.99 }
    ];

    const tabelaServicos = document.querySelector('#servicosTable tbody');
    const totalElement = document.getElementById('total');
    const adicionarServicoBtn = document.getElementById('adicionarServico');
    const criarOrcamentoBtn = document.getElementById('criarOrcamento');
    const cancelarBtn = document.getElementById('cancelar');

    let total = 0;

    function atualizarTotal() {
        total = 0;
        document.querySelectorAll('#servicosTable tbody tr').forEach(row => {
            const subtotal = parseFloat(row.querySelector('.subtotal').textContent);
            total += subtotal;
        });
        totalElement.textContent = total.toFixed(2);
    }

    function adicionarServico() {
        const novaLinha = document.createElement('tr');

        const celulaServico = document.createElement('td');
        const selectServico = document.createElement('select');
        servicos.forEach(servico => {
            const option = document.createElement('option');
            option.value = servico.preco;
            option.textContent = servico.nome;
            selectServico.appendChild(option);
        });
        celulaServico.appendChild(selectServico);

        const celulaPreco = document.createElement('td');
        celulaPreco.classList.add('preco');
        celulaPreco.textContent = servicos[0].preco.toFixed(2);

        const celulaQuantidade = document.createElement('td');
        const inputQuantidade = document.createElement('input');
        inputQuantidade.type = 'number';
        inputQuantidade.value = 1;
        inputQuantidade.min = 1;
        celulaQuantidade.appendChild(inputQuantidade);

        const celulaSubtotal = document.createElement('td');
        celulaSubtotal.classList.add('subtotal');
        celulaSubtotal.textContent = servicos[0].preco.toFixed(2);

        const celulaAcoes = document.createElement('td');
        const botaoRemover = document.createElement('button');
        botaoRemover.textContent = 'Remover';
        botaoRemover.addEventListener('click', function () {
            novaLinha.remove();
            atualizarTotal();
        });
        celulaAcoes.appendChild(botaoRemover);

        novaLinha.appendChild(celulaServico);
        novaLinha.appendChild(celulaPreco);
        novaLinha.appendChild(celulaQuantidade);
        novaLinha.appendChild(celulaSubtotal);
        novaLinha.appendChild(celulaAcoes);

        tabelaServicos.appendChild(novaLinha);

        selectServico.addEventListener('change', function () {
            const preco = parseFloat(this.value);
            celulaPreco.textContent = preco.toFixed(2);
            const quantidade = parseInt(inputQuantidade.value);
            celulaSubtotal.textContent = (preco * quantidade).toFixed(2);
            atualizarTotal();
        });

        inputQuantidade.addEventListener('input', function () {
            const preco = parseFloat(selectServico.value);
            const quantidade = parseInt(this.value);
            celulaSubtotal.textContent = (preco * quantidade).toFixed(2);
            atualizarTotal();
        });

        atualizarTotal();
    }

    adicionarServicoBtn.addEventListener('click', adicionarServico);

    cancelarBtn.addEventListener('click', function () {
        document.getElementById('cliente').value = '';
        document.getElementById('data').value = '';
        document.getElementById('notas').value = '';
        tabelaServicos.innerHTML = '';
        totalElement.textContent = '0.00';
    });

    criarOrcamentoBtn.addEventListener('click', function () {
        const cliente = document.getElementById('cliente').value;
        const data = document.getElementById('data').value;
        const notas = document.getElementById('notas').value;

        if (!cliente || !data || total === 0) {
            alert('Preencha todos os campos e adicione pelo menos um serviço.');
            return;
        }

        const orcamento = {
            cliente,
            data,
            notas,
            total,
            servicos: []
        };

        document.querySelectorAll('#servicosTable tbody tr').forEach(row => {
            const servico = row.querySelector('select').selectedOptions[0].textContent;
            const preco = parseFloat(row.querySelector('.preco').textContent);
            const quantidade = parseInt(row.querySelector('input[type="number"]').value);
            const subtotal = parseFloat(row.querySelector('.subtotal').textContent);

            orcamento.servicos.push({ servico, preco, quantidade, subtotal });
        });

        // Aqui você pode adicionar a lógica para salvar o orçamento no painel "Orçamentos Recentes"
        console.log('Orçamento criado:', orcamento);
        alert('Orçamento criado com sucesso!');
        cancelarBtn.click(); // Limpa o formulário após criar o orçamento
    });
});