-- =========================================================
-- USUARIO (usuário de teste fixo — senha: 123456)
-- =========================================================

INSERT INTO tb_usuario (nome, email, senha, criado_em) VALUES ('Guilherme', 'teste@teste.com', '$2b$10$0f/mHpUMpo8ERCtvXXok4u9MzepBYmfrHWKBTeXNbR/XChpN1/6jO', CURRENT_TIMESTAMP);

-- =========================================================
-- CATEGORIA
-- =========================================================

INSERT INTO tb_categoria (nome, usuario_id) VALUES ('Carnes', 1);
INSERT INTO tb_categoria (nome, usuario_id) VALUES ('Laticínios', 1);
INSERT INTO tb_categoria (nome, usuario_id) VALUES ('Bebidas', 1);
INSERT INTO tb_categoria (nome, usuario_id) VALUES ('Grãos', 1);
INSERT INTO tb_categoria (nome, usuario_id) VALUES ('Massas', 1);
INSERT INTO tb_categoria (nome, usuario_id) VALUES ('Hortaliças', 1);
INSERT INTO tb_categoria (nome, usuario_id) VALUES ('Frutas', 1);
INSERT INTO tb_categoria (nome, usuario_id) VALUES ('Temperos', 1);
INSERT INTO tb_categoria (nome, usuario_id) VALUES ('Congelados', 1);
INSERT INTO tb_categoria (nome, usuario_id) VALUES ('Produtos de Limpeza', 1);

-- =========================================================
-- PRODUTO
-- =========================================================

INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em, data_validade, usuario_id) VALUES ('Peito de Frango', 1, 'KG', 5.000, 5.000, 10.000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, DATEADD('DAY', 3, CURRENT_DATE), 1);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em, data_validade, usuario_id) VALUES ('Carne Moída', 1, 'KG', 8.000, 4.000, 8.000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, DATEADD('DAY', 4, CURRENT_DATE), 1);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em, data_validade, usuario_id) VALUES ('Leite Integral', 2, 'L', 2.000, 5.000, 8.000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, DATEADD('DAY', 5, CURRENT_DATE), 1);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em, data_validade, usuario_id) VALUES ('Queijo Mussarela', 2, 'KG', 5.000, 2.000, 5.000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, DATEADD('DAY', 15, CURRENT_DATE), 1);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em, data_validade, usuario_id) VALUES ('Arroz', 4, 'KG', 5.000, 5.000, 10.000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, DATEADD('DAY', 180, CURRENT_DATE), 1);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em, data_validade, usuario_id) VALUES ('Feijão Carioca', 4, 'KG', 10.000, 5.000, 10.000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, DATEADD('DAY', 150, CURRENT_DATE), 1);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em, data_validade, usuario_id) VALUES ('Macarrão Espaguete', 5, 'PCT', 12.000, 4.000, 7.000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, DATEADD('DAY', 200, CURRENT_DATE), 1);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em, data_validade, usuario_id) VALUES ('Tomate', 6, 'UN', 4.000, 5.000, 10.000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, DATEADD('DAY', 2, CURRENT_DATE), 1);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em, data_validade, usuario_id) VALUES ('Refrigerante Cola', 3, 'L', 1.000, 8.000, 10.000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, DATEADD('DAY', 90, CURRENT_DATE), 1);
INSERT INTO tb_produto (nome, categoria_id, unidade, quantidade_atual, quantidade_minima, quantidade_ideal, ativo, criado_em, atualizado_em, data_validade, usuario_id) VALUES ('Detergente', 10, 'L', 0.000, 5.000, 9.000, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL, 1);

-- =========================================================
-- MOVIMENTACAO (sem usuario_id — escopada indiretamente via Produto)
-- =========================================================

INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (1,'ENTRADA',30.000,'Compra de frango para reposição do estoque', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (1,'SAIDA',4.000,'Utilização na produção', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (2,'ENTRADA',20.000,'Compra de carne moída', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (3,'ENTRADA',15.000,'Reposição de leite', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (4,'SAIDA',2.000,'Utilização na cozinha', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (5,'ENTRADA',50.000,'Compra mensal de arroz', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (6,'SAIDA',8.000,'Consumo na produção', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (7,'AJUSTE',35.000,'Ajuste após conferência do estoque', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (8,'DESCARTE',2.000,'Produtos deteriorados', CURRENT_TIMESTAMP);
INSERT INTO tb_movimentacao (produto_id, tipo, quantidade, observacao, criado_em) VALUES (9,'ENTRADA',20.000,'Reposição de bebidas', CURRENT_TIMESTAMP);

-- =========================================================
-- LISTA DE COMPRA
-- =========================================================

INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em, usuario_id) VALUES ('Compras da Semana','FINALIZADA',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP, 1);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em, usuario_id) VALUES ('Reposição de Carnes','FINALIZADA',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP, 1);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em, usuario_id) VALUES ('Bebidas','ABERTA',CURRENT_TIMESTAMP,NULL, 1);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em, usuario_id) VALUES ('Produtos de Limpeza','FINALIZADA',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP, 1);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em, usuario_id) VALUES ('Compra Mensal','ABERTA',CURRENT_TIMESTAMP,NULL, 1);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em, usuario_id) VALUES ('Hortaliças','CANCELADA',CURRENT_TIMESTAMP,NULL, 1);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em, usuario_id) VALUES ('Reposição de Laticínios','FINALIZADA',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP, 1);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em, usuario_id) VALUES ('Estoque de Massas','ABERTA',CURRENT_TIMESTAMP,NULL, 1);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em, usuario_id) VALUES ('Compra Emergencial','FINALIZADA',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP, 1);
INSERT INTO tb_lista_compra (titulo, status, criado_em, finalizado_em, usuario_id) VALUES ('Reposição Geral','ABERTA',CURRENT_TIMESTAMP,NULL, 1);

-- =========================================================
-- LISTA COMPRA ITEM (sem usuario_id — escopada indiretamente via ListaCompra)
-- =========================================================

INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (1,8,10.000,NULL,FALSE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (1,9,10.000,NULL,FALSE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (2,1,10.000,20.000,FALSE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (2,2,15.000,15.000,TRUE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (3,9,10.000,NULL,FALSE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (4,10,10.000,10.000,TRUE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (5,5,10.000,NULL,FALSE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (7,3,10.000,15.000,TRUE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (7,4,8.000,8.000,TRUE);
INSERT INTO tb_lista_compra_item (lista_id, produto_id, quantidade_sugerida, quantidade_comprada, comprado) VALUES (8,7,25.000,NULL,FALSE);