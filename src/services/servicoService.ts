import Parse from "../parseConfig";

export const createService = async (nome: string, preco: number, descricao: string, horasEstimadas: number) => {
  const Servico = new Parse.Object("Servico");
  Servico.set("nome", nome);
  Servico.set("descricao", descricao);
  Servico.set("preco", preco);
  Servico.set("horas", horasEstimadas);

  try {
    const resultado = await Servico.save();
    return resultado;
  } catch (erro) {
    console.error("Erro ao criar serviço:", erro);
  }
};

export const listServices = async () => {
  const query = new Parse.Query("Servico");
  try {
    const resultados = await query.find();
    return resultados.map((servico: any) => ({
      id: servico.id,
      name: servico.get("nome"),
      price: servico.get("preco"),
      description: servico.get("descricao"),
      estimatedHours: servico.get("horas"),
    }));
  } catch (erro) {
    console.error("Erro ao buscar serviços:", erro);
  }
};

export const updateService = async (id: string, nome: string, preco: number, descricao: string, horasEstimadas: number) => {
  const query = new Parse.Query("Servico");
  try {
    const servico = await query.get(id);
    servico.set("nome", nome);
    servico.set("preco", preco);
    servico.set("descricao", descricao);
    servico.set("horas", horasEstimadas);
    return await servico.save();
  } catch (erro) {
    console.error("Erro ao atualizar serviço:", erro);
  }
};

export const deleteService = async (id: string) => {
  const query = new Parse.Query("Servico");
  try {
    const servico = await query.get(id);
    await servico.destroy();
    return true;
  } catch (erro) {
    console.error("Erro ao excluir serviço:", erro);
  }
};
