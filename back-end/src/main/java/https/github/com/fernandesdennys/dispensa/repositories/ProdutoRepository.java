package https.github.com.fernandesdennys.dispensa.repositories;

import https.github.com.fernandesdennys.dispensa.entities.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProdutoRepository extends JpaRepository<Produto, Integer> {

    @Query("""
                SELECT p
                FROM Produto p
                JOIN FETCH p.categoria c
                WHERE p.ativo = true
                AND (
                    :categoriaId IS NULL
                    OR c.id = :categoriaId
                )
                AND (
                    :abaixoMinimo = false
                    OR p.quantidadeAtual < p.quantidadeMinima
                )
                AND (
                    :busca IS NULL
                    OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :busca, '%'))
                )
                ORDER BY
                    CASE
                        WHEN :ordenarPor = 'nome'
                        THEN p.nome
                    END ASC,
            
                    CASE
                        WHEN :ordenarPor = 'quantidade_atual'
                        THEN p.quantidadeAtual
                    END ASC,
                    CASE
                        WHEN :ordenarPor = 'quantidade_minima'
                        THEN p.quantidadeMinima
                    END ASC,
                    CASE
                        WHEN :ordenarPor = 'quantidade_ideal'
                        THEN p.quantidadeIdeal
                    END ASC,
                    CASE
                        WHEN :ordenarPor = 'criado_em'
                        THEN p.criadoEm
                    END ASC,
                    p.nome ASC
            """)
    Page<Produto> buscarProdutos(
            @Param("categoriaId") Integer categoriaId,
            @Param("abaixoMinimo") Boolean abaixoMinimo,
            @Param("busca") String busca,
            @Param("ordenarPor") String ordenarPor,
            Pageable pageable
    );


}
