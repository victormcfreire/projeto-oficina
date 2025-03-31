import Parse from '../parseConfig';
import { createVehicle, updateVehicle } from './veiculoService';
import { Vehicle } from '../models/types';

export const createCustomer = async (
  nome: string,
  email: string,
  telefone: string,
  endereco: string,
  veiculo: Vehicle
) => {
  const Cliente = new Parse.Object('Cliente');
  Cliente.set('nome', nome);
  Cliente.set('email', email);
  Cliente.set('telefone', telefone);
  Cliente.set('endereco', endereco);

  try {
    let veiculoSalvo = await createVehicle(
      veiculo.make,
      veiculo.model,
      veiculo.year,
      veiculo.vin,
      veiculo.licensePlate
    );

    if (!veiculoSalvo) throw new Error("Veículo não foi salvo");

    Cliente.set('veiculo', veiculoSalvo);

    const resultado = await Cliente.save();
    return resultado;
  } catch (erro) {
    console.error('Erro ao cadastrar cliente:', erro);
  }
};

export const listCustomers = async () => {
  const query = new Parse.Query('Cliente');
  query.include('veiculo');
  try {
    const resultados = await query.find();
    return resultados.map((cliente: any) => ({
      id: cliente.id,
      name: cliente.get('nome'),
      email: cliente.get('email'),
      phone: cliente.get('telefone'),
      address: cliente.get('endereco'),
      vehicle: {
        id: cliente.get('veiculo').id,
        year: cliente.get('veiculo').get('ano'),
        vin: cliente.get('veiculo').get('vin'),
        model: cliente.get('veiculo').get('modelo'),
        make: cliente.get('veiculo').get('marca'),
        licensePlate: cliente.get('veiculo').get('placa'),
      },
    }));
  } catch (erro) {
    console.error('Erro ao buscar clientes:', erro);
  }
};

export const getCustomerById = async (customerId: string) => {
  try {
    const query = new Parse.Query('Cliente');
    query.include('veiculo');
    const cliente = await query.get(customerId);

    const veiculo = cliente.get('veiculo');

    return {
      id: cliente.id,
      name: cliente.get('nome'),
      email: cliente.get('email'),
      phone: cliente.get('telefone'),
      address: cliente.get('endereco'),
      vehicle: {
        id: veiculo.id,
        year: veiculo.get('ano'),
        vin: veiculo.get('vin'),
        model: veiculo.get('modelo'),
        make: veiculo.get('marca'),
        licensePlate: veiculo.get('placa'),
      },
    };
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    return null;
  }
};

export const updateCustomer = async (
  id: string,
  nome: string,
  email: string,
  telefone: string,
  endereco: string,
  veiculo: Vehicle
) => {
  const query = new Parse.Query('Cliente');
  try {
    const cliente = await query.get(id);
    cliente.set('nome', nome);
    cliente.set('email', email);
    cliente.set('telefone', telefone);
    cliente.set('endereco', endereco);

    const veiculoAtualizado = await updateVehicle(
      veiculo.id,
      veiculo.make,
      veiculo.model,
      veiculo.year,
      veiculo.vin,
      veiculo.licensePlate
    );
    const Veiculo = Parse.Object.extend('Veiculo');
    const veiculoPointer = new Veiculo();
    veiculoPointer.id = veiculoAtualizado.id;

    cliente.set('veiculo', veiculoPointer);

    return await cliente.save();
  } catch (erro) {
    console.error('Erro ao atualizar cliente:', erro);
  }
};

export const deleteCustomer = async (id: string) => {
  const query = new Parse.Query('Cliente');
  try {
    const cliente = await query.get(id);
    await cliente.destroy();
    return true;
  } catch (erro) {
    console.error('Erro ao excluir cliente:', erro);
  }
};
