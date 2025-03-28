import Parse from "../parseConfig";

export const createVehicle = async (marcaVeiculo: string, modeloVeiculo: string, anoFabricacao: string, numeroChassi: string, placa: string) => {
  const Veiculo = new Parse.Object("Veiculo");
  Veiculo.set("marca", marcaVeiculo);
  Veiculo.set("modelo", modeloVeiculo);
  Veiculo.set("ano", anoFabricacao);
  Veiculo.set("vin", numeroChassi);
  Veiculo.set("placa", placa);
  

  try {
    const resultado = await Veiculo.save();
    return resultado;
  } catch (erro) {
    console.error("Erro ao cadastrar veiculo:", erro);
  }
};

export const listVehicle = async () => {
  const query = new Parse.Query("Veiculo");
  try {
    const resultados = await query.find();
    return resultados.map((veiculo: any) => ({
      id: veiculo.id,
      marca: veiculo.get("marca"),
      modelo: veiculo.get("modelo"),
      ano: veiculo.get("ano"),
      vin: veiculo.get("vin"),
      placa: veiculo.get("placa"),
    }));
  } catch (erro) {
    console.error("Erro ao buscar veículos:", erro);
  }
};

export const updateVehicle = async (id: string, marcaVeiculo: string, modeloVeiculo: string, anoFabricacao: string, numeroChassi: string, placa: string) => {
  const query = new Parse.Query("Veiculo");
  try {
    const veiculo = await query.get(id);
    veiculo.set("marca", marcaVeiculo);
    veiculo.set("modelo", modeloVeiculo);
    veiculo.set("ano", anoFabricacao);
    veiculo.set("vin", numeroChassi);
    veiculo.set("placa", placa);
    return await veiculo.save();
  } catch (erro) {
    console.error("Erro ao atualizar veículo:", erro);
  }
};

export const deleteVehicle = async (id: string) => {
  const query = new Parse.Query("Veiculo");
  try {
    const veiculo = await query.get(id);
    await veiculo.destroy();
    return true;
  } catch (erro) {
    console.error("Erro ao excluir veículo:", erro);
  }
};
