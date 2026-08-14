-- =========================================================
-- CATEGORIA
-- =========================================================

INSERT INTO tb_categoria(nome) VALUES ('Carnes');
INSERT INTO tb_categoria(nome) VALUES ('Laticínios');
INSERT INTO tb_categoria(nome) VALUES ('Bebidas');
INSERT INTO tb_categoria(nome) VALUES ('Grãos');
INSERT INTO tb_categoria(nome) VALUES ('Massas');
INSERT INTO tb_categoria(nome) VALUES ('Hortaliças');
INSERT INTO tb_categoria(nome) VALUES ('Frutas');
INSERT INTO tb_categoria(nome) VALUES ('Temperos');
INSERT INTO tb_categoria(nome) VALUES ('Congelados');
INSERT INTO tb_categoria(nome) VALUES ('Produtos de Limpeza');

-- =========================================================
-- PRODUTO
-- =========================================================
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em) VALUES ('Peito de Frango', 1, 'KG', 25.500, 10.000, 30.000, TRUE,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em) VALUES ('Carne Moída', 1, 'KG', 18.000, 8.000, 25.000, TRUE,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em) VALUES ('Leite Integral', 2, 'L', 12.000, 5.000, 20.000, TRUE,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em) VALUES ('Queijo Mussarela', 2, 'KG', 7.500, 3.000, 10.000, TRUE,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em) VALUES ('Arroz', 4, 'KG', 40.000, 15.000, 50.000, TRUE,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em) VALUES ('Feijão Carioca', 4, 'KG', 22.000, 8.000, 30.000, TRUE,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em) VALUES ('Macarrão Espaguete', 5, 'PCT', 35.000, 10.000, 50.000, TRUE,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em) VALUES ('Tomate', 6, 'KG', 4.500, 5.000, 15.000, TRUE,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em) VALUES ('Refrigerante Cola', 3, 'L', 8.000, 10.000, 30.000, TRUE,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em) VALUES ('Detergente', 10, 'KG', 2500.000, 1000.000, 5000.000, TRUE,CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- =========================================================
-- MOVIMENTACAO
-- =========================================================

INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (1,'ENTRADA',30.000,'Compra de frango para reposição do estoque', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (1,'SAIDA',4.500,'Utilização na produção', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (2,'ENTRADA',20.000,'Compra de carne moída', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (3,'ENTRADA',15.000,'Reposição de leite', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (4,'SAIDA',2.500,'Utilização na cozinha', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (5,'ENTRADA',50.000,'Compra mensal de arroz', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (6,'SAIDA',8.000,'Consumo na produção', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (7,'AJUSTE',35.000,'Ajuste após conferência do estoque', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (8,'DESCARTE',2.000,'Produtos deteriorados', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (9,'ENTRADA',20.000,'Reposição de bebidas', CURRENT_TIMESTAMP);

-- =========================================================
-- LISTA DE COMPRA
-- =========================================================

INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em) VALUES ('Compras da Semana','FINALIZADA',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em) VALUES ('Reposição de Carnes','FINALIZADA',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em) VALUES ('Bebidas','ABERTA',CURRENT_TIMESTAMP,NULL);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em) VALUES ('Produtos de Limpeza','FINALIZADA',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em) VALUES ('Compra Mensal','ABERTA',CURRENT_TIMESTAMP,NULL);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em) VALUES ('Hortaliças','CANCELADA',CURRENT_TIMESTAMP,NULL);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em) VALUES ('Reposição de Laticínios','FINALIZADA',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em) VALUES ('Estoque de Massas','ABERTA',CURRENT_TIMESTAMP,NULL);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em) VALUES ('Compra Emergencial','FINALIZADA',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em) VALUES ('Reposição Geral','ABERTA',CURRENT_TIMESTAMP,NULL);

-- =========================================================
-- LISTA COMPRA ITEM
-- =========================================================

INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (1,8,10.000,NULL,FALSE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (1,9,20.000,NULL,FALSE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (2,1,20.000,20.000,FALSE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (2,2,15.000,15.000,TRUE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (3,9,30.000,NULL,FALSE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (4,10,3000.000,3000.000,TRUE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (5,5,30.000,NULL,FALSE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (7,3,15.000,15.000,TRUE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (7,4,8.000,8.000,TRUE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (8,7,25.000,NULL,FALSE);