import { Customer, QuoteItem } from '../models/types';
import Parse from '../parseConfig';

export const createQuote = async (
  clienteId: string,
  data: string,
  servicos: QuoteItem[],
  notas: string
) => {
  const Orcamento = Parse.Object.extend('Orcamento');
  const novoOrcamento = new Orcamento();

  const Cliente = Parse.Object.extend('Cliente');
  const clientePointer = new Cliente();
  clientePointer.id = clienteId;

  try {
    const servicosArray = await Promise.all(
      servicos.map(async ({ servico, quantidade }) => {
        const servicoQuery = new Parse.Query('Servico');
        const servicoReal = await servicoQuery.get(servico.id); // Buscar o serviço real
        return {
          servico: servicoReal.toPointer(), // Criar um Pointer
          quantidade,
          precoUnitario: servicoReal.get('preco'),
          subtotal: servicoReal.get('preco') * quantidade,
        };
      })
    );

    const valorTotal = servicosArray.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    novoOrcamento.set('data', data);
    novoOrcamento.set('notas', notas);
    novoOrcamento.set('cliente', clientePointer);
    novoOrcamento.set('servicos', servicosArray);
    novoOrcamento.set('total', valorTotal);
    novoOrcamento.set('situacao', 'rascunho');

    const resultado = await novoOrcamento.save();
    return resultado;
  } catch (erro) {
    console.error('Erro ao cadastrar orçamento:', erro);
  }
};

export const listQuotes = async () => {
  const query = new Parse.Query('Orcamento');
  query.include('cliente');
  try {
    const resultados = await query.find();
    return resultados.map((orcamento: any) => ({
      id: orcamento.id,
      date: orcamento.get('data'),
      customerId: orcamento.get('cliente').id,
      items: orcamento.get('servicos'),
      notes: orcamento.get('notas'),
      status: orcamento.get('situacao'),
      total: orcamento.get('total'),
    }));
  } catch (erro) {
    console.error('Erro ao buscar orçamentos:', erro);
  }
};

export const getQuoteById = async (orcamentoId: string) => {
  try {
    const query = new Parse.Query('Orcamento');
    const orcamento = await query.get(orcamentoId);
    query.include('cliente');

    return {
      id: orcamento.id,
      date: orcamento.get('data'),
      customerId: orcamento.get('cliente').id,
      items: orcamento.get('servicos'),
      notes: orcamento.get('notas'),
      status: orcamento.get('situacao'),
      total: orcamento.get('total'),
    };
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    return null;
  }
};

export const updateQuote = async (
  id: string,
  clienteId: string,
  data: string,
  servicos: QuoteItem[],
  notas: string,
  situacao: string,
) => {
  const query = new Parse.Query('Orcamento');
  try {
    const orcamento = await query.get(id);

    const Cliente = Parse.Object.extend('Cliente');
    const clientePointer = new Cliente();
    clientePointer.id = clienteId;

    const servicosArray = await Promise.all(
      servicos.map(async ({ servico, quantidade }) => {
        const servicoQuery = new Parse.Query('Servico');
        const servicoReal = await servicoQuery.get(servico.id); // Buscar o serviço real
        return {
          servico: servicoReal.toPointer(), // Criar um Pointer
          quantidade,
          precoUnitario: servicoReal.get('preco'),
          subtotal: servicoReal.get('preco') * quantidade,
        };
      })
    );

    const valorTotal = servicosArray.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    orcamento.set('cliente', clientePointer);
    orcamento.set('data', data);
    orcamento.set('servicos', servicosArray);
    orcamento.set('total', valorTotal);
    orcamento.set('notas', notas);
    orcamento.set('situacao', situacao);

    return await orcamento.save();
  } catch (erro) {
    console.error('Erro ao atualizar orçamento:', erro);
  }
};

export const deleteQuote = async (id: string) => {
  const query = new Parse.Query('Orcamento');
  try {
    const orcamento = await query.get(id);
    await orcamento.destroy();
    return true;
  } catch (erro) {
    console.error('Erro ao excluir orçamento:', erro);
  }
};
