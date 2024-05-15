export class Product {
  constructor({
    id,
    descricao,
    categoria,
    valor,
    criadoEm = new Date(),
    criadoPor = "pialabs",
  }) {
    this.id = id;
    this.descricao = descricao;
    this.categoria = categoria;
    this.valor = valor;
    this.criadoEm = criadoEm;
    this.criadoPor = criadoPor;
  }
}
